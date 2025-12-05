import { useState } from "react";
import type { ChangeEvent } from "react";
import DrawingView from "./components/drawing-view";

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a temporary URL for the selected file
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleBack = () => {
    // Revoke the URL to free up memory when going back
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
  };

  // View 1: If an image is selected, show the drawing view
  if (selectedImage) {
    return <DrawingView imageUrl={selectedImage} onBack={handleBack} />;
  }

  // View 0: Initial State - Image Selection Screen
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform active:scale-95">
        <span>Select Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
      <p className="mt-4 text-sm text-gray-400">
        Gets camera access on next screen.
      </p>
    </div>
  );
}

export default App;
