import { createContext } from "react";

export interface DialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface DialogContextValue {
  alert: (config: Omit<DialogConfig, "cancelLabel" | "onCancel">) => void;
  confirm: (config: DialogConfig) => Promise<boolean>;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

