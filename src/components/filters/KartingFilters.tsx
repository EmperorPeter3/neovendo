import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

export interface KartingFiltersState {
  condition: 'all' | 'new' | 'used' | 'for_parts';
  descriptionSearch: string;
}

export const defaultKartingFilters: KartingFiltersState = {
  condition: 'all',
  descriptionSearch: '',
};

interface KartingFiltersProps {
  filters: KartingFiltersState;
  onChange: (filters: KartingFiltersState) => void;
}

export const KartingFilters: React.FC<KartingFiltersProps> = ({ filters, onChange }) => {
  const { t } = useLanguage();

  const conditionOptions = [
    { value: 'all', label: t('kartingFilters.conditionAll') },
    { value: 'new', label: t('kartingFilters.conditionNew') },
    { value: 'used', label: t('kartingFilters.conditionUsed') },
    { value: 'for_parts', label: t('kartingFilters.conditionForParts') },
  ];

  const handleConditionChange = (value: string) => {
    onChange({ ...filters, condition: value as KartingFiltersState['condition'] });
  };

  const handleDescriptionSearchChange = (value: string) => {
    onChange({ ...filters, descriptionSearch: value });
  };

  return (
    <div className="space-y-6">
      {/* Condition */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('kartingFilters.condition')}</Label>
        <RadioGroup
          value={filters.condition}
          onValueChange={handleConditionChange}
          className="flex flex-col space-y-2"
        >
          {conditionOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`kart-condition-${option.value}`} />
              <Label htmlFor={`kart-condition-${option.value}`} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Description Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t('kartingFilters.descriptionSearch')}</Label>
        <Input
          type="text"
          placeholder={t('kartingFilters.descriptionSearchPlaceholder')}
          value={filters.descriptionSearch}
          onChange={(e) => handleDescriptionSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default KartingFilters;
