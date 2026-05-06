import { Box, Heart, Search } from "lucide-react";
import { getT } from "next-i18next/server";
import { FC } from "react";

import { Typography } from "@/components/Typography";

import SubTitle from "./SubTitle";

const FunctionalitySection: FC<{ className?: string }> = async ({ className }) => {
  const { t } = await getT("home");

  const functionalityList = [
    {
      title: t("functionality.search-and-filters"),
      description: t("functionality.search-and-filters-description"),
      icon: <Search />,
    },
    {
      title: t("functionality.wishlists"),
      description: t("functionality.wishlists-description"),
      icon: <Heart />,
    },
    {
      title: t("functionality.collection"),
      description: t("functionality.collection-description"),
      icon: <Box />,
    },
  ];

  return (
    <section className={className}>
      <div className="max-w-2xl">
        <SubTitle>{t("functionality.subtitle")}</SubTitle>
        <Typography.H2 className="mt-2">{t("functionality.title")}</Typography.H2>
        <Typography.Muted className="mt-4">{t("functionality.description")}</Typography.Muted>
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
  );
};

export default FunctionalitySection;
