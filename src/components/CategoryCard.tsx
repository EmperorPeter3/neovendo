import { Link } from 'react-router-dom';
import { Category } from '@/types/listing';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { categoryIcons } from '@/data/subcategories';

interface CategoryCardProps {
  category: {
    id: Category;
  };
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const { t } = useLanguage();
  const Icon = categoryIcons[category.id];

  return (
    <Link
      to={`/search?category=${category.id}`}
      className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-emerald-600" />
      </div>
      <span className="text-sm font-medium text-foreground text-center">
        {t(category.id as TranslationKey)}
      </span>
    </Link>
  );
};
