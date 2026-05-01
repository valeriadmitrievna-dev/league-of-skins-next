"use client";
import { GlobeIcon } from "lucide-react";
import { type FC } from "react";

import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/shared/constants/languages";
import { Combobox, ComboboxContent, ComboboxItem, ComboboxList, ComboboxTrigger } from "@/components/ui/combobox";
import { useChangeLanguage, useT } from "next-i18next/client";

const LanguageSwitcher: FC = () => {
  const { i18n } = useT();
  const locale = i18n.language;

  const changeLanguage = useChangeLanguage();

  const changeLanguageHandler = (lang: string | null) => {
    if (lang) {
      changeLanguage(lang);
    }
  };

  return (
    <Combobox
      items={Object.entries(LANGUAGES)}
      value={locale}
      onValueChange={changeLanguageHandler}
      inputValue=""
      onInputValueChange={() => {}}
    >
      <ComboboxTrigger
        render={
          <Button variant="outline" size="icon">
            <GlobeIcon />
          </Button>
        }
      />
      <ComboboxContent className="min-w-40 p-1 py-2">
        <ComboboxList className="scrollbar p-0 px-1">
          {([locale, { name }]) => {
            const formattedName = name[0].toUpperCase() + name.slice(1);
            return (
              <ComboboxItem key={locale} value={locale}>
                {formattedName}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default LanguageSwitcher;
