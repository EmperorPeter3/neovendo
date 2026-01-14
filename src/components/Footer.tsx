import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">neovendo</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              The modern marketplace for buying and selling locally. Safe, simple, and sustainable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t('categories')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/search?category=transport" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('transport')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=realEstate" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('realEstate')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=electronics" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('electronics')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('services')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=jobs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('jobs')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Neovendo. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
