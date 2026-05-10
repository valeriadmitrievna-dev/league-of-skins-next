"use client";
import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./ui/button";

interface ScrollTopButtonProps {
  className?: string;
}

const ScrollTopButton: FC<ScrollTopButtonProps> = () => {
  const { t } = useTranslation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollHandler = () => {
    if (window.scrollY > 140) {
      if (!showScrollTop) setShowScrollTop(true);
    } else {
      if (showScrollTop) setShowScrollTop(false);
    }
  };

  const scrollToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [showScrollTop]);

  if (!showScrollTop) {
    return null;
  }

  return (
    <Button className="fixed z-10 bottom-5 right-5" onClick={scrollToTopHandler} size="lg">
      <ArrowUpIcon />
      {t("shared.scroll_to_top")}
    </Button>
  );
};

export default ScrollTopButton;
