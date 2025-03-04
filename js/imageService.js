const PEXELS_API_KEY = 'GlaiNGMML3sIHbrjjNZ3CKxq6yeiKI5eFWOfWARjIdTijJAWyV3ZAyJM';

// Obtenir une image de restaurant aléatoire
export async function getRandomRestaurantImage(query = 'restaurant paris') {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=15`, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.photos.length);
      return {
        url: data.photos[randomIndex].src.large,
        photographer: data.photos[randomIndex].photographer,
        photographerUrl: data.photos[randomIndex].photographer_url
      };
    }
    
    throw new Error('No images found');
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
}

// Obtenir plusieurs images pour une galerie
export async function getGalleryImages(query, count = 3) {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=${count}`, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      return data.photos.map(photo => ({
        url: photo.src.large,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url
      }));
    }
    
    throw new Error('No gallery images found');
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}
