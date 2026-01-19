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
    { 
      id: 'intermediary', 
      translationKey: 'Услуги посредников',
      children: [
        { id: 'intermediary_buyout', translationKey: 'Услуги выкупа' },
        { id: 'intermediary_import', translationKey: 'Поставка товаров из-за границы' },
        { id: 'intermediary_finance', translationKey: 'Помощь с финансовыми вопросами' },
        { id: 'intermediary_tourism', translationKey: 'Туристические услуги' },
        { id: 'intermediary_consulting', translationKey: 'Консультации' },
      ]
    },
    { id: 'printing_advertising', translationKey: 'Полиграфия, наружная реклама' },
    { 
      id: 'waste_removal', 
      translationKey: 'Вывоз мусора и вторсырья',
      children: [
        { id: 'waste_garbage', translationKey: 'Вывоз мусора' },
        { id: 'waste_recycling', translationKey: 'Приём вторсырья' },
      ]
    },
    { 
      id: 'cleaning', 
      translationKey: 'Уборка',
      children: [
        { id: 'cleaning_general', translationKey: 'Генеральная уборка' },
        { id: 'cleaning_windows', translationKey: 'Мойка окон' },
        { id: 'cleaning_simple', translationKey: 'Простая уборка' },
        { id: 'cleaning_carpets', translationKey: 'Чистка ковров' },
        { id: 'cleaning_furniture', translationKey: 'Чистка мягкой мебели' },
        { id: 'cleaning_other', translationKey: 'Другое' },
      ]
    },
    { id: 'disinfection', translationKey: 'Дезинфекция, дезинсекция, спецуборка' },
    { 
      id: 'household', 
      translationKey: 'Бытовые услуги',
      children: [
        { id: 'household_keys', translationKey: 'Изготовление ключей и заточка' },
        { id: 'household_sewing', translationKey: 'Пошив и ремонт одежды и других изделий' },
        { id: 'household_watches', translationKey: 'Ремонт часов' },
        { id: 'household_dryclean', translationKey: 'Химчистка, стирка' },
        { id: 'household_jewelry', translationKey: 'Ювелирные услуги' },
      ]
    },
    { 
      id: 'events', 
      translationKey: 'Праздники, мероприятия',
      children: [
        { id: 'events_organization', translationKey: 'Организация и проведение мероприятий' },
        { id: 'events_decoration', translationKey: 'Оформление и декор' },
        { id: 'events_rental', translationKey: 'Прокат и аренда для мероприятий' },
        { id: 'events_leisure', translationKey: 'Организация досуга и отдыха' },
      ]
    },
    { 
      id: 'food_delivery', 
      translationKey: 'Доставка продуктов, десертов, кейтеринг',
      children: [
        { id: 'food_ready', translationKey: 'Доставка готовой еды' },
        { id: 'food_cakes', translationKey: 'Торты и десерты на заказ' },
        { id: 'food_catering', translationKey: 'Кейтеринг, официанты, повара, бармены' },
      ]
    },
    { 
      id: 'photo_video', 
      translationKey: 'Фото- и видеосъёмка',
      children: [
        { id: 'photo_shooting', translationKey: 'Фотосъёмка' },
        { id: 'video_shooting', translationKey: 'Видеосъёмка' },
        { id: 'photo_studio', translationKey: 'Аренда фотостудии' },
      ]
    },
    { id: 'nannies_caregivers', translationKey: 'Няни, сиделки' },
    { id: 'pet_care', translationKey: 'Уход за животными' },
    { 
      id: 'art', 
      translationKey: 'Искусство',
      children: [
        { id: 'art_music', translationKey: 'Музыка, стихи, песни на заказ' },
        { id: 'art_artists', translationKey: 'Услуги художников' },
        { id: 'art_customization', translationKey: 'Кастомизация' },
        { id: 'art_handmade', translationKey: 'Рукоделие на заказ' },
      ]
    },
    { id: 'security', translationKey: 'Охрана, безопасность' },
    { id: 'other', translationKey: 'Другое' },
  ],
  personalItems: [
    { 
      id: 'clothing', 
      translationKey: 'Одежда, обувь, аксессуары',
      children: [
        { id: 'clothing_women', translationKey: 'Женская одежда' },
        { id: 'clothing_women_shoes', translationKey: 'Женская обувь' },
        { id: 'clothing_men', translationKey: 'Мужская одежда' },
        { id: 'clothing_men_shoes', translationKey: 'Мужская обувь' },
        { id: 'clothing_bags', translationKey: 'Сумки, рюкзаки и чемоданы' },
        { id: 'clothing_accessories', translationKey: 'Аксессуары' },
      ]
    },
    { 
      id: 'kids_clothing', 
      translationKey: 'Детская одежда и обувь',
      children: [
        { id: 'kids_clothing_girls', translationKey: 'Для девочек' },
        { id: 'kids_clothing_boys', translationKey: 'Для мальчиков' },
      ]
    },
    { 
      id: 'kids_goods', 
      translationKey: 'Товары для детей и игрушки',
      children: [
        { id: 'kids_car_seats', translationKey: 'Автомобильные кресла' },
        { id: 'kids_scooters', translationKey: 'Самокаты и беговелы' },
        { id: 'kids_furniture', translationKey: 'Детская мебель' },
        { id: 'kids_strollers', translationKey: 'Детские коляски' },
        { id: 'kids_toys', translationKey: 'Игрушки' },
        { id: 'kids_bedding', translationKey: 'Постельные принадлежности' },
        { id: 'kids_school', translationKey: 'Товары для школы' },
        { id: 'kids_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'beauty_health', 
      translationKey: 'Красота и здоровье',
      children: [
        { id: 'beauty_makeup_nails', translationKey: 'Макияж и маникюр' },
        { id: 'beauty_perfume', translationKey: 'Парфюмерия' },
        { id: 'beauty_devices', translationKey: 'Приборы и аксессуары' },
        { id: 'beauty_care', translationKey: 'Уход и гигиена' },
        { id: 'beauty_hair_products', translationKey: 'Средства для волос' },
        { id: 'beauty_medical', translationKey: 'Медицинские изделия' },
      ]
    },
    { 
      id: 'watches_jewelry', 
      translationKey: 'Часы и украшения',
      children: [
        { id: 'jewelry_gold', translationKey: 'Ювелирные изделия' },
        { id: 'jewelry_watches', translationKey: 'Часы' },
        { id: 'jewelry_bijouterie', translationKey: 'Бижутерия' },
      ]
    },
    { id: 'personal_other', translationKey: 'Другое' },
  ],
  homeAndGarden: [
    { 
      id: 'repair_construction', 
      translationKey: 'Ремонт и строительство',
      children: [
        { id: 'hg_doors', translationKey: 'Двери' },
        { id: 'hg_tools', translationKey: 'Инструменты' },
        { id: 'hg_fireplaces', translationKey: 'Камины и обогреватели' },
        { id: 'hg_windows', translationKey: 'Окна и балконы' },
        { id: 'hg_ceilings', translationKey: 'Потолки' },
        { id: 'hg_garden', translationKey: 'Для сада и дачи' },
        { id: 'hg_plumbing', translationKey: 'Сантехника, водоснабжение и сауна' },
        { id: 'hg_materials', translationKey: 'Стройматериалы' },
        { id: 'hg_buildings', translationKey: 'Готовые строения и срубы' },
        { id: 'hg_gates', translationKey: 'Ворота, заборы и ограждения' },
      ]
    },
    { 
      id: 'furniture_interior', 
      translationKey: 'Мебель и интерьер',
      children: [
        { id: 'furniture_computer', translationKey: 'Компьютерные столы и кресла' },
        { id: 'furniture_beds', translationKey: 'Кровати, диваны и кресла' },
        { id: 'furniture_kitchen', translationKey: 'Кухонные гарнитуры' },
        { id: 'furniture_lighting', translationKey: 'Освещение' },
        { id: 'furniture_stands', translationKey: 'Подставки и тумбы' },
        { id: 'furniture_art', translationKey: 'Предметы интерьера, искусство' },
        { id: 'furniture_tables', translationKey: 'Столы и стулья' },
        { id: 'furniture_textiles', translationKey: 'Текстиль и ковры' },
        { id: 'furniture_storage', translationKey: 'Шкафы, комоды и стеллажи' },
        { id: 'furniture_garden', translationKey: 'Садовая мебель' },
        { id: 'furniture_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'appliances', 
      translationKey: 'Бытовая техника',
      children: [
        { id: 'appliances_kitchen', translationKey: 'Для кухни' },
        { id: 'appliances_home', translationKey: 'Для дома' },
        { id: 'appliances_climate', translationKey: 'Климатическое оборудование' },
        { id: 'appliances_personal', translationKey: 'Для индивидуального ухода' },
        { id: 'appliances_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'food_products', 
      translationKey: 'Продукты питания',
      children: [
        { id: 'food_tea', translationKey: 'Чай, кофе, какао' },
        { id: 'food_drinks', translationKey: 'Напитки' },
        { id: 'food_seafood', translationKey: 'Рыба, морепродукты, икра' },
        { id: 'food_meat', translationKey: 'Мясо, птица, субпродукты' },
        { id: 'food_sweets', translationKey: 'Кондитерские изделия' },
        { id: 'food_honey', translationKey: 'Мёд' },
        { id: 'food_grocery', translationKey: 'Бакалея' },
        { id: 'food_vegetables', translationKey: 'Овощи и зелень' },
        { id: 'food_dairy', translationKey: 'Молочные продукты, сыры, яйца' },
        { id: 'food_fruits', translationKey: 'Фрукты и ягоды' },
        { id: 'food_bread', translationKey: 'Хлеб и выпечка' },
        { id: 'food_special', translationKey: 'Специализированное питание' },
        { id: 'food_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'plants', 
      translationKey: 'Растения',
      children: [
        { id: 'plants_indoor', translationKey: 'Комнатные растения' },
        { id: 'plants_bouquets', translationKey: 'Букеты' },
        { id: 'plants_garden', translationKey: 'Садовые растения' },
        { id: 'plants_seeds', translationKey: 'Семена, луковицы, клубни' },
        { id: 'plants_care', translationKey: 'Товары для ухода за растениями' },
        { id: 'plants_artificial', translationKey: 'Панно и искусственные растения' },
        { id: 'plants_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'kitchen_goods', 
      translationKey: 'Посуда и товары для кухни',
      children: [
        { id: 'kitchen_dishes', translationKey: 'Посуда' },
        { id: 'kitchen_items', translationKey: 'Товары для кухни' },
      ]
    },
  ],
  autoParts: [
    { 
      id: 'auto_parts', 
      translationKey: 'Запчасти',
      children: [
        { id: 'parts_cars', translationKey: 'Для автомобилей' },
        { id: 'parts_moto', translationKey: 'Для мототехники' },
        { id: 'parts_trucks', translationKey: 'Для грузовиков и спецтехники' },
        { id: 'parts_watercraft', translationKey: 'Для водного транспорта' },
      ]
    },
    { 
      id: 'auto_tires_wheels', 
      translationKey: 'Шины, диски и колёса',
      children: [
        { id: 'tires_car', translationKey: 'Шины' },
        { id: 'tires_truck', translationKey: 'Шины для грузовиков и спецтехники' },
        { id: 'tires_moto', translationKey: 'Мотошины' },
        { id: 'wheels_rims', translationKey: 'Диски' },
        { id: 'wheels_caps', translationKey: 'Колпаки' },
        { id: 'wheels_complete', translationKey: 'Колёса' },
      ]
    },
    { 
      id: 'auto_audio_video', 
      translationKey: 'Аудио- и видеотехника',
      children: [
        { id: 'av_accessories', translationKey: 'Аксессуары для автоакустики' },
        { id: 'av_headunits', translationKey: 'Магнитолы' },
        { id: 'av_speakers', translationKey: 'Автоакустика' },
        { id: 'av_dashcams', translationKey: 'Видеорегистраторы' },
        { id: 'av_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'auto_accessories', 
      translationKey: 'Аксессуары',
      children: [
        { id: 'acc_moto_water', translationKey: 'Для мото- и водного транспорта' },
        { id: 'acc_wipers', translationKey: 'Щётки стеклоочистителя' },
        { id: 'acc_interior', translationKey: 'Для салона' },
        { id: 'acc_protection', translationKey: 'Защита и декор' },
        { id: 'acc_driver_kit', translationKey: 'Набор автомобилиста' },
        { id: 'acc_wheels', translationKey: 'Для колёс' },
        { id: 'acc_heating', translationKey: 'Отопительное оборудование' },
        { id: 'acc_care', translationKey: 'Уход' },
      ]
    },
    { 
      id: 'auto_roof_racks', 
      translationKey: 'Багажники и фаркопы',
      children: [
        { id: 'rack_crossbars', translationKey: 'Поперечные дуги и комплектующие' },
        { id: 'rack_rails', translationKey: 'Рейлинги на крышу' },
        { id: 'rack_towbars', translationKey: 'Фаркопы и комплектующие' },
        { id: 'rack_bike_ski', translationKey: 'Крепления для перевозки велосипедов и лыж' },
        { id: 'rack_expedition', translationKey: 'Экспедиционные багажники' },
        { id: 'rack_boxes', translationKey: 'Автобоксы' },
        { id: 'rack_other', translationKey: 'Другое' },
      ]
    },
    { id: 'auto_tools', translationKey: 'Инструменты' },
    { 
      id: 'auto_trailers', 
      translationKey: 'Прицепы',
      children: [
        { id: 'trailer_flatbed', translationKey: 'Бортовые' },
        { id: 'trailer_boat', translationKey: 'Для водного транспорта' },
        { id: 'trailer_tow', translationKey: 'Эвакуаторы' },
        { id: 'trailer_parts', translationKey: 'Запчасти и комплектующие' },
        { id: 'trailer_other', translationKey: 'Другое' },
      ]
    },
    { id: 'auto_equipment', translationKey: 'Экипировка' },
    { 
      id: 'auto_oils_chemicals', 
      translationKey: 'Масла и автохимия',
      children: [
        { id: 'oil_motor', translationKey: 'Моторные масла' },
        { id: 'oil_transmission', translationKey: 'Трансмиссионные масла' },
        { id: 'oil_coolant', translationKey: 'Охлаждающие жидкости' },
        { id: 'oil_brake', translationKey: 'Тормозные жидкости' },
        { id: 'oil_hydraulic', translationKey: 'Гидравлические жидкости' },
        { id: 'oil_washer', translationKey: 'Жидкости для омывателя стекла' },
        { id: 'oil_additives', translationKey: 'Промывочные жидкости, присадки и смазки' },
        { id: 'oil_other', translationKey: 'Другие масла' },
        { id: 'oil_cosmetics', translationKey: 'Автокосметика и аксессуары' },
        { id: 'oil_fuel', translationKey: 'Топливо' },
      ]
    },
    { 
      id: 'auto_anti_theft', 
      translationKey: 'Противоугонные устройства',
      children: [
        { id: 'antitheft_alarm', translationKey: 'Автосигнализации' },
        { id: 'antitheft_immobilizer', translationKey: 'Иммобилайзеры' },
        { id: 'antitheft_mechanical', translationKey: 'Механические блокираторы' },
        { id: 'antitheft_satellite', translationKey: 'Спутниковые системы' },
      ]
    },
    { id: 'auto_gps', translationKey: 'GPS-навигаторы' },
  ],
  electronics: [
    { 
      id: 'phones', 
      translationKey: 'Телефоны',
      children: [
        { id: 'phones_mobile', translationKey: 'Мобильные телефоны' },
        { id: 'phones_accessories', translationKey: 'Аксессуары' },
        { id: 'phones_radios', translationKey: 'Рации' },
        { id: 'phones_landline', translationKey: 'Стационарные телефоны' },
      ]
    },
    { 
      id: 'audio_video', 
      translationKey: 'Аудио и видео',
      children: [
        { id: 'av_tv_projectors', translationKey: 'Телевизоры и проекторы' },
        { id: 'av_headphones', translationKey: 'Наушники' },
        { id: 'av_speakers_sub', translationKey: 'Акустика, колонки, сабвуферы' },
        { id: 'av_accessories_el', translationKey: 'Аксессуары' },
        { id: 'av_music_centers', translationKey: 'Музыкальные центры, магнитолы' },
        { id: 'av_amplifiers', translationKey: 'Усилители и ресиверы' },
        { id: 'av_camcorders', translationKey: 'Видеокамеры' },
        { id: 'av_dvd_bluray', translationKey: 'Видео, DVD и Blu-ray плееры' },
        { id: 'av_cables', translationKey: 'Кабели и адаптеры' },
        { id: 'av_media', translationKey: 'Музыка и фильмы' },
        { id: 'av_microphones', translationKey: 'Микрофоны' },
        { id: 'av_mp3', translationKey: 'MP3-плееры' },
      ]
    },
    { 
      id: 'computer_goods', 
      translationKey: 'Товары для компьютера',
      children: [
        { id: 'pc_components', translationKey: 'Комплектующие' },
        { id: 'pc_monitors', translationKey: 'Мониторы и запчасти' },
        { id: 'pc_network', translationKey: 'Сетевое оборудование' },
        { id: 'pc_keyboards', translationKey: 'Клавиатуры и мыши' },
        { id: 'pc_accessories', translationKey: 'Аксессуары' },
        { id: 'pc_controllers', translationKey: 'Джойстики и рули' },
        { id: 'pc_flash', translationKey: 'Флэшки и карты памяти' },
        { id: 'pc_audio', translationKey: 'Акустика' },
        { id: 'pc_hdd', translationKey: 'Переносные жёсткие диски' },
        { id: 'pc_webcams', translationKey: 'Веб-камеры' },
        { id: 'pc_tuners', translationKey: 'ТВ-тюнеры' },
      ]
    },
    { 
      id: 'games_consoles', 
      translationKey: 'Игры, приставки и программы',
      children: [
        { id: 'games_consoles_acc', translationKey: 'Игровые приставки и аксессуары' },
        { id: 'games_console_games', translationKey: 'Игры для приставок' },
        { id: 'games_software', translationKey: 'Программы' },
        { id: 'games_pc_games', translationKey: 'Компьютерные игры' },
      ]
    },
    { id: 'laptops', translationKey: 'Ноутбуки' },
    { 
      id: 'desktops', 
      translationKey: 'Настольные компьютеры',
      children: [
        { id: 'desktops_towers', translationKey: 'Системные блоки' },
        { id: 'desktops_aio', translationKey: 'Моноблоки' },
        { id: 'desktops_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'photo_equipment', 
      translationKey: 'Фототехника',
      children: [
        { id: 'photo_gear', translationKey: 'Оборудование и аксессуары' },
        { id: 'photo_lenses', translationKey: 'Объективы' },
        { id: 'photo_compact', translationKey: 'Компактные фотоаппараты' },
        { id: 'photo_film', translationKey: 'Плёночные фотоаппараты' },
        { id: 'photo_dslr', translationKey: 'Зеркальные фотоаппараты' },
        { id: 'photo_binoculars', translationKey: 'Бинокли и телескопы' },
      ]
    },
    { 
      id: 'tablets_ebooks', 
      translationKey: 'Планшеты и электронные книги',
      children: [
        { id: 'tablets_tablets', translationKey: 'Планшеты' },
        { id: 'tablets_accessories', translationKey: 'Аксессуары' },
        { id: 'tablets_ereaders', translationKey: 'Электронные книги' },
      ]
    },
    { 
      id: 'office_equipment', 
      translationKey: 'Оргтехника и расходники',
      children: [
        { id: 'office_mfp', translationKey: 'МФУ, копиры и сканеры' },
        { id: 'office_printers', translationKey: 'Принтеры' },
        { id: 'office_stationery', translationKey: 'Канцелярия' },
        { id: 'office_ups', translationKey: 'ИБП, сетевые фильтры' },
        { id: 'office_telephony', translationKey: 'Телефония' },
        { id: 'office_shredders', translationKey: 'Уничтожители бумаг' },
        { id: 'office_supplies', translationKey: 'Расходные материалы' },
      ]
    },
  ],
  hobbies: [
    { 
      id: 'tickets_travel', 
      translationKey: 'Билеты и путешествия',
      children: [
        { id: 'tickets_coupons', translationKey: 'Карты, купоны' },
        { id: 'tickets_concerts', translationKey: 'Концерты' },
        { id: 'tickets_travel_trips', translationKey: 'Путешествия' },
        { id: 'tickets_sports', translationKey: 'Спорт' },
        { id: 'tickets_theater', translationKey: 'Театр, опера, балет' },
        { id: 'tickets_circus', translationKey: 'Цирк, кино' },
        { id: 'tickets_shows', translationKey: 'Шоу, мюзикл' },
      ]
    },
    { 
      id: 'bicycles', 
      translationKey: 'Велосипеды',
      children: [
        { id: 'bikes_bmx', translationKey: 'BMX' },
        { id: 'bikes_city', translationKey: 'Городские' },
        { id: 'bikes_road', translationKey: 'Шоссейные' },
        { id: 'bikes_kids', translationKey: 'Детские' },
        { id: 'bikes_mountain', translationKey: 'Горные' },
        { id: 'bikes_electric', translationKey: 'Электровелосипеды' },
        { id: 'bikes_parts', translationKey: 'Запчасти и аксессуары' },
      ]
    },
    { 
      id: 'books_magazines', 
      translationKey: 'Книги и журналы',
      children: [
        { id: 'books_periodicals', translationKey: 'Журналы, газеты, брошюры' },
        { id: 'books_books', translationKey: 'Книги' },
        { id: 'books_educational', translationKey: 'Учебная литература' },
      ]
    },
    { 
      id: 'collecting', 
      translationKey: 'Коллекционирование',
      children: [
        { id: 'collect_banknotes', translationKey: 'Банкноты' },
        { id: 'collect_tickets', translationKey: 'Билеты' },
        { id: 'collect_celebrity', translationKey: 'Вещи знаменитостей, автографы' },
        { id: 'collect_military', translationKey: 'Военные вещи' },
        { id: 'collect_vinyl', translationKey: 'Грампластинки' },
        { id: 'collect_documents', translationKey: 'Документы' },
        { id: 'collect_medals', translationKey: 'Жетоны, медали, значки' },
        { id: 'collect_games', translationKey: 'Игры' },
        { id: 'collect_calendars', translationKey: 'Календари' },
        { id: 'collect_paintings', translationKey: 'Картины' },
        { id: 'collect_kinder', translationKey: 'Киндер-сюрприз' },
        { id: 'collect_envelopes', translationKey: 'Конверты и почтовые карточки' },
        { id: 'collect_stamps', translationKey: 'Марки' },
        { id: 'collect_figures', translationKey: 'Модели, фигурки, куклы' },
        { id: 'collect_coins', translationKey: 'Монеты' },
        { id: 'collect_postcards', translationKey: 'Открытки' },
        { id: 'collect_lighters', translationKey: 'Пепельницы, зажигалки' },
        { id: 'collect_plastic', translationKey: 'Пластиковые карточки' },
        { id: 'collect_sportcards', translationKey: 'Спортивные карточки' },
        { id: 'collect_photos', translationKey: 'Фотографии, письма' },
        { id: 'collect_labels', translationKey: 'Этикетки, бутылки, пробки' },
        { id: 'collect_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'musical_instruments', 
      translationKey: 'Музыкальные инструменты',
      children: [
        { id: 'music_accordion', translationKey: 'Аккордеоны, гармони, баяны' },
        { id: 'music_guitars', translationKey: 'Гитары и другие струнные' },
        { id: 'music_wind', translationKey: 'Духовые' },
        { id: 'music_keyboards', translationKey: 'Клавишные и синтезаторы' },
        { id: 'music_strings', translationKey: 'Скрипки и другие смычковые' },
        { id: 'music_drums', translationKey: 'Ударные' },
        { id: 'music_studio', translationKey: 'Для студии и концертов' },
        { id: 'music_accessories', translationKey: 'Аксессуары' },
      ]
    },
    { 
      id: 'hunting_fishing', 
      translationKey: 'Охота и рыбалка',
      children: [
        { id: 'hunt_knives', translationKey: 'Ножи, мультитулы, топоры' },
        { id: 'hunt_hunting', translationKey: 'Охота' },
        { id: 'hunt_fishing', translationKey: 'Рыбалка' },
        { id: 'hunt_costumes', translationKey: 'Костюмы для охоты и рыбалки' },
      ]
    },
    { 
      id: 'sports_leisure', 
      translationKey: 'Спорт и отдых',
      children: [
        { id: 'sport_fitness', translationKey: 'Фитнес и тренажёры' },
        { id: 'sport_winter', translationKey: 'Зимний спорт' },
        { id: 'sport_tourism', translationKey: 'Туризм и отдых на природе' },
        { id: 'sport_martial', translationKey: 'Единоборства' },
        { id: 'sport_board', translationKey: 'Настольные и карточные игры' },
        { id: 'sport_diving', translationKey: 'Дайвинг и водный спорт' },
        { id: 'sport_ball', translationKey: 'Игры с мячом' },
        { id: 'sport_skating', translationKey: 'Ролики и скейтбординг' },
        { id: 'sport_tennis', translationKey: 'Теннис и бадминтон' },
        { id: 'sport_nutrition', translationKey: 'Спортивное питание' },
        { id: 'sport_shooting', translationKey: 'Стрелковый спорт' },
        { id: 'sport_billiards', translationKey: 'Бильярд и боулинг' },
        { id: 'sport_leisure_goods', translationKey: 'Товары для отдыха' },
        { id: 'sport_gymnastics', translationKey: 'Гимнастика и танцы' },
        { id: 'sport_equestrian', translationKey: 'Конный спорт' },
        { id: 'sport_scooters', translationKey: 'Самокаты и гироскутеры' },
        { id: 'sport_running', translationKey: 'Бег' },
        { id: 'sport_trophies', translationKey: 'Награды и кубки' },
      ]
    },
  ],
  animals: [
    { id: 'dogs', translationKey: 'Собаки' },
    { id: 'cats', translationKey: 'Кошки' },
    { id: 'birds', translationKey: 'Птицы' },
    { id: 'aquarium', translationKey: 'Аквариум' },
    { 
      id: 'other_animals', 
      translationKey: 'Другие животные',
      children: [
        { id: 'animals_amphibians', translationKey: 'Амфибии' },
        { id: 'animals_rodents', translationKey: 'Грызуны' },
        { id: 'animals_rabbits', translationKey: 'Кролики' },
        { id: 'animals_horses', translationKey: 'Лошади' },
        { id: 'animals_reptiles', translationKey: 'Рептилии' },
        { id: 'animals_farm', translationKey: 'С/х животные' },
        { id: 'animals_ferrets', translationKey: 'Хорьки' },
        { id: 'animals_other', translationKey: 'Другое' },
      ]
    },
    { 
      id: 'pet_supplies', 
      translationKey: 'Товары для животных',
      children: [
        { id: 'supplies_dogs_cats', translationKey: 'Собаки и кошки' },
        { id: 'supplies_rodents', translationKey: 'Грызуны' },
        { id: 'supplies_birds', translationKey: 'Птицы' },
        { id: 'supplies_fish_reptiles', translationKey: 'Рыбы и рептилии' },
        { id: 'supplies_farm', translationKey: 'Фермерское хозяйство' },
        { id: 'supplies_other', translationKey: 'Другое' },
      ]
    },
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
