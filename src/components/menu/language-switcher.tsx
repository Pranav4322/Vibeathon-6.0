"use client";

import { useTranslation } from "@/lib/i18n/language-context";
import { SupportedLanguage } from "@/lib/i18n/dictionaries";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "es", label: "Español" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors text-xs font-medium">
        <Globe size={14} />
        <span className="uppercase">{language}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 bg-white rounded-xl shadow-lg border-stone-100">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer rounded-lg mx-1 my-0.5 ${
              language === lang.code ? "bg-amber-50 text-amber-600 font-bold" : "text-stone-600"
            }`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
