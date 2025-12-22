// src/utils/notification.js

import Swal from 'sweetalert2';

/**
 * Reusable notification utility using SweetAlert2
 */

// Base configuration for all toasts
const baseToastConfig = {
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  toast: true,
  timerProgressBar: true,
};

// Theme configurations
const themes = {
  success: {
    icon: "success",
    background: "#d4edda",
    color: "#155724",
  },
  error: {
    icon: "error",
    background: "#f8d7da",
    color: "#721c24",
  },
  warning: {
    icon: "warning",
    background: "#fff3cd",
    color: "#856404",
  },
  info: {
    icon: "info",
    background: "#d1ecf1",
    color: "#0c5460",
  },
};

/**
 * Show a toast notification
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} title - Main message
 * @param {string} text - Optional subtitle
 * @param {number} timer - Duration in ms (default: 2000)
 */
export const showToast = (type, title, text = '', timer = 2000) => {
  Swal.fire({
    ...baseToastConfig,
    ...themes[type],
    title,
    text,
    timer,
  });
};

/**
 * Success notification
 */
export const notifySuccess = (title, text = '', timer = 2000) => {
  showToast('success', title, text, timer);
};

/**
 * Error notification
 */
export const notifyError = (title, text = '', timer = 3000) => {
  showToast('error', title, text, timer);
};

/**
 * Warning notification
 */
export const notifyWarning = (title, text = '', timer = 2500) => {
  showToast('warning', title, text, timer);
};

/**
 * Info notification
 */
export const notifyInfo = (title, text = '', timer = 2000) => {
  showToast('info', title, text, timer);
};

/**
 * Confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} text - Dialog text
 * @param {string} confirmButtonText - Confirm button text
 * @param {string} cancelButtonText - Cancel button text
 * @returns {Promise<boolean>} - true if confirmed, false if cancelled
 */
export const confirmDialog = async (
  title = 'Are you sure?',
  text = '',
  confirmButtonText = 'Yes, delete it!',
  cancelButtonText = 'Cancel'
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};

/**
 * Loading notification
 * @param {string} title - Loading message
 */
export const showLoading = (title = 'Please wait...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/**
 * Close any active notification
 */
export const closeNotification = () => {
  Swal.close();
};

// Export default object with all methods
export default {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
  confirm: confirmDialog,
  loading: showLoading,
  close: closeNotification,
  toast: showToast,
};