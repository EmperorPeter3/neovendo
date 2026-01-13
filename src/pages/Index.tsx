import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCard } from '@/components/CategoryCard';
import { ListingCard } from '@/components/ListingCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockListings, categories } from '@/data/mockListings';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroIllustration from '@/assets/hero-illustration.png';

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left animate-fade-in">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                {t('heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 text-balance">
                {t('heroSubtitle')}
              </p>
              <div className="max-w-xl">
                <SearchBar variant="hero" />
              </div>
            </div>
            
            <div className="hidden md:block animate-slide-up" style={{ animationDelay: '100ms' }}>
              <img 
                src={heroIllustration} 
                alt="Online marketplace illustration" 
                className="w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            {t('categories')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {t('recentListings')}
            </h2>
            <Link to="/search">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                {t('viewAll')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockListings.slice(0, 8).map((listing, index) => (
              <div
                key={listing.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden gradient-hero p-8 md:p-12 lg:p-16 text-center">
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to sell?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                List your item in minutes and connect with local buyers instantly.
              </p>
              <Link to="/create">
                <Button
                  size="lg"
                  className="bg-card text-primary hover:bg-card/90 font-semibold px-8"
                >
                  {t('createListing')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
