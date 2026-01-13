import { Link } from 'react-router-dom';
import { Category } from '@/types/listing';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';

interface CategoryCardProps {
  category: {
    id: Category;
    icon: string;
  };
}

const categoryGradients: Record<Category, string> = {
  electronics: 'from-blue-500 to-cyan-400',
  furniture: 'from-amber-500 to-orange-400',
  jobs: 'from-purple-500 to-pink-400',
  services: 'from-emerald-500 to-teal-400',
  realEstate: 'from-rose-500 to-red-400',
};

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const { t } = useLanguage();

  return (
    <Link
      to={`/search?category=${category.id}`}
      className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryGradients[category.id]} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
        {category.icon}
      </div>
      <span className="text-sm font-medium text-foreground text-center">
        {t(category.id as TranslationKey)}
      </span>
    </Link>
  );
};
