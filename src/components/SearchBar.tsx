import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  initialValue?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ variant = 'compact', initialValue = '', onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full h-14 pl-12 pr-32 text-lg rounded-2xl border-2 border-border bg-card shadow-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="absolute right-2 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
            <Button
              type="submit"
              className="gradient-hero text-primary-foreground hover:opacity-90 transition-opacity px-6"
            >
              {t('search')}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-muted-foreground">
          <Search className="w-4 h-4" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-4 rounded-xl"
        />
      </div>
    </form>
  );
};
