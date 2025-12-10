import { useContext } from "react";
import { DialogContext } from "../components/dialog-context";

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

