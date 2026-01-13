import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { ListingCard } from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockListings, categories } from '@/data/mockListings';
import { Category } from '@/types/listing';
import { SlidersHorizontal, X } from 'lucide-react';
import { TranslationKey } from '@/i18n/translations';

const SearchPage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') as Category | null;
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(categoryFilter);

  const filteredListings = useMemo(() => {
    return mockListings.filter(listing => {
      // Text search
      if (query) {
        const searchLower = query.toLowerCase();
        if (!listing.title.toLowerCase().includes(searchLower) &&
            !listing.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && listing.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (minPrice && listing.price < Number(minPrice)) {
        return false;
      }
      if (maxPrice && listing.price > Number(maxPrice)) {
        return false;
      }

      return true;
    });
  }, [query, selectedCategory, minPrice, maxPrice]);

  const handleSearch = (newQuery: string) => {
    setSearchParams(prev => {
      if (newQuery) {
        prev.set('q', newQuery);
      } else {
        prev.delete('q');
      }
      return prev;
    });
  };

  const handleApplyFilters = () => {
    setSearchParams(prev => {
      if (selectedCategory) {
        prev.set('category', selectedCategory);
      } else {
        prev.delete('category');
      }
      if (minPrice) {
        prev.set('minPrice', minPrice);
      } else {
        prev.delete('minPrice');
      }
      if (maxPrice) {
        prev.set('maxPrice', maxPrice);
      } else {
        prev.delete('maxPrice');
      }
      return prev;
    });
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams(prev => {
      prev.delete('category');
      prev.delete('minPrice');
      prev.delete('maxPrice');
      return prev;
    });
  };

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        {/* Search Header */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar initialValue={query} onSearch={handleSearch} />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('filters')}
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-72 shrink-0 hidden md:block">
              <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-foreground">{t('filters')}</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {t('category')}
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !selectedCategory ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                      }`}
                    >
                      {t('all')}
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                        }`}
                      >
                        {cat.icon} {t(cat.id as TranslationKey)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {t('priceRange')}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={t('minPrice')}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder={t('maxPrice')}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleResetFilters} className="flex-1">
                    {t('reset')}
                  </Button>
                  <Button onClick={handleApplyFilters} className="flex-1 gradient-hero text-primary-foreground">
                    {t('apply')}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">
                {t('listings')} ({filteredListings.length})
              </h2>
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">{t('noListings')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
