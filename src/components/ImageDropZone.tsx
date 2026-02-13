import { useState, useRef, useCallback } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageDropZoneProps {
  existingImages?: string[];
  newImagePreviews: string[];
  maxImages?: number;
  onFilesAdded: (files: File[]) => void;
  onRemoveExisting?: (index: number) => void;
  onRemoveNew: (index: number) => void;
}

export const ImageDropZone = ({
  existingImages = [],
  newImagePreviews,
  maxImages = 5,
  onFilesAdded,
  onRemoveExisting,
  onRemoveNew,
}: ImageDropZoneProps) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const totalImages = existingImages.length + newImagePreviews.length;
  const canAdd = totalImages < maxImages;

  const handleFiles = useCallback((files: FileList | File[]) => {
    if (!canAdd) return;
    const fileArray = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, maxImages - totalImages);
    if (fileArray.length > 0) {
      onFilesAdded(fileArray);
    }
  }, [canAdd, maxImages, totalImages, onFilesAdded]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-3">
        {t('images')} ({totalImages}/{maxImages})
      </label>

      {/* Drop zone — fixed height matching thumbnail */}
      {canAdd && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative rounded-xl border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center transition-colors
            aspect-square max-h-[140px]
            ${isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary text-muted-foreground hover:text-primary'
            }
          `}
        >
          <ImagePlus className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium text-center px-2">
            {isDragging ? t('dropImages' as any) || 'Отпустите для загрузки' : t('dragOrClick' as any) || 'Перетащите фото сюда или нажмите'}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {t('maxImages' as any) || `Максимум ${maxImages} фото`}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Thumbnails below the drop zone */}
      {totalImages > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-3">
          {existingImages.map((img, index) => (
            <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(index)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {newImagePreviews.map((img, index) => (
            <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveNew(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
