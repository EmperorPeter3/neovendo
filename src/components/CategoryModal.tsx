import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { Category } from '@/types/listing';
import { subcategoriesData, categoryIcons, Subcategory } from '@/data/subcategories';
import { cn } from '@/lib/utils';

interface CategoryModalProps {
  value?: Category | '';
  subcategoryValue?: string;
  onChange?: (value: Category | '', subcategory?: string) => void;
  showPath?: boolean;
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

// Helper to find subcategory path
const findSubcategoryPath = (
  subcategories: Subcategory[],
  targetId: string,
  currentPath: string[] = []
): string[] | null => {
  for (const sub of subcategories) {
    if (sub.id === targetId) {
      return [...currentPath, sub.id];
    }
    if (sub.children) {
      const found = findSubcategoryPath(sub.children, targetId, [...currentPath, sub.id]);
      if (found) return found;
    }
  }
  return null;
};

export const CategoryModal = ({ value = '', subcategoryValue = '', onChange, showPath = false }: CategoryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    value ? (value as Category) : 'transport'
  );
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const { t } = useLanguage();

  // Calculate display label and path
  const getDisplayInfo = () => {
    if (!value || !subcategoryValue) {
      return { label: t('allCategories'), path: null };
    }
    
    const categorySubcategories = subcategoriesData[value as Category];
    if (!categorySubcategories) {
      return { label: t(value as TranslationKey), path: null };
    }
    
    const subcategoryPath = findSubcategoryPath(categorySubcategories, subcategoryValue);
    if (subcategoryPath && subcategoryPath.length > 0) {
      const leafId = subcategoryPath[subcategoryPath.length - 1];
      const fullPath = [value as string, ...subcategoryPath];
      return { 
        label: t(leafId as TranslationKey), 
        path: fullPath.map(id => t(id as TranslationKey)).join(' → ')
      };
    }
    
    return { label: t(subcategoryValue as TranslationKey), path: `${t(value as TranslationKey)} → ${t(subcategoryValue as TranslationKey)}` };
  };

  const { label: displayLabel, path: categoryPath } = getDisplayInfo();
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
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="h-12 px-4 gap-2 rounded-xl border-2 border-border bg-card hover:bg-secondary whitespace-nowrap min-w-[160px] w-fit"
      >
        <SelectedIcon className="w-5 h-5 text-emerald-600" />
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </Button>
      {showPath && categoryPath && (
        <p className="text-sm text-muted-foreground">{categoryPath}</p>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setExpandedSubcategory(null); }}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-border">
            <DialogTitle>{t('categories')}</DialogTitle>
          </DialogHeader>
          
          <div className="flex h-[700px]">
            {/* Left side - Main categories */}
            <div className="w-64 border-r border-border overflow-y-auto bg-card flex-shrink-0">
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

            {/* Middle - Subcategories (2nd level) */}
            {selectedCategory && (
              <ScrollArea className="w-64 border-r border-border bg-background flex-shrink-0 h-full">
                <div className="p-4">
                  <ul className="flex flex-col gap-2">
                    {subcategories.map((subcategory) => (
                      <li key={subcategory.id}>
                        <button
                          onClick={() => handleSubcategorySelect(selectedCategory, subcategory)}
                          className={cn(
                            "flex items-center gap-2 text-base font-medium text-foreground hover:text-primary transition-colors text-left w-full py-1",
                            expandedSubcategory === subcategory.id && "text-primary"
                          )}
                        >
                          <span>{t(subcategory.id as TranslationKey)}</span>
                          {subcategory.children && subcategory.children.length > 0 && (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            )}

            {/* Right side - Child subcategories (3rd level) */}
            {selectedCategory && expandedParent && expandedParent.children && (
              <ScrollArea className="flex-1 bg-background h-full">
                <div className="p-4">
                  <ul className="flex flex-col gap-2">
                    {expandedParent.children.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => handleChildSubcategorySelect(selectedCategory, child.id)}
                          className="text-base font-normal text-foreground hover:text-primary transition-colors text-left py-1"
                        >
                          {t(child.id as TranslationKey)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
