import { useRef, lazy, Suspense } from "react";
import type { GalleryItem, ImageGalleryRef } from "react-image-gallery";

// Dynamic import untuk menghindari Vite optimization issue
const ImageGallery = lazy(() => import("react-image-gallery"));
import "react-image-gallery/styles/image-gallery.css";

export default function SingleGalleryPreview({ images }: { images: GalleryItem[] }) {
  const galleryRef = useRef<ImageGalleryRef>(null);

  // Default images jika tidak ada data
  const defaultImages: GalleryItem[] = [
    {
      original: "/images/placeholder.png",
      thumbnail: "/images/placeholder.png",
    },
  ];

  // Gunakan images dari props atau default jika tidak ada
  const galleryImages = images && images.length > 0 ? images : defaultImages;

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96">Loading images...</div>}>
      <ImageGallery
        ref={galleryRef}
        items={galleryImages}
        onSlide={(index) => console.log("Slid to", index)}
        showNav={false}
        />
    </Suspense>
  );
}   