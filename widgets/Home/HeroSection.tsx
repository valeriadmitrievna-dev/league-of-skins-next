import Link from "next/link";
import type { FC } from "react";

import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";

const HeroSection: FC = () => {
  return (
    <section className="relative mt-20 px-4">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-primary/5 to-transparent blur-2xl" />

      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm mb-6">
          🎮 Для игроков League of Legends
        </div>

        <Typography.H1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          <span className="block">Все скины.</span>
          <span className="block">
            Один <span className="text-primary">вишлист.</span>
          </span>
        </Typography.H1>

        <Typography.Muted className="mt-6 max-w-2xl mx-auto text-base md:text-lg">
          Просматривай образы, отмечай любимые и делись списком с друзьями — пусть знают, что тебе подарить.
        </Typography.Muted>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link href="/search/skins">
            <Button size="lg">Открыть каталог</Button>
          </Link>
          <Link href="/wishlists">
            <Button variant="ghost" size="lg">
              Посмотреть вишлисты
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12">
        <div className="rounded-2xl overflow-hidden border border-primary/10 shadow-xl bg-muted/30 h-65 md:h-95 flex items-center justify-center">
          <span className="text-muted-foreground">Превью каталога / вишлиста</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
