import { Category } from '@/types/listing';
import { carBrands } from '@/data/carData';

export interface CategorySuggestion {
  category: Category;
  subcategory: string;
  parentSubcategory?: string;
}

export interface BrandModelSuggestion {
  brand: string;
  brandName: string;
  model?: string;
  modelName?: string;
  vehicleType: string;
}

const motoBrands = [
  'yamaha', 'honda', 'kawasaki', 'suzuki', 'ducati', 'harley-davidson', 'harley',
  'ktm', 'aprilia', 'triumph', 'husqvarna', 'benelli', 'cfmoto', 'cf moto',
  'royal enfield', 'indian', 'bajaj', 'piaggio', 'vespa', 'sym', 'kymco',
  'beta', 'gasgas', 'mv agusta', 'moto guzzi', 'buell',
];

const categoryKeywords: { keywords: string[]; suggestion: CategorySuggestion }[] = [
  {
    keywords: ['car ', 'auto ', 'автомобиль', 'машин', 'авто ', 'sedan', 'седан', 'suv', 'внедорожник', 'хэтчбек', 'hatchback', 'универсал', 'wagon', 'купе', 'coupe', 'кабриолет', 'convertible', 'минивэн', 'minivan', 'лифтбек', 'liftback'],
    suggestion: { category: 'transport', subcategory: 'cars' },
  },
  {
    keywords: ['motorcycle', 'мотоцикл', 'байк ', 'sportbike', 'спортбайк', 'cruiser', 'круизер', 'эндуро', 'enduro', 'naked', 'нейкед', 'chopper', 'чоппер', 'supermoto', 'motard', 'мотард'],
    suggestion: { category: 'transport', subcategory: 'motorbikes', parentSubcategory: 'motorcycles' },
  },
  {
    keywords: ['scooter', 'скутер', 'мопед', 'moped', 'макси-скутер', 'maxi-scooter', 'mini bike', 'мини-байк'],
    suggestion: { category: 'transport', subcategory: 'mopeds_scooters', parentSubcategory: 'motorcycles' },
  },
  {
    keywords: ['quad', 'квадроцикл', 'buggy', 'багги'],
    suggestion: { category: 'transport', subcategory: 'quads_buggies', parentSubcategory: 'motorcycles' },
  },
  {
    keywords: ['atv', 'вездеход', 'all-terrain', 'снегоболотоход'],
    suggestion: { category: 'transport', subcategory: 'atvs', parentSubcategory: 'motorcycles' },
  },
  {
    keywords: ['kart', 'картинг', 'go-kart', 'go kart'],
    suggestion: { category: 'transport', subcategory: 'karting', parentSubcategory: 'motorcycles' },
  },
  {
    keywords: ['truck ', 'грузовик', 'тягач', 'фура', 'экскаватор', 'excavator', 'бульдозер', 'bulldozer', 'погрузчик', 'loader', 'автобус', 'bus ', 'прицеп', 'trailer'],
    suggestion: { category: 'transport', subcategory: 'trucks' },
  },
];

export function analyzeTitleForCategory(title: string): CategorySuggestion | null {
  const lower = title.toLowerCase();
  const padded = ` ${lower} `;

  // Check moto brands first
  for (const brand of motoBrands) {
    if (lower.includes(brand)) {
      const hasCarKeyword = ['car ', 'auto ', 'авто ', 'машин', 'автомобиль'].some(k => padded.includes(k));
      if (!hasCarKeyword) {
        const hasMopedKeyword = ['scooter', 'скутер', 'мопед', 'moped'].some(k => lower.includes(k));
        if (hasMopedKeyword) {
          return { category: 'transport', subcategory: 'mopeds_scooters', parentSubcategory: 'motorcycles' };
        }
        return { category: 'transport', subcategory: 'motorbikes', parentSubcategory: 'motorcycles' };
      }
    }
  }

  // Check car brands
  for (const brand of carBrands) {
    const brandName = brand.name.toLowerCase();
    const brandId = brand.id.toLowerCase();
    if (lower.includes(brandName) || padded.includes(` ${brandId} `)) {
      const hasMotoKeyword = ['motorcycle', 'мотоцикл', 'байк', 'мото ', 'bike'].some(k => lower.includes(k));
      if (!hasMotoKeyword) {
        return { category: 'transport', subcategory: 'cars' };
      }
    }
  }

  // Keyword-based detection
  for (const entry of categoryKeywords) {
    for (const keyword of entry.keywords) {
      if (padded.includes(keyword)) {
        return entry.suggestion;
      }
    }
  }

  // Generic "moto" keyword
  if (padded.includes('moto') || padded.includes('мото')) {
    return { category: 'transport', subcategory: 'motorbikes', parentSubcategory: 'motorcycles' };
  }

  return null;
}

export function analyzeTitleForBrand(title: string, vehicleType: string): BrandModelSuggestion | null {
  const lower = title.toLowerCase();

  if (vehicleType === 'cars') {
    for (const brand of carBrands) {
      if (lower.includes(brand.name.toLowerCase()) || lower.includes(brand.id)) {
        for (const model of brand.models) {
          if (lower.includes(model.name.toLowerCase())) {
            return { brand: brand.id, brandName: brand.name, model: model.id, modelName: model.name, vehicleType: 'cars' };
          }
        }
        return { brand: brand.id, brandName: brand.name, vehicleType: 'cars' };
      }
    }
  }

  if (['motorbikes', 'mopeds_scooters', 'quads_buggies', 'atvs'].includes(vehicleType)) {
    for (const brand of motoBrands) {
      if (lower.includes(brand)) {
        const brandName = brand.split(/[\s-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(brand.includes('-') ? '-' : ' ');
        return { brand: brandName, brandName, vehicleType };
      }
    }
  }

  return null;
}
