export async function compressImage(
  file: File,
  maxSize = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;
      let newWidth = width;
      let newHeight = height;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxSize) {
          newWidth = maxSize;
          newHeight = (height * maxSize) / width;
        }
      } else {
        if (height > maxSize) {
          newHeight = maxSize;
          newWidth = (width * maxSize) / height;
        }
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      if (ctx) {
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export const validateImageFile = (file: File): string | null => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, GIF, or WebP)';
  }

  if (file.size > maxSize) {
    return 'Image file size must be less than 5MB';
  }

  return null;
};
