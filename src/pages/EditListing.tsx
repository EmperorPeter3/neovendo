import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { TranslationKey } from '@/i18n/translations';
import { useToast } from '@/hooks/use-toast';
import { useListing, useUpdateListing, useUploadListingImage } from '@/hooks/useListings';
import { Category } from '@/types/listing';
import { CarFieldsForm, CarFieldsData, defaultCarFields } from '@/components/CarFieldsForm';
import { AtvFieldsForm, AtvFieldsData, defaultAtvFields } from '@/components/AtvFieldsForm';
import KartingFieldsForm, { KartingFieldsData, defaultKartingFields } from '@/components/KartingFieldsForm';
import QuadFieldsForm, { QuadFieldsData, defaultQuadFields } from '@/components/QuadFieldsForm';
import MopedFieldsForm, { MopedFieldsData, defaultMopedFields } from '@/components/MopedFieldsForm';
import MotoFieldsForm, { MotoFieldsData, defaultMotoFields } from '@/components/MotoFieldsForm';
import { CategoryModal } from '@/components/CategoryModal';
import { LocationPicker, LocationPickerValue } from '@/components/LocationPicker';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageDropZone } from '@/components/ImageDropZone';

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  const { data: listing, isLoading: listingLoading } = useListing(id || '');
  const updateListing = useUpdateListing();
  const uploadImage = useUploadListingImage();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState('');
  const [locationValue, setLocationValue] = useState<LocationPickerValue | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carFields, setCarFields] = useState<CarFieldsData>(defaultCarFields);
  const [atvFields, setAtvFields] = useState<AtvFieldsData>(defaultAtvFields);
  const [kartingFields, setKartingFields] = useState<KartingFieldsData>(defaultKartingFields);
  const [quadFields, setQuadFields] = useState<QuadFieldsData>(defaultQuadFields);
  const [mopedFields, setMopedFields] = useState<MopedFieldsData>(defaultMopedFields);
  const [motoFields, setMotoFields] = useState<MotoFieldsData>(defaultMotoFields);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [initialized, setInitialized] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isCarListing = subcategory === 'cars';
  const isAtvListing = subcategory === 'atvs';
  const isKartingListing = subcategory === 'karting';
  const isQuadListing = subcategory === 'quads_buggies';
  const isMopedListing = subcategory === 'mopeds_scooters';
  const isMotoListing = subcategory === 'motorbikes';

  // Pre-fill form when listing data loads
  useEffect(() => {
    if (listing && !initialized) {
      setTitle(listing.title || '');
      setDescription(listing.description || '');
      setCategory((listing.category as Category) || '');
      setSubcategory(listing.subcategory || '');
      setPrice(listing.price?.toString() || '');
      setExistingImages(listing.images || []);

      if (listing.city || listing.country || listing.lat || listing.lng) {
        setLocationValue({
          lat: listing.lat || 0,
          lng: listing.lng || 0,
          address: `${listing.city}, ${listing.country}`,
          city: listing.city,
          country: listing.country,
        });
      }

      // Car fields
      if (listing.subcategory === 'cars') {
        setCarFields({
          condition: (listing.car_condition as CarFieldsData['condition']) || '',
          brand: listing.car_brand || '',
          model: listing.car_model || '',
          year: listing.car_year?.toString() || '',
          mileage: listing.car_mileage?.toString() || '',
          transmission: listing.car_transmission || '',
          driveType: listing.car_drive_type || '',
          engineType: listing.car_engine_type || '',
          engineVolume: listing.car_engine_volume?.toString() || '',
          fuelConsumption: listing.car_fuel_consumption?.toString() || '',
          power: listing.car_power?.toString() || '',
          powerWatt: (listing as any).car_power_watt?.toString() || '',
          bodyCondition: listing.car_body_condition || '',
          bodyType: listing.car_body_type || '',
          seats: listing.car_seats?.toString() || '',
          trunkVolume: listing.car_trunk_volume?.toString() || '',
          steeringPosition: listing.car_steering_position || '',
        });
      }

      // ATV fields
      if (listing.subcategory === 'atvs') {
        setAtvFields({
          type: (listing as any).atv_type || '',
          brand: (listing as any).atv_brand || '',
          originCountry: (listing as any).atv_origin_country || '',
          year: (listing as any).atv_year?.toString() || '',
          condition: (listing as any).atv_condition || '',
          engineType: (listing as any).atv_engine_type || '',
          engineVolume: (listing as any).atv_engine_volume?.toString() || '',
          power: (listing as any).atv_power?.toString() || '',
          powerWatt: (listing as any).atv_power_watt?.toString() || '',
          mileage: (listing as any).atv_mileage?.toString() || '',
          maxPassengers: (listing as any).atv_max_passengers?.toString() || '',
        });
      }

      // Karting fields
      if (listing.subcategory === 'karting') {
        setKartingFields({
          condition: (listing as any).kart_condition || '',
        });
      }

      // Quad fields
      if (listing.subcategory === 'quads_buggies') {
        setQuadFields({
          type: (listing as any).quad_type || '',
          brand: (listing as any).quad_brand || '',
          originCountry: (listing as any).quad_origin_country || '',
          year: (listing as any).quad_year?.toString() || '',
          condition: (listing as any).quad_condition || '',
          engineType: (listing as any).quad_engine_type || '',
          engineVolume: (listing as any).quad_engine_volume?.toString() || '',
          power: (listing as any).quad_power?.toString() || '',
          powerWatt: (listing as any).quad_power_watt?.toString() || '',
          mileage: (listing as any).quad_mileage?.toString() || '',
          maxPassengers: (listing as any).quad_max_passengers?.toString() || '',
        });
      }

      // Moped fields
      if (listing.subcategory === 'mopeds_scooters') {
        setMopedFields({
          type: (listing as any).moped_type || '',
          brand: (listing as any).moped_brand || '',
          originCountry: (listing as any).moped_origin_country || '',
          year: (listing as any).moped_year?.toString() || '',
          condition: (listing as any).moped_condition || '',
          engineType: (listing as any).moped_engine_type || '',
          engineVolume: (listing as any).moped_engine_volume?.toString() || '',
          power: (listing as any).moped_power?.toString() || '',
          powerWatt: (listing as any).moped_power_watt?.toString() || '',
          mileage: (listing as any).moped_mileage?.toString() || '',
        });
      }

      // Moto fields
      if (listing.subcategory === 'motorbikes') {
        setMotoFields({
          type: (listing as any).moto_type || '',
          brand: (listing as any).moto_brand || '',
          originCountry: (listing as any).moto_origin_country || '',
          year: (listing as any).moto_year?.toString() || '',
          condition: (listing as any).moto_condition || '',
          engineType: (listing as any).moto_engine_type || '',
          engineVolume: (listing as any).moto_engine_volume?.toString() || '',
          powerHp: (listing as any).moto_power_hp?.toString() || '',
          powerWatt: (listing as any).moto_power_watt?.toString() || '',
          fuelDelivery: (listing as any).moto_fuel_delivery || '',
          strokes: (listing as any).moto_strokes?.toString() || '',
          transmission: (listing as any).moto_transmission || '',
          mileage: (listing as any).moto_mileage?.toString() || '',
        });
      }

      setInitialized(true);
    }
  }, [listing, initialized]);

  const handleCategoryChange = (newCategory: Category | '', newSubcategory?: string) => {
    setCategory(newCategory);
    setSubcategory(newSubcategory || '');
    clearFieldError('category');
  };

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const scrollToFirstError = () => {
    setTimeout(() => {
      const el = formRef.current?.querySelector('.border-destructive');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              {t('login')} required
            </h1>
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

  if (listingLoading) {
    return (
      <Layout>
        <div className="container py-6 md:py-8">
          <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            {t('listing.notFound' as TranslationKey) || 'Listing not found'}
          </h1>
          <Link to="/my-listings">
            <Button variant="outline">{t('back')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Check ownership
  if (user && listing.owner_id !== user.id) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Access denied
          </h1>
          <Link to="/my-listings">
            <Button variant="outline">{t('back')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const totalImages = existingImages.length + newImagePreviews.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && totalImages < 5) {
      const newFiles = Array.from(files).slice(0, 5 - totalImages);
      const previews = newFiles.map(file => URL.createObjectURL(file));
      setNewImageFiles(prev => [...prev, ...newFiles]);
      setNewImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
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
      // Upload new images
      const uploadedUrls: string[] = [];
      for (const file of newImageFiles) {
        const url = await uploadImage.mutateAsync(file);
        uploadedUrls.push(url);
      }

      const allImages = [...existingImages, ...uploadedUrls];

      const updateData: { id: string; [key: string]: any } = {
        id: listing.id,
        title,
        description,
        category: category as Category,
        subcategory: subcategory || null,
        price: parseFloat(price),
        city: locationValue?.city || locationValue?.address.split(',')[0] || '',
        country: locationValue?.country || '',
        images: allImages,
        lat: locationValue?.lat,
        lng: locationValue?.lng,
      };

      // Car fields
      if (isCarListing) {
        updateData.car_condition = carFields.condition || null;
        updateData.car_brand = carFields.brand || null;
        updateData.car_model = carFields.model || null;
        updateData.car_year = carFields.year ? parseInt(carFields.year) : null;
        updateData.car_mileage = carFields.mileage ? parseInt(carFields.mileage) : null;
        updateData.car_transmission = carFields.transmission || null;
        updateData.car_drive_type = carFields.driveType || null;
        updateData.car_engine_type = carFields.engineType || null;
        updateData.car_engine_volume = carFields.engineVolume ? parseFloat(carFields.engineVolume) : null;
        updateData.car_fuel_consumption = carFields.fuelConsumption ? parseFloat(carFields.fuelConsumption) : null;
        updateData.car_power = carFields.power ? parseInt(carFields.power) : null;
        updateData.car_power_watt = carFields.powerWatt ? parseInt(carFields.powerWatt) : null;
        updateData.car_body_condition = carFields.bodyCondition || null;
        updateData.car_body_type = carFields.bodyType || null;
        updateData.car_seats = carFields.seats ? parseInt(carFields.seats) : null;
        updateData.car_trunk_volume = carFields.trunkVolume ? parseInt(carFields.trunkVolume) : null;
        updateData.car_steering_position = carFields.steeringPosition || null;
      }

      // ATV fields
      if (isAtvListing) {
        updateData.atv_type = atvFields.type || null;
        updateData.atv_brand = atvFields.brand || null;
        updateData.atv_origin_country = atvFields.originCountry || null;
        updateData.atv_year = atvFields.year ? parseInt(atvFields.year) : null;
        updateData.atv_condition = atvFields.condition || null;
        updateData.atv_engine_type = atvFields.engineType || null;
        updateData.atv_engine_volume = atvFields.engineVolume ? parseFloat(atvFields.engineVolume) : null;
        updateData.atv_power = atvFields.power ? parseInt(atvFields.power) : null;
        updateData.atv_power_watt = atvFields.powerWatt ? parseInt(atvFields.powerWatt) : null;
        updateData.atv_mileage = atvFields.mileage ? parseInt(atvFields.mileage) : null;
        updateData.atv_max_passengers = atvFields.maxPassengers ? parseInt(atvFields.maxPassengers) : null;
      }

      // Karting fields
      if (isKartingListing) {
        updateData.kart_condition = kartingFields.condition || null;
      }

      // Quad fields
      if (isQuadListing) {
        updateData.quad_type = quadFields.type || null;
        updateData.quad_brand = quadFields.brand || null;
        updateData.quad_origin_country = quadFields.originCountry || null;
        updateData.quad_year = quadFields.year ? parseInt(quadFields.year) : null;
        updateData.quad_condition = quadFields.condition || null;
        updateData.quad_engine_type = quadFields.engineType || null;
        updateData.quad_engine_volume = quadFields.engineVolume ? parseFloat(quadFields.engineVolume) : null;
        updateData.quad_power = quadFields.power ? parseInt(quadFields.power) : null;
        updateData.quad_power_watt = quadFields.powerWatt ? parseInt(quadFields.powerWatt) : null;
        updateData.quad_mileage = quadFields.mileage ? parseInt(quadFields.mileage) : null;
        updateData.quad_max_passengers = quadFields.maxPassengers ? parseInt(quadFields.maxPassengers) : null;
      }

      // Moped fields
      if (isMopedListing) {
        updateData.moped_type = mopedFields.type || null;
        updateData.moped_brand = mopedFields.brand || null;
        updateData.moped_origin_country = mopedFields.originCountry || null;
        updateData.moped_year = mopedFields.year ? parseInt(mopedFields.year) : null;
        updateData.moped_condition = mopedFields.condition || null;
        updateData.moped_engine_type = mopedFields.engineType || null;
        updateData.moped_engine_volume = mopedFields.engineVolume ? parseFloat(mopedFields.engineVolume) : null;
        updateData.moped_power = mopedFields.power ? parseInt(mopedFields.power) : null;
        updateData.moped_power_watt = mopedFields.powerWatt ? parseInt(mopedFields.powerWatt) : null;
        updateData.moped_mileage = mopedFields.mileage ? parseInt(mopedFields.mileage) : null;
      }

      // Moto fields
      if (isMotoListing) {
        updateData.moto_type = motoFields.type || null;
        updateData.moto_brand = motoFields.brand || null;
        updateData.moto_origin_country = motoFields.originCountry || null;
        updateData.moto_year = motoFields.year ? parseInt(motoFields.year) : null;
        updateData.moto_condition = motoFields.condition || null;
        updateData.moto_engine_type = motoFields.engineType || null;
        updateData.moto_engine_volume = motoFields.engineVolume ? parseFloat(motoFields.engineVolume) : null;
        updateData.moto_power_hp = motoFields.powerHp ? parseInt(motoFields.powerHp) : null;
        updateData.moto_power_watt = motoFields.powerWatt ? parseInt(motoFields.powerWatt) : null;
        updateData.moto_fuel_delivery = motoFields.fuelDelivery || null;
        updateData.moto_strokes = motoFields.strokes ? parseInt(motoFields.strokes) : null;
        updateData.moto_transmission = motoFields.transmission || null;
        updateData.moto_mileage = motoFields.mileage ? parseInt(motoFields.mileage) : null;
      }

      await updateListing.mutateAsync(updateData);

      toast({
        title: t('success'),
        description: t('listing.updated' as TranslationKey) || 'Listing updated successfully',
      });

      navigate('/my-listings');
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
        <Link to="/my-listings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </Link>

        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
            {t('editListing' as TranslationKey) || 'Edit Listing'}
          </h1>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <ImageDropZone
              existingImages={existingImages}
              newImagePreviews={newImagePreviews}
              onFilesAdded={(files) => {
                const allowed = files.slice(0, 5 - totalImages);
                const previews = allowed.map(f => URL.createObjectURL(f));
                setNewImageFiles(prev => [...prev, ...allowed]);
                setNewImagePreviews(prev => [...prev, ...previews]);
              }}
              onRemoveExisting={removeExistingImage}
              onRemoveNew={removeNewImage}
            />

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('title')} *
              </label>
              <Input
                value={title}
                onChange={(e) => { setTitle(e.target.value); clearFieldError('title'); }}
                placeholder="e.g., iPhone 15 Pro Max - Like New"
                maxLength={100}
                className={`h-12 ${fieldErrors.title ? 'border-destructive ring-destructive' : ''}`}
              />
              <p className="text-xs text-muted-foreground mt-1">{title.length}/100</p>
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
                  t('save' as TranslationKey) || 'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditListing;
