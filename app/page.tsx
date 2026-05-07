import Link from "next/link";
import { getT } from "next-i18next/server";
import { type FC } from "react";

import OrnateBlock from "@/components/OrnateBlock";
import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import CatalogSection from "@/widgets/Home/CatalogSection";
import FunctionalitySection from "@/widgets/Home/FunctionalitySection";
import HeroSection from "@/widgets/Home/HeroSection";
import SubTitle from "@/widgets/Home/SubTitle";

const HomePage: FC = async () => {
  const { t } = await getT("home");

  return (
    <>
      <HeroSection />

      <FunctionalitySection className="max-w-6xl mx-auto mt-24" />

      <section className="mt-28 py-20 bg-muted/30 rounded-xl max-w-6xl mx-auto">
        <Typography.H2 className="text-center">{t("benefits.title")}</Typography.H2>

        <div className="grid md:grid-cols-3 gap-6 mt-10 text-center">
          <div>
            <Typography.H1>1500+</Typography.H1>
            <Typography.Muted className="mt-2">{t("benefits.skins-in-catalog")}</Typography.Muted>
          </div>

          <div>
            <Typography.H1>100%</Typography.H1>
            <Typography.Muted className="mt-2">{t("benefits.free-access")}</Typography.Muted>
          </div>

          <div>
            <Typography.H1>~1 {t("benefits.min")}</Typography.H1>
            <Typography.Muted className="mt-2">{t("benefits.to-collect-wishlist")}</Typography.Muted>
          </div>
        </div>
      </section>

      <CatalogSection />

      <section className="max-w-6xl mx-auto px-4 mt-24 flex flex-col md:flex-row items-center gap-12">
        <div className="max-w-md">
          <SubTitle>{t("functionality.wishlists")}</SubTitle>
          <Typography.H2 className="mt-2">{t("wishlists.title")}</Typography.H2>
          <Typography.Muted className="mt-4">{t("wishlists.description")}</Typography.Muted>

          <Link href="/wishlists">
            <Button className="mt-6">{t("wishlists.create-wishlist")}</Button>
          </Link>
        </div>

        <OrnateBlock className="w-full">
          <div className="flex-1 rounded-2xl overflow-hidden border border-primary/10 bg-muted/30 h-80 flex items-center justify-center shadow-lg">
            Превью вишлиста
          </div>
        </OrnateBlock>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-24 flex flex-col md:flex-row-reverse items-center gap-12">
        <div className="max-w-md">
          <SubTitle>{t("functionality.collection")}</SubTitle>
          <Typography.H2 className="mt-2">{t("collection.title")}</Typography.H2>
          <Typography.Muted className="mt-4">{t("collection.description")}</Typography.Muted>

          <Link href="/collection">
            <Button className="mt-6">{t("collection.open-collection")}</Button>
          </Link>
        </div>

        <OrnateBlock className="w-full">
          <div className="flex-1 rounded-2xl overflow-hidden border border-primary/10 bg-muted/30 h-80 flex items-center justify-center shadow-lg">
            Превью коллекции
          </div>
        </OrnateBlock>
      </section>

      <section className="mt-28 max-w-4xl mx-auto px-6 py-16 rounded-2xl bg-primary text-primary-foreground text-center shadow-xl">
        <Typography.H2>{t("start-to-collect")}</Typography.H2>

        <Typography.Muted className="mt-4 text-primary-foreground/80">{t("it-is-free")}</Typography.Muted>

        <Link href="/search/skins">
          <Button className="mt-6 bg-white text-black hover:bg-white/90">{t("open-catalog")}</Button>
        </Link>
      </section>

      <footer className="mt-20 border-t border-gray-700/20 flex flex-col md:flex-row gap-3 items-center justify-between py-8">
        <Link href="/">
          <div className="flex items-center gap-3 md:gap-4 relative">
            <span className="text-lg leading-none xl:text-2xl font-black uppercase tracking-wider text-primary">League of Skins</span>
            <div className="absolute -inset-1 bg-primary/10 blur-lg"></div>
          </div>
        </Link>

        <Typography.Muted>{t("not-affiliated")}</Typography.Muted>
      </footer>
    </>
  );
};

export default HomePage;
