import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ImagePlus, X, ArrowLeft, Loader2 } from 'lucide-react';
import { TranslationKey } from '@/i18n/translations';
import { useToast } from '@/hooks/use-toast';
import { useCreateListing, useUploadListingImage } from '@/hooks/useListings';
import { Category } from '@/types/listing';
import { CarFieldsForm, CarFieldsData, defaultCarFields } from '@/components/CarFieldsForm';
import { AtvFieldsForm, AtvFieldsData, defaultAtvFields } from '@/components/AtvFieldsForm';
import KartingFieldsForm, { KartingFieldsData, defaultKartingFields } from '@/components/KartingFieldsForm';
import QuadFieldsForm, { QuadFieldsData, defaultQuadFields } from '@/components/QuadFieldsForm';
import MopedFieldsForm, { MopedFieldsData, defaultMopedFields } from '@/components/MopedFieldsForm';
import MotoFieldsForm, { MotoFieldsData, defaultMotoFields } from '@/components/MotoFieldsForm';
import { CategoryModal } from '@/components/CategoryModal';
import { LocationPicker, LocationPickerValue } from '@/components/LocationPicker';
import { analyzeTitleForCategory, analyzeTitleForBrand, CategorySuggestion, BrandModelSuggestion } from '@/utils/titleAnalyzer';

