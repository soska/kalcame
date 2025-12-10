import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { DialogContext, type DialogConfig } from "./dialog-context";

import "./dialog.css";

// ============================================
// 1. Basic Dialog Component
// ============================================

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Where to return focus on close. If not provided, focus returns to previously focused element */
  returnFocusRef?: React.RefObject<HTMLElement>;
  /** Use alertdialog role for system-initiated dialogs requiring acknowledgment */
  role?: "dialog" | "alertdialog";
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export function Dialog({
  open,
  onClose,
  children,
  returnFocusRef,
  role = "dialog",
  ...ariaProps
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      // Store currently focused element before opening
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else {
      dialog.close();
      // Return focus on close
      const returnTarget = returnFocusRef?.current ?? previousFocusRef.current;
      returnTarget?.focus();
    }
  }, [open, returnFocusRef]);

  // Handle native dialog close (Escape key, etc.)
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle backdrop click
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleClick}
      role={role}
      className="dialog"
      {...ariaProps}
    >
      <div className="bg-white p-4 rounded-lg">{children}</div>
    </dialog>
  );
}

// ============================================
// 2. Programmatic Dialog Context (optional)
// ============================================

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    config: DialogConfig | null;
    resolve?: (value: boolean) => void;
  }>({ open: false, config: null });

  const alert = useCallback(
    (config: Omit<DialogConfig, "cancelLabel" | "onCancel">) => {
      setDialogState({
        open: true,
        config: { ...config, cancelLabel: undefined },
      });
    },
    []
  );

  const confirm = useCallback((config: DialogConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        open: true,
        config,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(
    (confirmed: boolean) => {
      dialogState.resolve?.(confirmed);
      if (confirmed) {
        dialogState.config?.onConfirm?.();
      } else {
        dialogState.config?.onCancel?.();
      }
      setDialogState({ open: false, config: null });
    },
    [dialogState]
  );

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}

      <Dialog
        open={dialogState.open}
        onClose={() => handleClose(false)}
        role="alertdialog"
        aria-labelledby="programmatic-dialog-title"
        aria-describedby="programmatic-dialog-desc"
      >
        {dialogState.config && (
          <div>
            <h2 id="programmatic-dialog-title">{dialogState.config.title}</h2>
            <p id="programmatic-dialog-desc">{dialogState.config.message}</p>
            <div>
              {dialogState.config.cancelLabel && (
                <button type="button" onClick={() => handleClose(false)}>
                  {dialogState.config.cancelLabel}
                </button>
              )}
              <button type="button" onClick={() => handleClose(true)}>
                {dialogState.config.confirmLabel ?? "OK"}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
}

// // ============================================
// // 3. Usage Examples
// // ============================================

// // Example A: Direct usage of Dialog component
// function DirectUsageExample() {
//   const [showTimeout, setShowTimeout] = useState(false);

//   useEffect(() => {
//     // Simulate a session timeout after 5 seconds
//     const timer = setTimeout(() => {
//       setShowTimeout(true);
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <Dialog
//       open={showTimeout}
//       onClose={() => setShowTimeout(false)}
//       role="alertdialog"
//       aria-labelledby="timeout-title"
//       aria-describedby="timeout-desc"
//     >
//       <h2 id="timeout-title">Session Expiring</h2>
//       <p id="timeout-desc">
//         Your session will expire in 1 minute. Would you like to continue?
//       </p>
//       <button onClick={() => setShowTimeout(false)}>Continue Session</button>
//     </Dialog>
//   );
// }

// // Example B: Using the context/hook pattern
// function GameLobby() {
//   const { alert, confirm } = useDialog();

//   async function handleLeaveGame() {
//     const confirmed = await confirm({
//       title: "Leave Game?",
//       message: "You will lose your progress if you leave now.",
//       confirmLabel: "Leave",
//       cancelLabel: "Stay",
//     });

//     if (confirmed) {
//       // navigate away
//     }
//   }

//   // Can be called from anywhere, e.g., a WebSocket event
//   function onGameStarting(seconds: number) {
//     alert({
//       title: "Game Starting!",
//       message: `The game will begin in ${seconds} seconds.`,
//       confirmLabel: "Ready!",
//     });
//   }

//   return (
//     <div>
//       <button onClick={handleLeaveGame}>Leave Game</button>
//       {/* Simulate game starting */}
//       <button onClick={() => onGameStarting(10)}>Simulate Game Start</button>
//     </div>
//   );
// }

// // Example C: App setup with provider
// function App() {
//   return (
//     <DialogProvider>
//       <GameLobby />
//     </DialogProvider>
//   );
// }
