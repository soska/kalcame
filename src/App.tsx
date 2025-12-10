import { useEffect, useRef, useState } from "react";
import DrawingView from "./components/drawing-view";
import ImageSelector from "./components/image-selector";
import LanguageSwitcher from "./components/language-switcher";
import { useTranslation } from "./hooks/useTranslation";
import { Dialog } from "./components/dialog";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col bg-gray-800">
      <header className="flex flex-row bg-gray-900">
        <h1 className="text-white text-2xl font-bold">Kalcame</h1>
        <LanguageSwitcher />
      </header>
      {children}
    </div>
  );
}

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const streamRef = useRef<MediaStream | null>(null);
  const t = useTranslation();

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request camera access, preferring the rear camera on mobile
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError("");
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError(t.cameraError);
      }
    };

    startCamera();

    // Cleanup function to stop the camera stream when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleBack = () => {
    // Revoke the URL to free up memory when going back
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
  };

  return (
    <AppLayout>
      <div className="relative h-full w-full bg-black overflow-hidden flex-1">
        {/* Camera Feed - Always visible */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute w-full h-full object-cover z-10 w-[calc(100vh - 48px)] h-[calc(100vh - 48px)]"
        />

        <Dialog open={true} onClose={() => {}}>
          <div>
            <h2>Dialog Title</h2>
            <p>Dialog Message</p>
          </div>
        </Dialog>

        {/* Error Message */}
        {cameraError && (
          <div className="absolute top-10 left-0 w-full text-center text-red-500 z-50 px-4">
            {cameraError}
          </div>
        )}

        {/* Image Selector Overlay - Shown when no image is selected */}
        {!selectedImage && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
            <ImageSelector onImageSelect={handleImageSelect} />
          </div>
        )}

        {/* Drawing View Overlay - Shown when image is selected */}
        {selectedImage && (
          <DrawingView imageUrl={selectedImage} onBack={handleBack} />
        )}
      </div>
    </AppLayout>
  );
}

export default App;