const CreateListing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  
  const createListing = useCreateListing();
  const uploadImage = useUploadListingImage();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState('');
  const [locationValue, setLocationValue] = useState<LocationPickerValue | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carFields, setCarFields] = useState<CarFieldsData>(defaultCarFields);
  const [atvFields, setAtvFields] = useState<AtvFieldsData>(defaultAtvFields);
  const [kartingFields, setKartingFields] = useState<KartingFieldsData>(defaultKartingFields);
  const [quadFields, setQuadFields] = useState<QuadFieldsData>(defaultQuadFields);
  const [mopedFields, setMopedFields] = useState<MopedFieldsData>(defaultMopedFields);
  const [motoFields, setMotoFields] = useState<MotoFieldsData>(defaultMotoFields);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [categorySuggestion, setCategorySuggestion] = useState<CategorySuggestion | null>(null);
  const [brandSuggestion, setBrandSuggestion] = useState<BrandModelSuggestion | null>(null);
  const [modelSuggestion, setModelSuggestion] = useState<{ model: string; modelName: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const isCarListing = subcategory === 'cars';
  const isAtvListing = subcategory === 'atvs';
  const isKartingListing = subcategory === 'karting';
  const isQuadListing = subcategory === 'quads_buggies';
  const isMopedListing = subcategory === 'mopeds_scooters';
  const isMotoListing = subcategory === 'motorbikes';

  const handleCategoryChange = (newCategory: Category | '', newSubcategory?: string) => {
    setCategory(newCategory);
    setSubcategory(newSubcategory || '');
    clearFieldError('category');
    setBrandSuggestion(null);
    setModelSuggestion(null);
  };

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleTitleBlur = () => {
    if (title.trim().length < 3) {
      setCategorySuggestion(null);
      return;
    }
    const suggestion = analyzeTitleForCategory(title);
    if (suggestion && (suggestion.category !== category || suggestion.subcategory !== subcategory)) {
      setCategorySuggestion(suggestion);
    } else {
      setCategorySuggestion(null);
    }
  };

  const applyCategorySuggestion = () => {
    if (!categorySuggestion) return;
    const { category: sugCat, subcategory: sugSub } = categorySuggestion;
    handleCategoryChange(sugCat, sugSub);
    setCategorySuggestion(null);

    // Check for brand suggestion
    const brandResult = analyzeTitleForBrand(title, sugSub);
    if (brandResult) {
      setBrandSuggestion(brandResult);
    }
  };

  const applyBrandSuggestion = () => {
    if (!brandSuggestion) return;
    if (brandSuggestion.vehicleType === 'cars') {
      setCarFields(prev => ({ ...prev, brand: brandSuggestion.brand }));
    } else if (brandSuggestion.vehicleType === 'motorbikes') {
      setMotoFields(prev => ({ ...prev, brand: brandSuggestion.brand }));
    } else if (brandSuggestion.vehicleType === 'mopeds_scooters') {
      setMopedFields(prev => ({ ...prev, brand: brandSuggestion.brand }));
    } else if (brandSuggestion.vehicleType === 'quads_buggies') {
      setQuadFields(prev => ({ ...prev, brand: brandSuggestion.brand }));
    } else if (brandSuggestion.vehicleType === 'atvs') {
      setAtvFields(prev => ({ ...prev, brand: brandSuggestion.brand }));
    }
    // Show model suggestion separately if detected
    if (brandSuggestion.model && brandSuggestion.modelName) {
      setModelSuggestion({ model: brandSuggestion.model, modelName: brandSuggestion.modelName });
    }
    setBrandSuggestion(null);
  };

  const applyModelSuggestion = () => {
    if (!modelSuggestion) return;
    if (subcategory === 'cars') {
      setCarFields(prev => ({ ...prev, model: modelSuggestion.model }));
    }
    setModelSuggestion(null);
  };

  const scrollToFirstError = () => {
    setTimeout(() => {
      const el = formRef.current?.querySelector('.border-destructive');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              {t('login')} required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please log in to create a listing
            </p>
            <Link to="/login">
              <Button className="gradient-hero text-primary-foreground">
                {t('login')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && imageFiles.length < 5) {
      const newFiles = Array.from(files).slice(0, 5 - imageFiles.length);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateNumericFields = (): { valid: boolean; errors: Record<string, boolean>; message?: string } => {
    const errors: Record<string, boolean> = {};
    let message: string | undefined;

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0 || priceNum > 999999999) {
      errors.price = true;
      message = t('validation.priceRange');
    }

    if (isCarListing) {
      if (carFields.year) {
        const yearNum = parseInt(carFields.year);
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
          errors.year = true;
          if (!message) message = t('validation.invalidYear');
        }
      }
      if (carFields.mileage) {
        const mileageNum = parseInt(carFields.mileage);
        if (isNaN(mileageNum) || mileageNum < 0 || mileageNum > 9999999) {
          errors.mileage = true;
          if (!message) message = t('validation.mileageRange');
        }
      }
      if (carFields.engineVolume) {
        const engineVolumeNum = parseInt(carFields.engineVolume);
        if (isNaN(engineVolumeNum) || engineVolumeNum < 0 || engineVolumeNum > 30000) {
          errors.engineVolume = true;
          if (!message) message = t('validation.engineVolumeRange');
        }
      }
      if (carFields.fuelConsumption) {
        const fuelNum = parseFloat(carFields.fuelConsumption);
        if (isNaN(fuelNum) || fuelNum < 0 || fuelNum > 100) {
          errors.fuelConsumption = true;
          if (!message) message = t('validation.fuelConsumptionRange');
        }
      }
      if (carFields.power) {
        const powerNum = parseInt(carFields.power);
        if (isNaN(powerNum) || powerNum < 0 || powerNum > 10000) {
          errors.power = true;
          if (!message) message = t('validation.powerRange');
        }
      }
      if (carFields.seats) {
        const seatsNum = parseInt(carFields.seats);
        if (isNaN(seatsNum) || seatsNum < 1 || seatsNum > 50) {
          errors.seats = true;
          if (!message) message = t('validation.seatsRange');
        }
      }
      if (carFields.trunkVolume) {
        const trunkNum = parseInt(carFields.trunkVolume);
        if (isNaN(trunkNum) || trunkNum < 0 || trunkNum > 10000) {
          errors.trunkVolume = true;
          if (!message) message = t('validation.trunkVolumeRange');
        }
      }
    }

    return { valid: Object.keys(errors).length === 0, errors, message };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredErrors: Record<string, boolean> = {};
    if (!title) requiredErrors.title = true;
    if (!description) requiredErrors.description = true;
    if (!category) requiredErrors.category = true;
    if (!price) requiredErrors.price = true;
    if (!locationValue) requiredErrors.location = true;

    if (Object.keys(requiredErrors).length > 0) {
      setFieldErrors(requiredErrors);
      toast({
        title: t('error'),
        description: t('validation.requiredFields'),
        variant: 'destructive',
      });
      scrollToFirstError();
      return;
    }

    const validation = validateNumericFields();
    if (!validation.valid) {
      setFieldErrors(prev => ({ ...prev, ...validation.errors }));
      toast({
        title: t('error'),
        description: validation.message,
        variant: 'destructive',
      });
      scrollToFirstError();
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadImage.mutateAsync(file);
        uploadedUrls.push(url);
      }

      const listingData: Parameters<typeof createListing.mutateAsync>[0] = {
        title,
        description,
        category: category as Category,
        subcategory: subcategory || undefined,
        price: parseFloat(price),
        city: locationValue?.city || locationValue?.address.split(',')[0] || '',
        country: locationValue?.country || '',
        images: uploadedUrls,
        lat: locationValue?.lat,
        lng: locationValue?.lng,
      };

      if (isCarListing) {
        if (carFields.condition) listingData.car_condition = carFields.condition;
        if (carFields.brand) listingData.car_brand = carFields.brand;
        if (carFields.model) listingData.car_model = carFields.model;
        if (carFields.year) listingData.car_year = parseInt(carFields.year);
        if (carFields.mileage) listingData.car_mileage = parseInt(carFields.mileage);
        if (carFields.transmission) listingData.car_transmission = carFields.transmission;
        if (carFields.driveType) listingData.car_drive_type = carFields.driveType;
        if (carFields.engineType) listingData.car_engine_type = carFields.engineType;
        if (carFields.engineVolume) listingData.car_engine_volume = parseFloat(carFields.engineVolume);
        if (carFields.fuelConsumption) listingData.car_fuel_consumption = parseFloat(carFields.fuelConsumption);
        if (carFields.power) listingData.car_power = parseInt(carFields.power);
        if (carFields.bodyCondition) listingData.car_body_condition = carFields.bodyCondition;
        if (carFields.bodyType) listingData.car_body_type = carFields.bodyType;
        if (carFields.seats) listingData.car_seats = parseInt(carFields.seats);
        if (carFields.trunkVolume) listingData.car_trunk_volume = parseInt(carFields.trunkVolume);
        if (carFields.steeringPosition) listingData.car_steering_position = carFields.steeringPosition;
        if (carFields.powerWatt) (listingData as any).car_power_watt = parseInt(carFields.powerWatt);
      }

      await createListing.mutateAsync(listingData);

      toast({
        title: t('success'),
        description: t('listing.created'),
      });

      navigate('/');
    } catch (error: any) {
      let errorMessage = t('listing.createError');
      if (error.message?.includes('numeric field overflow')) {
        errorMessage = t('validation.numericOverflow');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
            {t('createListing')}
          </h1>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                {t('images')} ({imagePreviews.length}/5)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {imagePreviews.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                    <ImagePlus className="w-6 h-6 mb-1" />
                    <span className="text-xs">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('title')} *
              </label>
              <Input
                value={title}
                onChange={(e) => { setTitle(e.target.value); clearFieldError('title'); setCategorySuggestion(null); setModelSuggestion(null); }}
                onBlur={handleTitleBlur}
                placeholder="e.g., iPhone 15 Pro Max - Like New"
                maxLength={100}
                className={`h-12 ${fieldErrors.title ? 'border-destructive ring-destructive' : ''}`}
              />
              <p className="text-xs text-muted-foreground mt-1">{title.length}/100</p>
              {categorySuggestion && (
                <button
                  type="button"
                  onClick={applyCategorySuggestion}
                  className="text-sm text-primary hover:underline cursor-pointer mt-1 text-left"
                >
                  {t('suggestedCategory' as TranslationKey)}: {t(categorySuggestion.category as TranslationKey)}
                  {categorySuggestion.parentSubcategory && ` → ${t(categorySuggestion.parentSubcategory as TranslationKey)}`}
                  {` → ${t(categorySuggestion.subcategory as TranslationKey)}`}
                  {`. ${t('applySuggestion' as TranslationKey)}?`}
                </button>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('category')} *
              </label>
              <CategoryModal 
                value={category} 
                subcategoryValue={subcategory}
                onChange={handleCategoryChange}
                showPath={true}
              />
              {fieldErrors.category && (
                <p className="text-sm text-destructive mt-1">{t('validation.requiredFields' as TranslationKey)}</p>
              )}
            </div>

            {/* Brand suggestion */}
            {brandSuggestion && (
              <button
                type="button"
                onClick={applyBrandSuggestion}
                className="text-sm text-primary hover:underline cursor-pointer text-left"
              >
                {t('suggestedBrand' as TranslationKey)}: {brandSuggestion.brandName}
                {`. ${t('applySuggestion' as TranslationKey)}?`}
              </button>
            )}

            {/* Model suggestion */}
            {modelSuggestion && (
              <button
                type="button"
                onClick={applyModelSuggestion}
                className="text-sm text-primary hover:underline cursor-pointer text-left"
              >
                {t('suggestedModel' as TranslationKey) || 'Предполагаемая модель'}: {modelSuggestion.modelName}
                {`. ${t('applySuggestion' as TranslationKey)}?`}
              </button>
            )}

            {/* Car-specific fields */}
            {isCarListing && (
              <CarFieldsForm data={carFields} onChange={setCarFields} fieldErrors={fieldErrors} onClearError={clearFieldError} />
            )}

            {/* ATV-specific fields */}
            {isAtvListing && (
              <AtvFieldsForm data={atvFields} onChange={setAtvFields} fieldErrors={fieldErrors} onClearError={clearFieldError} />
            )}

            {/* Karting-specific fields */}
            {isKartingListing && (
              <KartingFieldsForm data={kartingFields} onChange={setKartingFields} fieldErrors={fieldErrors} onClearError={clearFieldError} />
            )}

            {/* Quad-specific fields */}
            {isQuadListing && (
              <QuadFieldsForm data={quadFields} onChange={setQuadFields} fieldErrors={fieldErrors} onClearError={clearFieldError} />
            )}

            {/* Moped-specific fields */}
            {isMopedListing && (
              <MopedFieldsForm data={mopedFields} onChange={setMopedFields} fieldErrors={fieldErrors} onClearError={clearFieldError} />
            )}

            {/* Motorcycle-specific fields */}
            {isMotoListing && (
              <MotoFieldsForm data={motoFields} onChange={setMotoFields} fieldErrors={fieldErrors} onClearError={clearFieldError} />
            )}

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('price')} (€) *
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => { setPrice(e.target.value); clearFieldError('price'); }}
                placeholder="0"
                min="0"
                step="0.01"
                className={`h-12 ${fieldErrors.price ? 'border-destructive ring-destructive' : ''}`}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('location')} *
              </label>
              <LocationPicker
                value={locationValue}
                onChange={(val) => {
                  setLocationValue(val);
                  clearFieldError('location');
                }}
                error={fieldErrors.location}
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('description')} *
              </label>
              <Textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); clearFieldError('description'); }}
                placeholder="Describe your item in detail..."
                rows={5}
                className={`resize-none ${fieldErrors.description ? 'border-destructive ring-destructive' : ''}`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
                disabled={isSubmitting}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-hero text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('loading')}
                  </>
                ) : (
                  t('publish')
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateListing;
