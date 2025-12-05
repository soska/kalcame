import React, { useEffect, useRef, useState } from "react";

interface DrawingViewProps {
  imageUrl: string;
  onBack: () => void;
}

const DrawingView: React.FC<DrawingViewProps> = ({ imageUrl, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState<number>(0.5);
  const [error, setError] = useState<string>("");
  const streamRef = useRef<MediaStream | null>(null);

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
        setError("");
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(
          "Could not access the camera. Please ensure permissions are granted."
        );
      }
    };

    startCamera();

    // Cleanup function to stop the camera stream when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Error Message */}
      {error && (
        <div className="absolute top-10 left-0 w-full text-center text-red-500 z-50 px-4">
          {error}
          <button
            onClick={onBack}
            className="block mx-auto mt-4 bg-white text-black px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Layer 1: The Camera Feed (Video) */}
      {/* object-cover ensures the video fills the screen without distortion */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-10"
      />

      {/* Layer 2: The Reference Image Overlay */}
      {/* pointer-events-none is CRUCIAL so touches pass through to the slider/underlying elements */}
      <img
        src={imageUrl}
        alt="Reference"
        className="absolute top-0 left-0 w-full h-full object-contain z-20 pointer-events-none transition-opacity duration-150 ease-linear"
        style={{ opacity: opacity }}
      />

      {/* Layer 3: UI Controls (Slider and Back button) */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent z-30 flex flex-col gap-4">
        {/* Opacity Slider Container mimicking the mockup look */}
        <div className="flex items-center justify-center w-full bg-white/20 rounded-full p-1 border border-white/30 backdrop-blur-sm">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full h-8 accent-white cursor-pointer"
            style={{
              // Custom styling to make the slider track look a bit more like the mockup
              background: `linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ${
                opacity * 100
              }%, rgba(255,255,255,0.2) ${
                opacity * 100
              }%, rgba(255,255,255,0.2) 100%)`,
              appearance: "none", // Standard reset for custom styling
              borderRadius: "9999px",
              height: "12px",
            }}
          />
        </div>

        <button
          onClick={onBack}
          className="text-white text-sm underline self-center opacity-80 hover:opacity-100"
        >
          Change Image
        </button>
      </div>
    </div>
  );
};

export default DrawingView;
