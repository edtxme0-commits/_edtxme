import API_URL from '../apiConfig';

export const getImageUrl = (url: string | undefined | null) => {
  if (!url) return '';
  
  // Fix for legacy placeholder images stored in the database
  if (url.includes('via.placeholder.com')) {
    return 'https://ui-avatars.com/api/?name=User&background=random';
  }
  
  // If it's already a proxy URL
  if (url.startsWith('/api/images/proxy')) {
    return `${API_URL}${url}`;
  }
  
  // Extract Google Drive ID from various formats
  let id = null;
  
  // Format: uc?export=view&id=XXX or thumbnail?id=XXX
  const matchDrive = url.match(/id=([^&]+)/);
  if (matchDrive) id = matchDrive[1];
  
  // Format: lh3.googleusercontent.com/d/XXX
  if (!id) {
    const matchLh3 = url.match(/lh3\.googleusercontent\.com\/d\/([^\/]+)/);
    if (matchLh3) id = matchLh3[1];
  }

  // Format: file/d/XXX/view
  if (!id) {
    const matchFile = url.match(/file\/d\/([^\/]+)/);
    if (matchFile) id = matchFile[1];
  }
  
  if (id) {
    return `${API_URL}/api/images/proxy/${id}`;
  }
  
  return url;
};

export const getVideoUrl = (url: string | undefined | null) => {
  if (!url) return '';
  
  if (url.startsWith('/api/images/proxy')) {
    return `${API_URL}${url}`;
  }
  
  let id = null;
  const matchDrive = url.match(/id=([^&]+)/);
  if (matchDrive) id = matchDrive[1];
  
  if (!id) {
    const matchFile = url.match(/file\/d\/([^\/]+)/);
    if (matchFile) id = matchFile[1];
  }
  
  if (id) {
    return `${API_URL}/api/images/proxy/${id}`;
  }
  
  return url;
};
