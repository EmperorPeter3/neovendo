import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface KartingFieldsData {
  condition: string;
}

export const defaultKartingFields: KartingFieldsData = {
  condition: '',
};

interface KartingFieldsFormProps {
  data: KartingFieldsData;
  onChange: (data: KartingFieldsData) => void;
  fieldErrors?: Record<string, boolean>;
  onClearError?: (field: string) => void;
}

const KartingFieldsForm: React.FC<KartingFieldsFormProps> = ({
  data,
  onChange,
  fieldErrors = {},
  onClearError,
}) => {
  const { t } = useLanguage();

  const conditionOptions = [
    { value: 'new', label: t('kartingFilters.conditionNew') },
    { value: 'used', label: t('kartingFilters.conditionUsed') },
    { value: 'for_parts', label: t('kartingFilters.conditionForParts') },
  ];

  const handleConditionChange = (value: string) => {
    onChange({ ...data, condition: value });
    onClearError?.('kart_condition');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('kartingFilters.title')}</h3>
      
      {/* Condition */}
      <div className="space-y-2">
        <Label>{t('kartingFilters.condition')}</Label>
        <Select value={data.condition} onValueChange={handleConditionChange}>
          <SelectTrigger className={fieldErrors.kart_condition ? 'border-destructive' : ''}>
            <SelectValue placeholder={t('filters.select')} />
          </SelectTrigger>
          <SelectContent>
            {conditionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default KartingFieldsForm;
