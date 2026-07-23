import constants from "../common/constants";
// Image utility functions for handling backend image URLs

/**
 * Converts a Firebase storage URL or image path to a backend URL
 * @param {string} imagePath - Firebase storage URL or image path
 * @returns {string} Backend image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '';
  }

  // If it's already a backend URL, return as is
  if (imagePath.startsWith(constants.API.HOST)) {
    return imagePath;
  }

  // If it's a Firebase storage URL, extract the filename
  let filename = '';
  if (imagePath.includes('gs://') || imagePath.includes('firebase')) {
    // Extract filename from Firebase URL
    const match = imagePath.match(/([^\/]+)(?:\?|$)/);
    if (match) {
      filename = match[1];
    }
  } else {
    // Assume it's already a clean filename or path
    filename = imagePath.replace(/^\/+/, ''); // Remove leading slashes
    
    // Strip /images prefix if it exists
    if (filename.startsWith('images/')) {
      filename = filename.substring('images/'.length);
    }
  }

  // Construct backend URL
  const finalUrl = `${constants.API.HOST}/images/${filename}`;
  console.log('🔗 DOORWORLD_FINAL_URL:', finalUrl);
  return finalUrl;
};

/**
 * Batch process multiple image paths
 * @param {Array<{id: string, image?: string}>} items - Array of items with optional image property
 * @returns {Promise<Array>} Promise that resolves to items with updated image URLs
 */
export const processImageUrls = (items) => {
  return Promise.all(
    items.map(async (item) => {
      if (item.image) {
        const imageUrl = await getImageUrl(item.image);
        return { ...item, image: imageUrl };
      }
      return item;
    })
  );
};