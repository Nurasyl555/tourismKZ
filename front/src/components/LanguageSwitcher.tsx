import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Текущий язык для отображения
  const currentLang = i18n.language ? i18n.language.toUpperCase().slice(0, 2) : 'EN';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-16">
          <Globe className="w-4 h-4 mr-2" />
          {currentLang}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white z-50">
        <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
          English (EN)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ru')} className="cursor-pointer">
          Русский (RU)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('kk')} className="cursor-pointer">
          Қазақша (KK)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}