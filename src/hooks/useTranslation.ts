import { useI18n } from "./useI18n";

/**
 * Simple hook to access translations.
 * Usage: const t = useTranslation();
 * Then use t.app.selectImage, t.drawingView.goBack, etc.
 */
export const useTranslation = () => {
  const { t } = useI18n();
  return t;
};
