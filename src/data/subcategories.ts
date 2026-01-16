import { Category } from '@/types/listing';
import {
  CarFront,
  House,
  Briefcase,
  Wrench,
  Shirt,
  Sofa,
  Cog,
  Smartphone,
  Palette,
  PawPrint,
  Building2,
  Search,
  LucideIcon,
} from 'lucide-react';

export interface Subcategory {
  id: string;
  translationKey: string;
  children?: Subcategory[];
}

export interface SubcategoryGroup {
  id: string;
  translationKey: string;
  items: Subcategory[];
}

// Helper to get all subcategory IDs including nested ones (for database queries)
export const getAllSubcategoryIds = (subcategory: Subcategory): string[] => {
  if (subcategory.children && subcategory.children.length > 0) {
    return subcategory.children.map(child => child.id);
  }
  return [subcategory.id];
};

// Helper to find a subcategory by ID (including nested ones)
export const findSubcategoryById = (subcategories: Subcategory[], id: string): Subcategory | undefined => {
  for (const sub of subcategories) {
    if (sub.id === id) return sub;
    if (sub.children) {
      const found = sub.children.find(child => child.id === id);
      if (found) return found;
    }
  }
  return undefined;
};

// Helper to get parent subcategory for a nested subcategory
export const getParentSubcategory = (subcategories: Subcategory[], childId: string): Subcategory | undefined => {
  for (const sub of subcategories) {
    if (sub.children?.some(child => child.id === childId)) {
      return sub;
    }
  }
  return undefined;
};

