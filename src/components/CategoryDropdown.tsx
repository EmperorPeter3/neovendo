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

interface CategoryDropdownProps {
  value?: Category | '';
  onChange?: (value: Category | '') => void;
}

const categories: { id: Category | ''; icon: string }[] = [
  { id: '', icon: '🔍' },
  { id: 'transport', icon: '🚗' },
  { id: 'realEstate', icon: '🏠' },
  { id: 'jobs', icon: '💼' },
  { id: 'services', icon: '🔧' },
  { id: 'personalItems', icon: '👕' },
  { id: 'homeAndGarden', icon: '🏡' },
  { id: 'autoParts', icon: '🔩' },
  { id: 'electronics', icon: '📱' },
  { id: 'hobbies', icon: '🎨' },
  { id: 'animals', icon: '🐕' },
  { id: 'business', icon: '🏢' },
];

export const CategoryDropdown = ({ value = '', onChange }: CategoryDropdownProps) => {
  const { t } = useLanguage();

  const selectedCategory = categories.find(c => c.id === value) || categories[0];
  const displayLabel = value ? t(value as TranslationKey) : t('allCategories');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary whitespace-nowrap min-w-[160px]"
        >
          <span className="text-lg">{selectedCategory.icon}</span>
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] bg-card border-border max-h-[400px] overflow-y-auto">
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.id || 'all'}
            onClick={() => onChange?.(category.id)}
            className="cursor-pointer gap-2"
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.id ? t(category.id as TranslationKey) : t('allCategories')}</span>
            {value === category.id && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
