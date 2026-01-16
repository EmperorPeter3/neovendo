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
    { 
      id: 'buy', 
      translationKey: 'Купить жильё',
      children: [
        { id: 'buy_all_apartments', translationKey: 'Все квартиры' },
        { id: 'buy_secondary', translationKey: 'Вторичка' },
        { id: 'buy_new', translationKey: 'Новостройки' },
        { id: 'buy_houses', translationKey: 'Дома, дачи, коттеджи' },
        { id: 'buy_rooms', translationKey: 'Комнаты' },
      ]
    },
    { 
      id: 'rent_daily', 
      translationKey: 'Арендовать посуточно',
      children: [
        { id: 'rent_daily_apartments', translationKey: 'Квартиры' },
        { id: 'rent_daily_houses', translationKey: 'Дома, дачи и коттеджи' },
        { id: 'rent_daily_rooms', translationKey: 'Комнаты и койко-места' },
        { id: 'rent_daily_hotels', translationKey: 'Отели' },
      ]
    },
    { 
      id: 'rent_long', 
      translationKey: 'Арендовать долгосрочно',
      children: [
        { id: 'rent_long_apartments', translationKey: 'Квартиры' },
        { id: 'rent_long_houses', translationKey: 'Дома, дачи и коттеджи' },
        { id: 'rent_long_rooms', translationKey: 'Комнаты и койко-места' },
      ]
    },
    { id: 'commercial', translationKey: 'Коммерческая недвижимость' },
    { 
      id: 'realestate_other', 
      translationKey: 'Другое',
      children: [
        { id: 'realestate_land', translationKey: 'Земельные участки' },
        { id: 'realestate_garages', translationKey: 'Гаражи и машиноместа' },
      ]
    },
  ],
  jobs: [
    { id: 'looking_job', translationKey: 'Ищу работу' },
    { id: 'looking_employee', translationKey: 'Ищу сотрудника' },
  ],
  services: [
    { 
      id: 'auto_service', 
      translationKey: 'Автосервис, аренда',
      children: [
        { id: 'auto_service_cars', translationKey: 'Автосервисы для автомобилей' },
        { id: 'auto_service_trucks', translationKey: 'Автосервисы для грузовиков и спецтехники' },
        { id: 'auto_service_other', translationKey: 'Автосервисы для другой техники' },
        { id: 'auto_rental_cars', translationKey: 'Аренда авто' },
        { id: 'auto_rental_special', translationKey: 'Аренда спецтехники' },
      ]
    },
    { 
      id: 'transportation', 
      translationKey: 'Перевозки и доставка',
      children: [
        { id: 'transport_city', translationKey: 'По городу' },
        { id: 'transport_intercity', translationKey: 'Между городами' },
        { id: 'transport_international', translationKey: 'Международные' },
        { id: 'transport_transfer', translationKey: 'Трансфер' },
        { id: 'transport_custom_car', translationKey: 'Авто под заказ' },
        { id: 'transport_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'movers', 
      translationKey: 'Грузчики, складские услуги',
      children: [
        { id: 'movers_porters', translationKey: 'Грузчики' },
        { id: 'movers_fulfillment', translationKey: 'Фулфилмент' },
      ]
    },
    { id: 'tow_truck', translationKey: 'Услуги эвакуатора' },
    { 
      id: 'repair_finishing', 
      translationKey: 'Ремонт и отделка',
      children: [
        { id: 'repair_turnkey', translationKey: 'Ремонт квартир и домов под ключ' },
        { id: 'repair_design', translationKey: 'Дизайн интерьеров' },
        { id: 'repair_plumbing', translationKey: 'Сантехника' },
        { id: 'repair_electrical', translationKey: 'Электрика' },
        { id: 'repair_furniture', translationKey: 'Сборка и ремонт мебели' },
        { id: 'repair_windows', translationKey: 'Окна и балконы' },
        { id: 'repair_wallpaper', translationKey: 'Поклейка обоев и малярные работы' },
        { id: 'repair_ceilings', translationKey: 'Потолки' },
        { id: 'repair_floors', translationKey: 'Полы и напольные покрытия' },
        { id: 'repair_plastering', translationKey: 'Штукатурные работы' },
        { id: 'repair_doors', translationKey: 'Двери' },
        { id: 'repair_tiles', translationKey: 'Плиточные работы' },
        { id: 'repair_carpentry', translationKey: 'Столярные и плотницкие работы' },
        { id: 'repair_drywall', translationKey: 'Гипсокартонные работы' },
        { id: 'repair_height', translationKey: 'Высотные работы' },
        { id: 'repair_insulation', translationKey: 'Изоляция и утепление' },
        { id: 'repair_commercial', translationKey: 'Ремонт коммерческих помещений' },
        { id: 'repair_ventilation', translationKey: 'Вентиляция' },
        { id: 'repair_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'construction', 
      translationKey: 'Строительство',
      children: [
        { id: 'construction_houses', translationKey: 'Строительство домов под ключ' },
        { id: 'construction_garages', translationKey: 'Строительство гаражей, бань, веранд' },
        { id: 'construction_wooden', translationKey: 'Отделка деревянных домов, бань, саун' },
        { id: 'construction_masonry', translationKey: 'Кладочные работы' },
        { id: 'construction_roofing', translationKey: 'Кровельные работы' },
        { id: 'construction_welding', translationKey: 'Сварка, ковка, металлоконструкции' },
        { id: 'construction_foundation', translationKey: 'Фундаментные и бетонные работы' },
        { id: 'construction_diamond', translationKey: 'Алмазное сверление и резка' },
        { id: 'construction_demolition', translationKey: 'Снос и демонтаж' },
        { id: 'construction_facade', translationKey: 'Фасадные работы' },
        { id: 'construction_design', translationKey: 'Проектирование и сметы' },
        { id: 'construction_laborers', translationKey: 'Разнорабочие' },
        { id: 'construction_survey', translationKey: 'Изыскательные работы' },
        { id: 'construction_stairs', translationKey: 'Лестницы' },
        { id: 'construction_gas', translationKey: 'Газификация' },
        { id: 'construction_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'garden_landscaping', 
      translationKey: 'Сад, благоустройство',
      children: [
        { id: 'garden_wells', translationKey: 'Бурение, скважины, септики, колодцы' },
        { id: 'garden_water', translationKey: 'Водоёмы, бассейны, фонтаны' },
        { id: 'garden_roads', translationKey: 'Дорожное строительство' },
        { id: 'garden_fences', translationKey: 'Ограждения, навесы, рольставни' },
        { id: 'garden_earthwork', translationKey: 'Земляные работы' },
        { id: 'garden_greenery', translationKey: 'Озеленение, уход за садом и огородом' },
        { id: 'garden_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'beauty', 
      translationKey: 'Красота',
      children: [
        { id: 'beauty_nails', translationKey: 'Маникюр, педикюр' },
        { id: 'beauty_hair', translationKey: 'Услуги парикмахера' },
        { id: 'beauty_lashes', translationKey: 'Ресницы, брови' },
        { id: 'beauty_permanent', translationKey: 'Перманентный макияж' },
        { id: 'beauty_cosmetology', translationKey: 'Косметология' },
        { id: 'beauty_epilation', translationKey: 'Эпиляция' },
        { id: 'beauty_makeup', translationKey: 'Макияж' },
        { id: 'beauty_spa', translationKey: 'СПА-услуги, массаж' },
        { id: 'beauty_tattoo', translationKey: 'Тату, пирсинг' },
        { id: 'beauty_rental', translationKey: 'Аренда рабочего места' },
        { id: 'beauty_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'health', 
      translationKey: 'Здоровье',
      children: [
        { id: 'health_psychology', translationKey: 'Психология' },
        { id: 'health_nutrition', translationKey: 'Диетология' },
        { id: 'health_fitness', translationKey: 'Фитнес, йога' },
        { id: 'health_dental', translationKey: 'Стоматология' },
        { id: 'health_podology', translationKey: 'Подология' },
        { id: 'health_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'tech_repair', 
      translationKey: 'Ремонт и обслуживание техники',
      children: [
        { id: 'tech_tv', translationKey: 'Телевизоры' },
        { id: 'tech_mobile', translationKey: 'Мобильные устройства' },
        { id: 'tech_photo_audio', translationKey: 'Фото-, аудио-, видеотехника' },
        { id: 'tech_ac', translationKey: 'Кондиционеры, вентиляция' },
        { id: 'tech_washing', translationKey: 'Стиральные, сушильные машины' },
        { id: 'tech_dishwasher', translationKey: 'Посудомоечные машины' },
        { id: 'tech_fridge', translationKey: 'Холодильники, морозильные камеры' },
        { id: 'tech_stove', translationKey: 'Варочные панели, духовые шкафы' },
        { id: 'tech_boiler', translationKey: 'Газовые котлы, водонагреватели' },
        { id: 'tech_coffee', translationKey: 'Кофемашины' },
        { id: 'tech_sewing', translationKey: 'Швейные машины, оверлоки' },
        { id: 'tech_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'computer_help', 
      translationKey: 'Компьютерная помощь',
      children: [
        { id: 'computer_pc', translationKey: 'Компьютеры' },
        { id: 'computer_printers', translationKey: 'Принтеры' },
        { id: 'computer_mining', translationKey: 'Оборудование для майнинга' },
        { id: 'computer_consoles', translationKey: 'Игровые приставки' },
        { id: 'computer_software', translationKey: 'ОС и программы' },
        { id: 'computer_network', translationKey: 'Интернет и другие сети' },
      ]
    },
    { id: 'installation', translationKey: 'Монтаж и установка техники' },
    { 
      id: 'equipment_production', 
      translationKey: 'Оборудование, производство',
      children: [
        { id: 'equipment_rental', translationKey: 'Аренда оборудования' },
        { id: 'equipment_manufacturing', translationKey: 'Производство, обработка' },
      ]
    },
    { 
      id: 'education_courses', 
      translationKey: 'Обучение, курсы',
      children: [
        { id: 'education_school', translationKey: 'Предметы школы и вуза' },
        { id: 'education_languages', translationKey: 'Иностранные языки' },
        { id: 'education_kids', translationKey: 'Детское развитие, логопеды' },
        { id: 'education_it', translationKey: 'IT, бизнес' },
        { id: 'education_design', translationKey: 'Дизайн, рисование' },
        { id: 'education_beauty', translationKey: 'Красота, здоровье' },
        { id: 'education_sports', translationKey: 'Спорт, танцы' },
        { id: 'education_driving', translationKey: 'Вождение' },
        { id: 'education_music', translationKey: 'Музыка, театр' },
        { id: 'education_professional', translationKey: 'Профессиональная подготовка' },
        { id: 'education_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'business_services', 
      translationKey: 'Деловые услуги',
      children: [
        { id: 'business_accounting', translationKey: 'Бухгалтерия, финансы' },
        { id: 'business_consulting', translationKey: 'Консультирование' },
        { id: 'business_realestate', translationKey: 'Консультации по недвижимости' },
        { id: 'business_it_design', translationKey: 'IT, дизайн, тексты' },
        { id: 'business_legal', translationKey: 'Юридические услуги' },
        { id: 'business_marketing', translationKey: 'Маркетинг и продвижение' },
      ]
    },
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
