import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { Category } from '@/types/listing';
import { categoryIcons } from '@/data/subcategories';

interface CategoryDropdownProps {
  value?: Category | '';
  onChange?: (value: Category | '') => void;
}

const categories: (Category | '')[] = [
  '',
  'transport',
  'realEstate',
  'jobs',
  'services',
  'personalItems',
  'homeAndGarden',
  'autoParts',
  'electronics',
  'hobbies',
  'animals',
  'business',
];

export const CategoryDropdown = ({ value = '', onChange }: CategoryDropdownProps) => {
  const { t } = useLanguage();

  const SelectedIcon = categoryIcons[value] || categoryIcons[''];
  const displayLabel = value ? t(value as TranslationKey) : t('allCategories');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary whitespace-nowrap min-w-[160px]"
        >
          <SelectedIcon className="w-5 h-5 text-emerald-600" />
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] bg-card border-border max-h-[400px] overflow-y-auto">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          return (
            <DropdownMenuItem
              key={category || 'all'}
              onClick={() => onChange?.(category)}
              className="cursor-pointer gap-2"
            >
              <Icon className="w-5 h-5 text-emerald-600" />
              <span>{category ? t(category as TranslationKey) : t('allCategories')}</span>
              {value === category && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
