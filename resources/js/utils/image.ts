import PlaceholderImage from '@/assets/images/placeholder.png';   
/**
 * Handles image loading errors and provides a fallback image
 * @param {Event} e - The error event from the image element
 * @param {string} fallbackImage - The URL of the fallback image
 * @param {string} altText - Alt text for the image
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackImage: string = PlaceholderImage,
  altText: string = 'Alumoda Sinergi Kontainer Indonesia'
) => {
  const target = e.target as HTMLImageElement;
  
  // If the image is already the fallback, don't try to set it again
  if (target.src === fallbackImage) return;
  
  // Store the original source for potential retries
  const originalSrc = target.dataset.originalSrc || target.src;
  target.dataset.originalSrc = originalSrc;
  
  // Set the fallback image
  target.src = fallbackImage;
  target.alt = altText + ' (default)';
  
  // Optional: Implement retry logic (commented out by default)
  // const retryCount = parseInt(target.dataset.retryCount || '0');
  // if (retryCount < 3) {
  //   setTimeout(() => {
  //     target.src = originalSrc;
  //     target.dataset.retryCount = (retryCount + 1).toString();
  //   }, 1000 * (retryCount + 1));
  // }
};

/**
 * Creates a preload link for critical images
 * @param {string} imageUrl - The URL of the image to preload
 */
export const preloadImage = (imageUrl: string) => {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = imageUrl;
  
  // Add to the document head
  document.head.appendChild(link);
};
