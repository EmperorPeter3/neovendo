import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { Category } from '@/types/listing';
import { subcategoriesData, categoryIcons } from '@/data/subcategories';
import { cn } from '@/lib/utils';

interface CategoryModalProps {
  value?: Category | '';
  onChange?: (value: Category | '', subcategory?: string) => void;
}

const categories: Category[] = [
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

export const CategoryModal = ({ value = '', onChange }: CategoryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    value ? (value as Category) : 'transport'
  );
  const { t } = useLanguage();

  const displayLabel = value ? t(value as TranslationKey) : t('allCategories');
  const selectedIcon = categoryIcons[value] || categoryIcons[''];

  const handleCategorySelect = (category: Category | '') => {
    if (category === '') {
      onChange?.('');
      setIsOpen(false);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSubcategorySelect = (category: Category, subcategoryId?: string) => {
    onChange?.(category, subcategoryId);
    setIsOpen(false);
  };

  const subcategories = selectedCategory ? subcategoriesData[selectedCategory] : [];

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary whitespace-nowrap min-w-[160px]"
      >
        <span className="text-lg">{selectedIcon}</span>
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-border">
            <DialogTitle>{t('categories')}</DialogTitle>
          </DialogHeader>
          
          <div className="flex min-h-[500px]">
            {/* Left side - Main categories */}
            <div className="w-64 border-r border-border overflow-y-auto bg-card">
              {/* All categories option */}
              <button
                onClick={() => handleCategorySelect('')}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left",
                  value === '' && "bg-secondary"
                )}
              >
                <span className="text-xl">{categoryIcons['']}</span>
                <span className="flex-1 font-medium">{t('allCategories')}</span>
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left",
                    selectedCategory === category && "bg-secondary"
                  )}
                >
                  <span className="text-xl">{categoryIcons[category]}</span>
                  <span className="flex-1 font-medium">{t(category as TranslationKey)}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>

            {/* Right side - Subcategories */}
            <div className="flex-1 p-6 overflow-y-auto bg-background">
              {selectedCategory && (
                <>
                  <button
                    onClick={() => handleSubcategorySelect(selectedCategory)}
                    className="flex items-center gap-2 mb-6 text-xl font-bold hover:text-primary transition-colors"
                  >
                    {t(selectedCategory as TranslationKey)}
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => handleSubcategorySelect(selectedCategory, subcategory.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors text-left py-1"
                      >
                        {subcategory.translationKey}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
