import { useState } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useUpdateListing } from '@/hooks/useListings';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const listingSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  category: z.enum(['electronics', 'furniture', 'jobs', 'services', 'realEstate']),
  price: z.number().min(0, 'Price must be positive'),
  city: z.string().trim().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  country: z.string().trim().min(1, 'Country is required').max(100, 'Country must be less than 100 characters'),
});

interface EditListingDialogProps {
  listing: {
    id: string;
    title: string;
    description: string | null;
    category: 'electronics' | 'furniture' | 'jobs' | 'services' | 'realEstate';
    price: number;
    city: string;
    country: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditListingDialog = ({ listing, open, onOpenChange }: EditListingDialogProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const updateListing = useUpdateListing();

  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description || '');
  const [category, setCategory] = useState(listing.category);
  const [price, setPrice] = useState(listing.price.toString());
  const [city, setCity] = useState(listing.city);
  const [country, setCountry] = useState(listing.country);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      price: parseFloat(price) || 0,
      city: city.trim(),
      country: country.trim(),
    };

    const result = listingSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await updateListing.mutateAsync({
        id: listing.id,
        ...result.data,
      });

      toast({
        title: t('success'),
        description: 'Listing updated successfully',
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update listing',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('title')}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you selling?"
              maxLength={100}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('description')}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item..."
              rows={4}
              maxLength={2000}
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('category')}</label>
            <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">📱 {t('electronics')}</SelectItem>
                <SelectItem value="furniture">🛋️ {t('furniture')}</SelectItem>
                <SelectItem value="jobs">💼 {t('jobs')}</SelectItem>
                <SelectItem value="services">🔧 {t('services')}</SelectItem>
                <SelectItem value="realEstate">🏠 {t('realEstate')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t('price')}</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
            />
            {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('city')}</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                maxLength={100}
              />
              {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('country')}</label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                maxLength={100}
              />
              {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-hero text-primary-foreground"
              disabled={updateListing.isPending}
            >
              {updateListing.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
