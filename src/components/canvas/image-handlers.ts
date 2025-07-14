import { showToast } from '@/lib/utils';

export async function compressImage(file: File, maxSize = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function handleImageUpload(
  file: File,
  onSuccess: (dataUrl: string) => void,
  onError?: (error: string) => void
) {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    const error = 'Please select a valid image file';
    showToast(error, 'error');
    onError?.(error);
    return;
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    const error = 'Image size must be less than 5MB';
    showToast(error, 'error');
    onError?.(error);
    return;
  }

  // Compress and process image
  compressImage(file)
    .then(dataUrl => {
      onSuccess(dataUrl);
      showToast('Image uploaded successfully', 'success');
    })
    .catch(() => {
      const errorMessage = 'Failed to process image';
      showToast(errorMessage, 'error');
      onError?.(errorMessage);
    });
} 