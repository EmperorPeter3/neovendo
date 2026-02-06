import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { Category } from '@/types/listing';
import { subcategoriesData, Subcategory } from '@/data/subcategories';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Search as SearchIcon, 
  House, 
  Briefcase, 
  Wrench, 
  Shirt, 
  Sofa, 
  Cog, 
  Smartphone, 
  Palette, 
  PawPrint, 
  Building2,
  CarFront,
  LucideIcon,
} from 'lucide-react';

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

const categoryIcons: Record<Category | '', LucideIcon> = {
  '': SearchIcon,
  transport: CarFront,
  realEstate: House,
  jobs: Briefcase,
  services: Wrench,
  personalItems: Shirt,
  homeAndGarden: Sofa,
  autoParts: Cog,
  electronics: Smartphone,
  hobbies: Palette,
  animals: PawPrint,
  business: Building2,
};

interface MobileCategorySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: Category | '';
  selectedSubcategory: string;
  onSelectCategory: (category: Category | '', subcategory?: string) => void;
}

export const MobileCategorySelector = ({
  isOpen,
  onClose,
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
}: MobileCategorySelectorProps) => {
  const { t } = useLanguage();
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});
  const [openAccordionValue, setOpenAccordionValue] = useState<string | undefined>(undefined);

  // Auto-expand to show selected subcategory
  useEffect(() => {
    if (isOpen && selectedCategory && selectedSubcategory) {
      // Open the accordion for the selected category
      setOpenAccordionValue(selectedCategory);
      
      // Find and expand parent subcategory if selected is a child
      const subcategories = subcategoriesData[selectedCategory];
      for (const sub of subcategories) {
        if (sub.children?.some(child => child.id === selectedSubcategory)) {
          setExpandedSubcategories(prev => ({
            ...prev,
            [sub.id]: true
          }));
          break;
        }
      }
    }
  }, [isOpen, selectedCategory, selectedSubcategory]);

  if (!isOpen) return null;

  // Helper to check if a subcategory is a parent of the selected one
  const isParentSubcategory = (sub: Subcategory, category: Category): boolean => {
    if (!selectedSubcategory || selectedCategory !== category) return false;
    if (sub.children) {
      return sub.children.some(child => child.id === selectedSubcategory);
    }
    return false;
  };

  const handleCategorySelect = (category: Category | '') => {
    onSelectCategory(category);
    onClose();
  };

  const handleSubcategorySelect = (category: Category, subcategoryId: string) => {
    onSelectCategory(category, subcategoryId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <h3 className="font-display font-semibold text-foreground">{t('categories')}</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* All categories option */}
        <button
          onClick={() => handleCategorySelect('')}
          className={cn(
            "w-full text-left px-4 py-3 rounded-lg text-base transition-colors flex items-center gap-3 mb-2",
            !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
          )}
        >
          {(() => {
            const AllIcon = categoryIcons[''];
            return <AllIcon className="w-5 h-5 text-emerald-600" />;
          })()}
          {t('all')}
        </button>

        <Accordion 
          type="single" 
          collapsible 
          value={openAccordionValue}
          onValueChange={setOpenAccordionValue}
          className="space-y-1"
        >
          {categories.map(category => {
            const Icon = categoryIcons[category];
            const subcategories = subcategoriesData[category];
            
            // Check if this category is a parent of the selected subcategory
            const isParentOfSelected = selectedCategory === category && selectedSubcategory;
            
            return (
              <AccordionItem 
                key={category} 
                value={category}
                className="border-none"
              >
                <AccordionTrigger 
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg text-base transition-colors flex items-center gap-3 hover:no-underline",
                    isParentOfSelected 
                      ? 'bg-muted text-foreground font-medium'
                      : 'bg-secondary hover:bg-secondary/80'
                  )}
                >
                  <Icon className="w-5 h-5 text-emerald-600" />
                  <span className="flex-1 text-left">{t(category as TranslationKey)}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-0 pt-1">
                  <div className="pl-8 space-y-1">
                    {subcategories.map(subcategory => {
                      const hasChildren = subcategory.children && subcategory.children.length > 0;
                      const isExpanded = expandedSubcategories[subcategory.id] ?? false;
                      const isSelected = selectedCategory === category && selectedSubcategory === subcategory.id;
                      const isParent = isParentSubcategory(subcategory, category);
                      
                      return (
                        <div key={subcategory.id}>
                          <button
                            onClick={() => {
                              if (hasChildren) {
                                setExpandedSubcategories(prev => ({
                                  ...prev,
                                  [subcategory.id]: !prev[subcategory.id]
                                }));
                              } else {
                                handleSubcategorySelect(category, subcategory.id);
                              }
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                              isSelected
                                ? 'bg-primary/20 text-primary font-medium'
                                : isParent
                                  ? 'bg-muted/60 text-foreground font-medium'
                                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground',
                              hasChildren && !isSelected && !isParent && 'font-medium text-foreground'
                            )}
                          >
                            <span>{t(subcategory.id as TranslationKey)}</span>
                            {hasChildren && (
                              isExpanded 
                                ? <ChevronDown className="w-4 h-4 shrink-0" />
                                : <ChevronRight className="w-4 h-4 shrink-0" />
                            )}
                          </button>
                          {/* Render nested children - collapsible */}
                          {hasChildren && isExpanded && (
                            <div className="pl-4 space-y-1 mt-1">
                              {subcategory.children!.map(child => (
                                <button
                                  key={child.id}
                                  onClick={() => handleSubcategorySelect(category, child.id)}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                                    selectedCategory === category && selectedSubcategory === child.id
                                      ? 'bg-primary/20 text-primary font-medium'
                                      : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                                  )}
                                >
                                  {t(child.id as TranslationKey)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};
