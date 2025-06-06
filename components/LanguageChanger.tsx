"use client";

import { UA, RU, GB } from 'country-flag-icons/react/3x2'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { i18nConfig } from '@/lib/i18n/i18n-config';


export function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();

  const handleChange = (locale: string) => {
    i18nConfig.defaultLocale = locale;
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 1000);
    const expires = '; expires=' + date.toUTCString();
    document.cookie = `NEXT_LOCALE=${locale};expires=${expires};path=/`;

    router.refresh(); 
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="outline" size="icon" className="bg-slate-400 hover:bg-slate-200">
          {currentLocale === "uk" ? <UA />
            : currentLocale === "ru" ? <RU />
            : <GB />
          }
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          textValue="uk" 
          className="flex items-center justify-between"
          onClick={() => handleChange("uk")}
        >
          <span>Українська</span>
          <div className="w-4 h-2">
            <UA /> 
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          textValue="ru" 
          className="flex items-center justify-between"
          onClick={() => handleChange("ru")}
        >
          <span>Русский</span>
          <div className="w-4 h-2">
            <RU /> 
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          textValue="en" 
          className="flex items-center justify-between"
          onClick={() => handleChange("en")}
        >
          <span>English</span>
          <div className="w-4 h-2">
            <GB /> 
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
