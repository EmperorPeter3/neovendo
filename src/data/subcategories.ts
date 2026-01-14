import { Category } from '@/types/listing';

export interface Subcategory {
  id: string;
  translationKey: string;
}

export interface SubcategoryGroup {
  id: string;
  translationKey: string;
  items: Subcategory[];
}

export const subcategoriesData: Record<Category, SubcategoryGroup[]> = {
  transport: [
    {
      id: 'cars',
      translationKey: 'subcategory_cars',
      items: [
        { id: 'sedan', translationKey: 'subcategory_sedan' },
        { id: 'suv', translationKey: 'subcategory_suv' },
        { id: 'hatchback', translationKey: 'subcategory_hatchback' },
        { id: 'coupe', translationKey: 'subcategory_coupe' },
        { id: 'minivan', translationKey: 'subcategory_minivan' },
      ],
    },
    {
      id: 'motorcycles',
      translationKey: 'subcategory_motorcycles',
      items: [
        { id: 'sport', translationKey: 'subcategory_sport' },
        { id: 'cruiser', translationKey: 'subcategory_cruiser' },
        { id: 'scooter', translationKey: 'subcategory_scooter' },
        { id: 'atv', translationKey: 'subcategory_atv' },
      ],
    },
    {
      id: 'trucks',
      translationKey: 'subcategory_trucks',
      items: [
        { id: 'pickup', translationKey: 'subcategory_pickup' },
        { id: 'cargo', translationKey: 'subcategory_cargo' },
        { id: 'trailer', translationKey: 'subcategory_trailer' },
      ],
    },
    {
      id: 'watercraft',
      translationKey: 'subcategory_watercraft',
      items: [
        { id: 'boats', translationKey: 'subcategory_boats' },
        { id: 'jetski', translationKey: 'subcategory_jetski' },
        { id: 'yachts', translationKey: 'subcategory_yachts' },
      ],
    },
  ],
  realEstate: [
    {
      id: 'apartments',
      translationKey: 'subcategory_apartments',
      items: [
        { id: 'studio', translationKey: 'subcategory_studio' },
        { id: '1bedroom', translationKey: 'subcategory_1bedroom' },
        { id: '2bedroom', translationKey: 'subcategory_2bedroom' },
        { id: '3bedroom', translationKey: 'subcategory_3bedroom' },
      ],
    },
    {
      id: 'houses',
      translationKey: 'subcategory_houses',
      items: [
        { id: 'cottage', translationKey: 'subcategory_cottage' },
        { id: 'villa', translationKey: 'subcategory_villa' },
        { id: 'townhouse', translationKey: 'subcategory_townhouse' },
      ],
    },
    {
      id: 'commercial',
      translationKey: 'subcategory_commercial',
      items: [
        { id: 'office', translationKey: 'subcategory_office' },
        { id: 'retail', translationKey: 'subcategory_retail' },
        { id: 'warehouse', translationKey: 'subcategory_warehouse' },
      ],
    },
    {
      id: 'land',
      translationKey: 'subcategory_land',
      items: [
        { id: 'residential_land', translationKey: 'subcategory_residential_land' },
        { id: 'agricultural', translationKey: 'subcategory_agricultural' },
      ],
    },
  ],
  jobs: [
    {
      id: 'fulltime',
      translationKey: 'subcategory_fulltime',
      items: [
        { id: 'it', translationKey: 'subcategory_it' },
        { id: 'sales', translationKey: 'subcategory_sales' },
        { id: 'marketing', translationKey: 'subcategory_marketing' },
        { id: 'finance', translationKey: 'subcategory_finance' },
      ],
    },
    {
      id: 'parttime',
      translationKey: 'subcategory_parttime',
      items: [
        { id: 'retail_job', translationKey: 'subcategory_retail_job' },
        { id: 'hospitality', translationKey: 'subcategory_hospitality' },
        { id: 'delivery', translationKey: 'subcategory_delivery' },
      ],
    },
    {
      id: 'freelance',
      translationKey: 'subcategory_freelance',
      items: [
        { id: 'design', translationKey: 'subcategory_design' },
        { id: 'writing', translationKey: 'subcategory_writing' },
        { id: 'development', translationKey: 'subcategory_development' },
      ],
    },
  ],
  services: [
    {
      id: 'home_services',
      translationKey: 'subcategory_home_services',
      items: [
        { id: 'cleaning', translationKey: 'subcategory_cleaning' },
        { id: 'repair', translationKey: 'subcategory_repair' },
        { id: 'plumbing', translationKey: 'subcategory_plumbing' },
        { id: 'electrical', translationKey: 'subcategory_electrical' },
      ],
    },
    {
      id: 'beauty',
      translationKey: 'subcategory_beauty',
      items: [
        { id: 'hairdressing', translationKey: 'subcategory_hairdressing' },
        { id: 'makeup', translationKey: 'subcategory_makeup' },
        { id: 'nails', translationKey: 'subcategory_nails' },
      ],
    },
    {
      id: 'education',
      translationKey: 'subcategory_education',
      items: [
        { id: 'tutoring', translationKey: 'subcategory_tutoring' },
        { id: 'languages', translationKey: 'subcategory_languages' },
        { id: 'music_lessons', translationKey: 'subcategory_music_lessons' },
      ],
    },
  ],
  personalItems: [
    {
      id: 'clothing',
      translationKey: 'subcategory_clothing',
      items: [
        { id: 'mens', translationKey: 'subcategory_mens' },
        { id: 'womens', translationKey: 'subcategory_womens' },
        { id: 'kids', translationKey: 'subcategory_kids' },
      ],
    },
    {
      id: 'accessories',
      translationKey: 'subcategory_accessories',
      items: [
        { id: 'watches', translationKey: 'subcategory_watches' },
        { id: 'jewelry', translationKey: 'subcategory_jewelry' },
        { id: 'bags', translationKey: 'subcategory_bags' },
      ],
    },
    {
      id: 'health',
      translationKey: 'subcategory_health',
      items: [
        { id: 'cosmetics', translationKey: 'subcategory_cosmetics' },
        { id: 'fitness', translationKey: 'subcategory_fitness' },
      ],
    },
  ],
  homeAndGarden: [
    {
      id: 'furniture',
      translationKey: 'subcategory_furniture',
      items: [
        { id: 'living_room', translationKey: 'subcategory_living_room' },
        { id: 'bedroom', translationKey: 'subcategory_bedroom' },
        { id: 'kitchen_furniture', translationKey: 'subcategory_kitchen_furniture' },
      ],
    },
    {
      id: 'garden',
      translationKey: 'subcategory_garden',
      items: [
        { id: 'plants', translationKey: 'subcategory_plants' },
        { id: 'tools', translationKey: 'subcategory_tools' },
        { id: 'outdoor_furniture', translationKey: 'subcategory_outdoor_furniture' },
      ],
    },
    {
      id: 'appliances',
      translationKey: 'subcategory_appliances',
      items: [
        { id: 'kitchen_appliances', translationKey: 'subcategory_kitchen_appliances' },
        { id: 'laundry', translationKey: 'subcategory_laundry' },
      ],
    },
  ],
  autoParts: [
    {
      id: 'parts',
      translationKey: 'subcategory_parts',
      items: [
        { id: 'engine', translationKey: 'subcategory_engine' },
        { id: 'transmission', translationKey: 'subcategory_transmission' },
        { id: 'brakes', translationKey: 'subcategory_brakes' },
        { id: 'suspension', translationKey: 'subcategory_suspension' },
      ],
    },
    {
      id: 'tires_wheels',
      translationKey: 'subcategory_tires_wheels',
      items: [
        { id: 'tires', translationKey: 'subcategory_tires' },
        { id: 'rims', translationKey: 'subcategory_rims' },
      ],
    },
    {
      id: 'car_accessories',
      translationKey: 'subcategory_car_accessories',
      items: [
        { id: 'audio', translationKey: 'subcategory_audio' },
        { id: 'interior', translationKey: 'subcategory_interior' },
        { id: 'exterior', translationKey: 'subcategory_exterior' },
      ],
    },
  ],
  electronics: [
    {
      id: 'phones',
      translationKey: 'subcategory_phones',
      items: [
        { id: 'smartphones', translationKey: 'subcategory_smartphones' },
        { id: 'tablets', translationKey: 'subcategory_tablets' },
        { id: 'phone_accessories', translationKey: 'subcategory_phone_accessories' },
      ],
    },
    {
      id: 'computers',
      translationKey: 'subcategory_computers',
      items: [
        { id: 'laptops', translationKey: 'subcategory_laptops' },
        { id: 'desktops', translationKey: 'subcategory_desktops' },
        { id: 'components', translationKey: 'subcategory_components' },
      ],
    },
    {
      id: 'gaming',
      translationKey: 'subcategory_gaming',
      items: [
        { id: 'consoles', translationKey: 'subcategory_consoles' },
        { id: 'games', translationKey: 'subcategory_games' },
        { id: 'gaming_accessories', translationKey: 'subcategory_gaming_accessories' },
      ],
    },
    {
      id: 'tv_audio',
      translationKey: 'subcategory_tv_audio',
      items: [
        { id: 'tvs', translationKey: 'subcategory_tvs' },
        { id: 'speakers', translationKey: 'subcategory_speakers' },
        { id: 'headphones', translationKey: 'subcategory_headphones' },
      ],
    },
  ],
  hobbies: [
    {
      id: 'sports',
      translationKey: 'subcategory_sports',
      items: [
        { id: 'gym', translationKey: 'subcategory_gym' },
        { id: 'cycling', translationKey: 'subcategory_cycling' },
        { id: 'water_sports', translationKey: 'subcategory_water_sports' },
      ],
    },
    {
      id: 'music',
      translationKey: 'subcategory_music',
      items: [
        { id: 'instruments', translationKey: 'subcategory_instruments' },
        { id: 'dj_equipment', translationKey: 'subcategory_dj_equipment' },
      ],
    },
    {
      id: 'collectibles',
      translationKey: 'subcategory_collectibles',
      items: [
        { id: 'coins', translationKey: 'subcategory_coins' },
        { id: 'stamps', translationKey: 'subcategory_stamps' },
        { id: 'antiques', translationKey: 'subcategory_antiques' },
      ],
    },
    {
      id: 'books',
      translationKey: 'subcategory_books',
      items: [
        { id: 'fiction', translationKey: 'subcategory_fiction' },
        { id: 'nonfiction', translationKey: 'subcategory_nonfiction' },
        { id: 'textbooks', translationKey: 'subcategory_textbooks' },
      ],
    },
  ],
  animals: [
    {
      id: 'dogs',
      translationKey: 'subcategory_dogs',
      items: [
        { id: 'puppies', translationKey: 'subcategory_puppies' },
        { id: 'adult_dogs', translationKey: 'subcategory_adult_dogs' },
      ],
    },
    {
      id: 'cats',
      translationKey: 'subcategory_cats',
      items: [
        { id: 'kittens', translationKey: 'subcategory_kittens' },
        { id: 'adult_cats', translationKey: 'subcategory_adult_cats' },
      ],
    },
    {
      id: 'other_pets',
      translationKey: 'subcategory_other_pets',
      items: [
        { id: 'birds', translationKey: 'subcategory_birds' },
        { id: 'fish', translationKey: 'subcategory_fish' },
        { id: 'rodents', translationKey: 'subcategory_rodents' },
      ],
    },
    {
      id: 'pet_supplies',
      translationKey: 'subcategory_pet_supplies',
      items: [
        { id: 'food', translationKey: 'subcategory_food' },
        { id: 'toys', translationKey: 'subcategory_toys' },
        { id: 'cages', translationKey: 'subcategory_cages' },
      ],
    },
  ],
  business: [
    {
      id: 'office_equipment',
      translationKey: 'subcategory_office_equipment',
      items: [
        { id: 'printers', translationKey: 'subcategory_printers' },
        { id: 'office_furniture', translationKey: 'subcategory_office_furniture' },
        { id: 'pos_systems', translationKey: 'subcategory_pos_systems' },
      ],
    },
    {
      id: 'industrial',
      translationKey: 'subcategory_industrial',
      items: [
        { id: 'machinery', translationKey: 'subcategory_machinery' },
        { id: 'tools_industrial', translationKey: 'subcategory_tools_industrial' },
      ],
    },
    {
      id: 'business_sale',
      translationKey: 'subcategory_business_sale',
      items: [
        { id: 'ready_business', translationKey: 'subcategory_ready_business' },
        { id: 'franchise', translationKey: 'subcategory_franchise' },
      ],
    },
  ],
};

export const categoryIcons: Record<Category | '', string> = {
  '': '🔍',
  transport: '🚗',
  realEstate: '🏠',
  jobs: '💼',
  services: '🔧',
  personalItems: '👕',
  homeAndGarden: '🏡',
  autoParts: '🔩',
  electronics: '📱',
  hobbies: '🎨',
  animals: '🐕',
  business: '🏢',
};
