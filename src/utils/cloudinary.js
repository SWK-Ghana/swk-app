/**
 * SWK Ghana - Cloudinary Image Optimizer
 * Automatically optimizes all images for mobile and desktop
 */

export const optimizeImage = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  const {
    width = 'auto',
    quality = 'auto',
    format = 'auto',
  } = options;

  // Insert transformation parameters into the Cloudinary URL
  return url.replace(
    '/upload/',
    `/upload/f_${format},q_${quality},w_${width},dpr_auto/`
  );
};

/**
 * Preset sizes for common use cases
 */
export const imagePresets = {
  hero: (url) => optimizeImage(url, { width: 1280, quality: 'auto', format: 'auto' }),
  card: (url) => optimizeImage(url, { width: 600, quality: 'auto', format: 'auto' }),
  thumbnail: (url) => optimizeImage(url, { width: 300, quality: 'auto', format: 'auto' }),
  logo: (url) => optimizeImage(url, { width: 200, quality: 'auto', format: 'auto' }),
};