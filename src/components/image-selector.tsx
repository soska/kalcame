import type { ChangeEvent } from "react";
import { useTranslation } from "../hooks/useTranslation";
// import LanguageSwitcher from "./language-switcher";

interface ImageSelectorProps {
  onImageSelect: (imageUrl: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelect }) => {
  const t = useTranslation();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a temporary URL for the selected file
      const imageUrl = URL.createObjectURL(file);
      onImageSelect(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-2 border-black/80 font-bold py-4 px-8 rounded-full shadow-lg transition-transform active:scale-95">
        <span>{t.selectImage}</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ImageSelector;
