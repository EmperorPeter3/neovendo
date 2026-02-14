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
    keywords: ['снегоход', 'snowmobile'],
    suggestion: { category: 'transport', subcategory: 'snowmobiles', parentSubcategory: 'motorcycles' },
  },
  {
    keywords: ['kart', 'картинг', 'go-kart', 'go kart'],
    suggestion: { category: 'transport', subcategory: 'karting', parentSubcategory: 'motorcycles' },
  },
  {
    keywords: ['truck ', 'грузовик', 'тягач', 'фура', 'экскаватор', 'excavator', 'бульдозер', 'bulldozer', 'погрузчик', 'loader', 'автобус', 'bus ', 'прицеп', 'trailer'],
    suggestion: { category: 'transport', subcategory: 'trucks' },
  },
  // Real estate - apartments
  {
    keywords: ['квартир', 'apartment', 'апартамент', 'студия жильё', 'студию'],
    suggestion: { category: 'realEstate', subcategory: 'buy_all_apartments', parentSubcategory: 'buy' },
  },
  {
    keywords: ['комнат', 'room '],
    suggestion: { category: 'realEstate', subcategory: 'buy_rooms', parentSubcategory: 'buy' },
  },
  {
    keywords: ['помещени', 'коммерческ'],
    suggestion: { category: 'realEstate', subcategory: 'commercial' },
  },
];

export function analyzeTitleForCategory(title: string): CategorySuggestion | null {
  const lower = title.toLowerCase();
  const padded = ` ${lower} `;

  // Keyword-based detection FIRST (highest priority)
  for (const entry of categoryKeywords) {
    for (const keyword of entry.keywords) {
      if (padded.includes(keyword)) {
        return entry.suggestion;
      }
    }
  }

  // Check moto brands
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
  const sortedCarBrands = [...carBrands].sort((a, b) => b.name.length - a.name.length);
  for (const brand of sortedCarBrands) {
    const brandName = brand.name.toLowerCase();
    const brandMatches = lower.includes(brandName) || matchesWholeWord(padded, brand.id);
    if (brandMatches) {
      const hasMotoKeyword = ['motorcycle', 'мотоцикл', 'байк', 'мото ', 'bike'].some(k => lower.includes(k));
      if (!hasMotoKeyword) {
        return { category: 'transport', subcategory: 'cars' };
      }
    }
  }

  // Generic "moto" keyword
  if (padded.includes('moto') || padded.includes('мото')) {
    return { category: 'transport', subcategory: 'motorbikes', parentSubcategory: 'motorcycles' };
  }

  return null;
}

// Helper: check if a word/phrase appears as a whole word in text
function matchesWholeWord(text: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|[\\s,.()"'])${escaped}(?:$|[\\s,.()"'])`, 'i');
  return regex.test(text);
}

export function analyzeTitleForBrand(title: string, vehicleType: string): BrandModelSuggestion | null {
  const lower = title.toLowerCase();

  if (vehicleType === 'cars') {
    // Sort brands longest name first to match "Mercedes-Benz" before "MG"
    const sortedBrands = [...carBrands].sort((a, b) => b.name.length - a.name.length);
    
    for (const brand of sortedBrands) {
      const brandName = brand.name.toLowerCase();
      const brandMatches = lower.includes(brandName) || matchesWholeWord(lower, brand.id);
      
      if (brandMatches) {
        // Try to match model - check both full name and class prefix (e.g. "C" for "C-Class")
        for (const model of brand.models) {
          const modelName = model.name.toLowerCase();
          if (lower.includes(modelName)) {
            return { brand: brand.id, brandName: brand.name, model: model.id, modelName: model.name, vehicleType: 'cars' };
          }
          // Match class-style models: "C-Class" matches "C " or "C200" etc.
          const classMatch = modelName.match(/^([a-z]+)-class$/);
          if (classMatch) {
            const prefix = classMatch[1];
            // Check for patterns like "C 200", "C200", "C-200"
            const classRegex = new RegExp(`(?:^|\\s)${prefix}(?:\\s|\\d|-|$)`, 'i');
            if (classRegex.test(title)) {
              return { brand: brand.id, brandName: brand.name, model: model.id, modelName: model.name, vehicleType: 'cars' };
            }
          }
        }
        return { brand: brand.id, brandName: brand.name, vehicleType: 'cars' };
      }
    }
  }

  if (['motorbikes', 'mopeds_scooters', 'quads_buggies', 'atvs'].includes(vehicleType)) {
    // Sort longest first
    const sortedMotoBrands = [...motoBrands].sort((a, b) => b.length - a.length);
    for (const brand of sortedMotoBrands) {
      if (matchesWholeWord(lower, brand)) {
        const brandName = brand.split(/[\s-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(brand.includes('-') ? '-' : ' ');
        return { brand: brandName, brandName, vehicleType };
      }
    }
  }

  return null;
}
