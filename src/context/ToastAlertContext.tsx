import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastAlert = {
  id: string;
  message: string;
};

interface ToastAlertContextType {
  toastAlerts: ToastAlert[];
  addToastAlert: (message: string) => void;
  removeToastAlert: (id: string) => void;
}

const ToastAlertContext = createContext<ToastAlertContextType | undefined>(undefined);

export const useToastAlert = (): ToastAlertContextType => {
  const context = useContext(ToastAlertContext);
  if (!context) throw new Error('useToastAlert must be used within a ToastAlertProvider');
  return context;
};

interface ToastAlertProviderProps {
  children: ReactNode;
}

export const ToastAlertProvider: React.FC<ToastAlertProviderProps> = ({ children }) => {
  const [toastAlerts, setToastAlerts] = useState<ToastAlert[]>([]);

  const addToastAlert = useCallback((message: string) => {
    const id = crypto.randomUUID();
    setToastAlerts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToastAlerts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToastAlert = useCallback((id: string) => {
    setToastAlerts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastAlertContext.Provider value={{ toastAlerts, addToastAlert, removeToastAlert }}>
      {children}
    </ToastAlertContext.Provider>
  );
};