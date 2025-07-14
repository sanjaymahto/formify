import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Toast notification utility
export const showToast = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning'
) => {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm font-medium transition-all duration-300 transform translate-x-full shadow-lg max-w-sm ${
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
        ? 'bg-red-500'
        : type === 'warning'
          ? 'bg-yellow-500'
          : 'bg-blue-500'
  }`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 4000);
};

// Confirmation dialog utility
export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise(resolve => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4';

    // Create dialog
    const dialog = document.createElement('div');
    dialog.className =
      'bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl';

    dialog.innerHTML = `
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirm Action</h3>
        <p class="text-gray-600 dark:text-gray-300">${message}</p>
      </div>
      <div class="flex justify-end space-x-3">
        <button id="cancel-btn" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          Cancel
        </button>
        <button id="confirm-btn" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors">
          Confirm
        </button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Handle button clicks
    const handleConfirm = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };

    const handleCancel = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };

    dialog
      .querySelector('#confirm-btn')
      ?.addEventListener('click', handleConfirm);
    dialog
      .querySelector('#cancel-btn')
      ?.addEventListener('click', handleCancel);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        handleCancel();
      }
    });
  });
};
