import { ArrowBigUpIcon } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { useTranslation } from 'react-i18next';

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
    <div className="my-container absolute-center h-screen fixed! z-10 pointer-events-none flex items-end justify-end pb-5">
      <Button className="pointer-events-auto" onClick={scrollToTopHandler} size="lg">
        <ArrowBigUpIcon />
        {t('shared.scroll_to_top')}
      </Button>
    </div>
  );
};

export default ScrollTopButton;
