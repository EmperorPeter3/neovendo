import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface KartingFieldsData {
  brand: string;
  model: string;
  condition: string;
}

export const defaultKartingFields: KartingFieldsData = {
  brand: '',
  model: '',
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
  const tAny = (key: string) => t(key as any);

  const conditionOptions = [
    { value: 'new', label: tAny('kartingFilters.conditionNew') },
    { value: 'used', label: tAny('kartingFilters.conditionUsed') },
    { value: 'for_parts', label: tAny('kartingFilters.conditionForParts') },
  ];

  const handleChange = (field: keyof KartingFieldsData, value: string) => {
    onChange({ ...data, [field]: value });
    if (onClearError && fieldErrors[field]) {
      onClearError(field);
    }
  };

  const getInputClass = (field: string) =>
    fieldErrors[field] ? 'border-destructive ring-destructive' : '';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{tAny('kartingFilters.title')}</h3>

      {/* Brand */}
      <div className="space-y-2">
        <Label>{tAny('brand')}</Label>
        <Input
          placeholder={tAny('enterBrand')}
          value={data.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          className={getInputClass('kart_brand')}
        />
      </div>

      {/* Model */}
      <div className="space-y-2">
        <Label>{tAny('model')}</Label>
        <Input
          placeholder={tAny('enterModel')}
          value={data.model}
          onChange={(e) => handleChange('model', e.target.value)}
        />
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label>{tAny('kartingFilters.condition')}</Label>
        <Select value={data.condition} onValueChange={(v) => handleChange('condition', v)}>
          <SelectTrigger className={getInputClass('kart_condition')}>
            <SelectValue placeholder={tAny('filters.select')} />
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
