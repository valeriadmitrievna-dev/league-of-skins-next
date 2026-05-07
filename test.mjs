import { createReadStream } from "fs";
import { readdir } from "fs/promises";
import { join, relative, extname } from "path";

import { S3Client, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { lookup } from "mime-types";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const CONFIG = {
  endpoint:    process.env.S3_ENDPOINT    || "https://s3.twcstorage.ru",
  region:      process.env.S3_REGION      || "ru-1",
  bucket:      process.env.S3_BUCKET      || "73c1cee7-1f4a-4afb-b8fb-03995ca0f6b8",
  accessKey:   process.env.S3_ACCESS_KEY  || "",
  secretKey:   process.env.S3_SECRET_KEY  || "",
  sourceDir:   process.env.SOURCE_DIR     || "../../Pictures/league-of-skins",
  s3Prefix:    process.env.S3_PREFIX      || "",
  concurrency: Number(process.env.CONCURRENCY) || 20,
  dryRun:      process.env.DRY_RUN === "true",
};

// ─── S3 CLIENT ───────────────────────────────────────────────────────────────

const s3 = new S3Client({
  endpoint:       CONFIG.endpoint,
  region:         CONFIG.region,
  forcePathStyle: true,
  credentials: {
    accessKeyId:     CONFIG.accessKey,
    secretAccessKey: CONFIG.secretKey,
  },
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Рекурсивно собирает все файлы в директории */
const collectFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      return entry.isDirectory() ? collectFiles(full) : full;
    })
  );
  return files.flat();
};

/** Проверяет наличие файла в S3 */
const existsInS3 = async (key) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: CONFIG.bucket, Key: key }));
    return true;
  } catch (err) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) return false;
    throw err;
  }
};

/** Загружает файл в S3 */
const uploadFile = async (filePath, key) => {
  const contentType = lookup(extname(filePath)) || "application/octet-stream";
  await s3.send(
    new PutObjectCommand({
      Bucket:      CONFIG.bucket,
      Key:         key,
      Body:        createReadStream(filePath),
      ContentType: contentType,
    })
  );
};

/** Ограничитель параллелизма */
const pLimit = (tasks, limit) => {
  let index = 0;
  const run = async () => {
    while (index < tasks.length) await tasks[index++]();
  };
  return Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, run));
};

// ─── ПРОГРЕСС ────────────────────────────────────────────────────────────────

const makeProgress = (total) => {
  let uploaded = 0, skipped = 0, failed = 0;
  const start = Date.now();

  const print = () => {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const done = uploaded + skipped + failed;
    const pct = (done / total * 100).toFixed(1);
    process.stdout.write(
      `\r[${elapsed}s] ${pct}% (${done}/${total}) | ✅ ${uploaded} загружено | ⏭  ${skipped} пропущено | ❌ ${failed} ошибок`
    );
  };

  return {
    uploaded: () => { uploaded++; print(); },
    skipped:  () => { skipped++;  print(); },
    failed:   () => { failed++;   print(); },
    summary:  () => {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log("\n\n─── Итог ───────────────────────────────────────");
      console.log(`  Всего файлов : ${total}`);
      console.log(`  Загружено    : ${uploaded}`);
      console.log(`  Пропущено    : ${skipped}`);
      console.log(`  Ошибок       : ${failed}`);
      console.log(`  Время        : ${elapsed}s`);
    },
  };
};

// ─── MAIN ────────────────────────────────────────────────────────────────────

const main = async () => {
  console.log("📦 S3 endpoint :", CONFIG.endpoint);
  console.log("🪣 Бакет       :", CONFIG.bucket);
  console.log("📂 Директория  :", CONFIG.sourceDir);
  if (CONFIG.dryRun) console.log("🔍 DRY RUN — файлы не будут загружены");
  console.log();

  const allFiles = await collectFiles(CONFIG.sourceDir);
  console.log(`Найдено файлов: ${allFiles.length}. Параллелизм: ${CONFIG.concurrency}\n`);

  const progress = makeProgress(allFiles.length);
  const errors = [];

  const tasks = allFiles.map((filePath) => async () => {
    const relPath = relative(CONFIG.sourceDir, filePath).replace(/\\/g, "/");
    const s3Key = CONFIG.s3Prefix ? `${CONFIG.s3Prefix}${relPath}` : relPath;

    try {
      if (await existsInS3(s3Key)) {
        progress.skipped();
        return;
      }
      if (!CONFIG.dryRun) await uploadFile(filePath, s3Key);
      progress.uploaded();
    } catch (err) {
      progress.failed();
      errors.push({ file: relPath, error: err.message });
    }
  });

  await pLimit(tasks, CONFIG.concurrency);
  progress.summary();

  if (errors.length > 0) {
    console.log("\n─── Ошибки ─────────────────────────────────────");
    errors.forEach(({ file, error }) => console.log(`  ❌ ${file}\n     ${error}`));
  }
};

main().catch((err) => {
  console.error("Критическая ошибка:", err);
  process.exit(1);
});
