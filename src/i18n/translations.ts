export type Language = "en" | "es" | "fr" | "de";

// English is the source of truth - all keys should be defined here
export const translations: Record<Language, Record<string, string>> = {
  en: {
    selectImage: "Select Image",
    cameraAccessNote: "Gets camera access on next screen.",
    goBack: "Go Back",
    changeImage: "Change Image",
    cameraError:
      "Could not access the camera. Please ensure permissions are granted.",
  },
  es: {
    selectImage: "Seleccionar Imagen",
    cameraAccessNote: "Obtiene acceso a la cámara en la siguiente pantalla.",
    goBack: "Volver",
    changeImage: "Cambiar Imagen",
    cameraError:
      "No se pudo acceder a la cámara. Por favor, asegúrese de que se hayan otorgado los permisos.",
  },
  fr: {
    selectImage: "Sélectionner une Image",
    cameraAccessNote: "Obtient l'accès à la caméra sur l'écran suivant.",
    goBack: "Retour",
    changeImage: "Changer l'Image",
    cameraError:
      "Impossible d'accéder à la caméra. Veuillez vous assurer que les permissions sont accordées.",
  },
  de: {
    selectImage: "Bild Auswählen",
    cameraAccessNote: "Erhält Kamerazugriff auf dem nächsten Bildschirm.",
    goBack: "Zurück",
    changeImage: "Bild Ändern",
    cameraError:
      "Kamera konnte nicht zugegriffen werden. Bitte stellen Sie sicher, dass die Berechtigungen erteilt wurden.",
  },
};
