import { Box, Heart, Search } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";

import { Typography } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import CatalogSection from "@/widgets/Home/CatalogSection";
import HeroSection from "@/widgets/Home/HeroSection";
import SubTitle from "@/widgets/Home/SubTitle";

const HomePage: FC = () => {
  const functionalityList = [
    {
      title: "Поиск и фильтры",
      description: "По чемпиону, редкости, линейке образов или цветовой схеме. Найти конкретный скин — секунды.",
      icon: <Search />,
    },
    {
      title: "Вишлисты",
      description: "Собирай образы в списки и делись ими с друзьями. Удобно перед днём рождения или просто чтобы не забыть.",
      icon: <Heart />,
    },
    {
      title: "Коллекция",
      description: "Загрузи инвентарь и отслеживай что уже куплено, сколько потрачено RP и что ещё хочется.",
      icon: <Box />,
    },
  ];

  return (
    <>
      <HeroSection />

      <section className="max-w-6xl mx-auto px-4 mt-24">
        <div className="max-w-2xl">
          <SubTitle>Возможности</SubTitle>
          <Typography.H2 className="mt-2">Всё, что нужно для коллекции</Typography.H2>
          <Typography.Muted className="mt-4">Никаких лишних функций — только то, что реально используешь</Typography.Muted>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {functionalityList.map((i) => (
            <div
              key={i.title}
              className="rounded-2xl border border-primary/10 p-6 bg-background transition hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 mb-4">{i.icon}</div>

              <Typography.Large>{i.title}</Typography.Large>
              <Typography.Muted className="mt-2">{i.description}</Typography.Muted>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-28 py-20 bg-muted/30 rounded-xl">
        <div className="max-w-6xl mx-auto px-4">
          <Typography.H2 className="text-center">Всё, что нужно — в одном месте</Typography.H2>

          <div className="grid md:grid-cols-3 gap-6 mt-10 text-center">
            <div>
              <Typography.H1>1500+</Typography.H1>
              <Typography.Muted className="mt-2">Скинов в каталоге</Typography.Muted>
            </div>

            <div>
              <Typography.H1>100%</Typography.H1>
              <Typography.Muted className="mt-2">Бесплатный доступ</Typography.Muted>
            </div>

            <div>
              <Typography.H1>~1 мин</Typography.H1>
              <Typography.Muted className="mt-2">Чтобы собрать вишлист</Typography.Muted>
            </div>
          </div>
        </div>
      </section>

      <CatalogSection />

      <section className="max-w-6xl mx-auto px-4 mt-24 flex flex-col md:flex-row items-center gap-12">
        <div className="max-w-md">
          <SubTitle>Вишлисты</SubTitle>
          <Typography.H2 className="mt-2">Поделись — и друзья поймут намёк</Typography.H2>
          <Typography.Muted className="mt-4">
            Создай список желаемых скинов и отправь ссылку. Публичный или приватный — как хочешь.
          </Typography.Muted>

          <Link href="/wishlists">
            <Button className="mt-6">Создать вишлист</Button>
          </Link>
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden border border-primary/10 bg-muted/30 h-[320px] flex items-center justify-center shadow-lg">
          Превью вишлиста
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-24 flex flex-col md:flex-row-reverse items-center gap-12">
        <div className="max-w-md">
          <SubTitle>Коллекция</SubTitle>
          <Typography.H2 className="mt-2">Отслеживай всё, что уже есть</Typography.H2>
          <Typography.Muted className="mt-4">
            Загрузи инвентарь и смотри, сколько потрачено RP и какие скины ещё хочется добавить.
          </Typography.Muted>

          <Link href="/collection">
            <Button className="mt-6">Перейти к коллекции</Button>
          </Link>
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden border border-primary/10 bg-muted/30 h-[320px] flex items-center justify-center shadow-lg">
          Превью коллекции
        </div>
      </section>

      <section className="mt-28">
        <div className="max-w-4xl mx-auto px-6 py-16 rounded-2xl bg-primary text-primary-foreground text-center shadow-xl">
          <Typography.H2>Начни собирать свою коллекцию</Typography.H2>

          <Typography.Muted className="mt-4 text-primary-foreground/80">
            Это бесплатно и занимает меньше минуты
          </Typography.Muted>

          <Link href="/search/skins">
            <Button className="mt-6 bg-white text-black hover:bg-white/90">Открыть каталог</Button>
          </Link>
        </div>
      </section>

      <footer className="mt-20 border-t border-gray-700/20 flex flex-col md:flex-row gap-3 items-center justify-between py-8">
        <Link href="/">
          <div className="flex items-center gap-3 md:gap-4 relative">
            <span className="text-lg leading-none xl:text-2xl font-black uppercase tracking-wider text-primary">
              League of Skins
            </span>
            <div className="absolute -inset-1 bg-primary/10 blur-lg"></div>
          </div>
        </Link>

        <Typography.Muted>Не аффилирован с Riot Games</Typography.Muted>
      </footer>
    </>
  );
};

export default HomePage;
