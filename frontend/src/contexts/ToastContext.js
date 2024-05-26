import { createContext } from 'react';
import { toast } from 'react-toastify';

export const ToastContext = createContext();

export const ToastProvider= ({ children }) => {
  const showToast = (message, type) => {
    toast[type](message);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};