export const subcategoriesData: Record<Category, Subcategory[]> = {
  transport: [
    { id: 'cars', translationKey: 'Автомобили' },
    { 
      id: 'motorcycles', 
      translationKey: 'Мотоциклы и мототехника',
      children: [
        { id: 'atvs', translationKey: 'Вездеходы' },
        { id: 'karting', translationKey: 'Картинг' },
        { id: 'quads_buggies', translationKey: 'Квадроциклы и багги' },
        { id: 'mopeds_scooters', translationKey: 'Мопеды и скутеры' },
        { id: 'motorbikes', translationKey: 'Мотоциклы' },
        { id: 'snowmobiles', translationKey: 'Снегоходы' },
      ]
    },
    { 
      id: 'trucks', 
      translationKey: 'Грузовики и спецтехника',
      children: [
        { id: 'trucks_cargo', translationKey: 'Грузовики' },
        { id: 'trucks_agro', translationKey: 'Сельхозтехника' },
        { id: 'trucks_trailers', translationKey: 'Прицепы' },
        { id: 'trucks_excavators', translationKey: 'Экскаваторы' },
        { id: 'trucks_buses', translationKey: 'Автобусы' },
        { id: 'trucks_motorhomes', translationKey: 'Автодома' },
        { id: 'trucks_cranes', translationKey: 'Автокраны' },
        { id: 'trucks_bulldozers', translationKey: 'Бульдозеры' },
        { id: 'trucks_loaders', translationKey: 'Погрузчики' },
        { id: 'trucks_construction', translationKey: 'Строительная техника' },
        { id: 'trucks_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'watercraft', 
      translationKey: 'Водный транспорт',
      children: [
        { id: 'watercraft_rowboats', translationKey: 'Вёсельные лодки' },
        { id: 'watercraft_jetski', translationKey: 'Гидроциклы' },
        { id: 'watercraft_yachts', translationKey: 'Катера и яхты' },
        { id: 'watercraft_motorboats', translationKey: 'Моторные лодки и моторы' },
      ]
    },
  ],
  realEstate: [
    { id: 'buy', translationKey: 'Купить жильё' },
    { id: 'rent_daily', translationKey: 'Арендовать посуточно' },
    { id: 'rent_long', translationKey: 'Арендовать долгосрочно' },
    { id: 'commercial', translationKey: 'Коммерческая недвижимость' },
    { id: 'land', translationKey: 'Земельные участки' },
  ],
  jobs: [
    { id: 'looking_job', translationKey: 'Ищу работу' },
    { id: 'looking_employee', translationKey: 'Ищу сотрудника' },
  ],
  services: [
    { id: 'auto_service', translationKey: 'Автосервис, аренда' },
    { id: 'transportation', translationKey: 'Перевозки и доставка' },
    { id: 'movers', translationKey: 'Грузчики, складские услуги' },
    { id: 'tow_truck', translationKey: 'Услуги эвакуатора' },
    { id: 'repair_finishing', translationKey: 'Ремонт и отделка' },
    { id: 'construction', translationKey: 'Строительство' },
    { id: 'garden_landscaping', translationKey: 'Сад, благоустройство' },
    { id: 'beauty', translationKey: 'Красота' },
    { id: 'health', translationKey: 'Здоровье' },
    { id: 'tech_repair', translationKey: 'Ремонт и обслуживание техники' },
    { id: 'computer_help', translationKey: 'Компьютерная помощь' },
    { id: 'installation', translationKey: 'Монтаж и установка техники' },
    { id: 'equipment_production', translationKey: 'Оборудование, производство' },
    { id: 'education_courses', translationKey: 'Обучение, курсы' },
    { id: 'business_services', translationKey: 'Деловые услуги' },
    { id: 'insurance', translationKey: 'Страхование' },
    { id: 'intermediary', translationKey: 'Услуги посредников' },
    { id: 'printing_advertising', translationKey: 'Полиграфия, наружная реклама' },
    { id: 'waste_removal', translationKey: 'Вывоз мусора и вторсырья' },
    { id: 'cleaning', translationKey: 'Уборка' },
    { id: 'disinfection', translationKey: 'Дезинфекция, дезинсекция, спецуборка' },
    { id: 'household', translationKey: 'Бытовые услуги' },
    { id: 'events', translationKey: 'Праздники, мероприятия' },
    { id: 'food_delivery', translationKey: 'Доставка продуктов, десертов, кейтеринг' },
    { id: 'photo_video', translationKey: 'Фото- и видеосъёмка' },
    { id: 'nannies_caregivers', translationKey: 'Няни, сиделки' },
    { id: 'pet_care', translationKey: 'Уход за животными' },
    { id: 'art', translationKey: 'Искусство' },
    { id: 'security', translationKey: 'Охрана, безопасность' },
    { id: 'other', translationKey: 'Другое' },
  ],
  personalItems: [
    { id: 'clothing', translationKey: 'Одежда, обувь, аксессуары' },
    { id: 'kids_clothing', translationKey: 'Детская одежда и обувь' },
    { id: 'kids_goods', translationKey: 'Товары для детей и игрушки' },
    { id: 'beauty_health', translationKey: 'Красота и здоровье' },
    { id: 'watches_jewelry', translationKey: 'Часы и украшения' },
  ],
  homeAndGarden: [
    { id: 'repair_construction', translationKey: 'Ремонт и строительство' },
    { id: 'furniture_interior', translationKey: 'Мебель и интерьер' },
    { id: 'appliances', translationKey: 'Бытовая техника' },
    { id: 'food_products', translationKey: 'Продукты питания' },
    { id: 'plants', translationKey: 'Растения' },
    { id: 'kitchen_goods', translationKey: 'Посуда и товары для кухни' },
  ],
  autoParts: [
    { id: 'parts', translationKey: 'Запчасти' },
    { id: 'tires_wheels', translationKey: 'Шины, диски и колёса' },
    { id: 'audio_video', translationKey: 'Аудио- и видеотехника' },
    { id: 'accessories', translationKey: 'Аксессуары' },
    { id: 'roof_racks', translationKey: 'Багажники и фаркопы' },
    { id: 'tools', translationKey: 'Инструменты' },
    { id: 'trailers', translationKey: 'Прицепы' },
    { id: 'equipment', translationKey: 'Экипировка' },
    { id: 'oils_chemicals', translationKey: 'Масла и автохимия' },
    { id: 'anti_theft', translationKey: 'Противоугонные устройства' },
    { id: 'gps', translationKey: 'GPS-навигаторы' },
  ],
  electronics: [
    { id: 'phones', translationKey: 'Телефоны' },
    { id: 'audio_video', translationKey: 'Аудио и видео' },
    { id: 'computer_goods', translationKey: 'Товары для компьютера' },
    { id: 'games_consoles', translationKey: 'Игры, приставки и программы' },
    { id: 'laptops', translationKey: 'Ноутбуки' },
    { id: 'desktops', translationKey: 'Настольные компьютеры' },
    { id: 'photo_equipment', translationKey: 'Фототехника' },
    { id: 'tablets_ebooks', translationKey: 'Планшеты и электронные книги' },
    { id: 'office_equipment', translationKey: 'Оргтехника и расходники' },
  ],
  hobbies: [
    { id: 'tickets_travel', translationKey: 'Билеты и путешествия' },
    { id: 'bicycles', translationKey: 'Велосипеды' },
    { id: 'books_magazines', translationKey: 'Книги и журналы' },
    { id: 'collecting', translationKey: 'Коллекционирование' },
    { id: 'musical_instruments', translationKey: 'Музыкальные инструменты' },
    { id: 'hunting_fishing', translationKey: 'Охота и рыбалка' },
    { id: 'sports_leisure', translationKey: 'Спорт и отдых' },
  ],
  animals: [
    { id: 'dogs', translationKey: 'Собаки' },
    { id: 'cats', translationKey: 'Кошки' },
    { id: 'birds', translationKey: 'Птицы' },
    { id: 'aquarium', translationKey: 'Аквариум' },
    { id: 'other_animals', translationKey: 'Другие животные' },
    { id: 'pet_supplies', translationKey: 'Товары для животных' },
  ],
  business: [
    { id: 'business_equipment', translationKey: 'Оборудование для бизнеса' },
    { id: 'franchise', translationKey: 'Франшизы' },
    { id: 'ready_business', translationKey: 'Готовый бизнес' },
    { id: 'business_software', translationKey: 'ПО для бизнеса' },
  ],
};

export const categoryIcons: Record<Category | '', LucideIcon> = {
  '': Search,
  transport: CarFront,
  realEstate: House,
  jobs: Briefcase,
  services: Wrench,
  personalItems: Shirt,
  homeAndGarden: Sofa,
  autoParts: Cog,
  electronics: Smartphone,
  hobbies: Palette,
  animals: PawPrint,
  business: Building2,
};
