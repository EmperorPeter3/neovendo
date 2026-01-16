import { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
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
import { subcategoriesData, categoryIcons, Subcategory } from '@/data/subcategories';
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
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const { t } = useLanguage();

  const displayLabel = value ? t(value as TranslationKey) : t('allCategories');
  const SelectedIcon = categoryIcons[value] || categoryIcons[''];

  const handleCategorySelect = (category: Category | '') => {
    if (category === '') {
      onChange?.('');
      setIsOpen(false);
      setExpandedSubcategory(null);
    } else {
      setSelectedCategory(category);
      setExpandedSubcategory(null);
    }
  };

  const handleSubcategorySelect = (category: Category, subcategory: Subcategory) => {
    // If subcategory has children, expand it instead of selecting
    if (subcategory.children && subcategory.children.length > 0) {
      setExpandedSubcategory(subcategory.id);
    } else {
      onChange?.(category, subcategory.id);
      setIsOpen(false);
      setExpandedSubcategory(null);
    }
  };

  const handleChildSubcategorySelect = (category: Category, childId: string) => {
    onChange?.(category, childId);
    setIsOpen(false);
    setExpandedSubcategory(null);
  };

  const subcategories = selectedCategory ? subcategoriesData[selectedCategory] : [];
  const expandedParent = subcategories.find(sub => sub.id === expandedSubcategory);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary whitespace-nowrap min-w-[160px]"
      >
        <SelectedIcon className="w-5 h-5 text-emerald-600" />
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setExpandedSubcategory(null); }}>
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
                {(() => {
                  const AllIcon = categoryIcons[''];
                  return <AllIcon className="w-5 h-5 text-emerald-600" />;
                })()}
                <span className="flex-1 font-medium">{t('allCategories')}</span>
              </button>
              
              {categories.map((category) => {
                const Icon = categoryIcons[category];
                return (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left",
                      selectedCategory === category && "bg-secondary"
                    )}
                  >
                    <Icon className="w-5 h-5 text-emerald-600" />
                    <span className="flex-1 font-medium">{t(category as TranslationKey)}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>

            {/* Right side - Subcategories */}
            <div className="flex-1 p-6 overflow-y-auto bg-background">
              {selectedCategory && !expandedSubcategory && (
                <ul className={cn(
                  "grid gap-3",
                  subcategories.length > 10 ? "grid-cols-2" : "grid-cols-1"
                )}>
                  {subcategories.map((subcategory) => (
                    <li key={subcategory.id}>
                      <button
                        onClick={() => handleSubcategorySelect(selectedCategory, subcategory)}
                        className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition-colors text-left w-full"
                      >
                        <span>{t(subcategory.id as TranslationKey)}</span>
                        {subcategory.children && subcategory.children.length > 0 && (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Show children when parent is expanded */}
              {selectedCategory && expandedParent && expandedParent.children && (
                <div>
                  <button
                    onClick={() => setExpandedSubcategory(null)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t('back')}</span>
                  </button>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {t(expandedParent.id as TranslationKey)}
                  </h3>
                  <ul className="grid gap-3 grid-cols-1">
                    {expandedParent.children.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => handleChildSubcategorySelect(selectedCategory, child.id)}
                          className="text-base font-semibold text-foreground hover:text-primary transition-colors text-left"
                        >
                          {t(child.id as TranslationKey)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
