import Link from "next/link";
import { getT } from "next-i18next/server";
import type { FC } from "react";

import OrnateBlock from "@/components/OrnateBlock";
import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";

import SubTitle from "./SubTitle";

const HeroSection: FC = async () => {
  const { t } = await getT("home");

  return (
    <section className="relative mt-20 px-4 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[120px] md:text-[200px] font-black text-primary/5 tracking-widest">SKINS</span>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center relative z-10">
        <div>
          <SubTitle>{t("hero.for-lol-players")}</SubTitle>

          <Typography.H1 className="mt-4 text-4xl md:text-6xl leading-tight">
            {t("hero.all-skins")}
            <br />
            <span className="text-primary">{t("hero.one-wishlist")}</span>
          </Typography.H1>

          <Typography.Muted className="mt-6 max-w-md">{t("hero.section-description")}</Typography.Muted>

          <div className="flex gap-3 mt-8">
            <Link href="/search/skins">
              <Button size="lg">{t("open-catalog")}</Button>
            </Link>
            <Link href="/wishlists">
              <Button variant="ghost" size="lg">
                {t("hero.my-wishlist")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative h-80 md:h-105 flex items-center justify-center">
          <OrnateBlock>
            <div className="size-65 md:size-80 rounded-2xl bg-muted/40 border border-primary/10 shadow-2xl flex items-center justify-center">
              Превью скинов
            </div>
          </OrnateBlock>
          <div className="absolute top-4 left-10 text-xl animate-bounce">⭐</div>
          <div className="absolute bottom-6 right-6 text-xl animate-pulse">💎</div>
          <div className="absolute top-10 right-10 text-xl">🔥</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
