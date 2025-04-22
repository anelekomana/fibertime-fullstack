"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  AppContextType,
  AppState,
  Bundle,
  PairingCode,
  User,
} from "../types/app";
import {
  APP_DATA_KEY,
  clearAppData,
  getStoredAppData,
  storeAppData,
} from "../utils/storage";

const defaultAppState: AppState = {
  user: null,
  accessToken: null,
  pairingCode: null,
  deviceStatus: null,
  bundleInfo: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppState] = useState<AppState>(defaultAppState);

  useEffect(() => {
    const stored = getStoredAppData();
    if (stored) {
      setAppState(stored);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === APP_DATA_KEY) {
        const newData = e.newValue ? JSON.parse(e.newValue) : null;
        setAppState(newData || defaultAppState);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateState = (newState: Partial<AppState>) => {
    setAppState((prev) => {
      const updatedState = { ...prev, ...newState };
      storeAppData(updatedState);
      return updatedState;
    });
  };

  const login = (userData: User, token: string) => {
    updateState({
      user: userData,
      accessToken: token,
      pairingCode: null,
      deviceStatus: null,
      bundleInfo: null,
    });
  };

  const logout = () => {
    clearAppData();
    setAppState(defaultAppState);
  };

  const setPairingCode = (code: PairingCode) => {
    updateState({ pairingCode: code });
  };

  const setDeviceStatus = (status: string) => {
    updateState({ deviceStatus: status });
  };

  const setBundleInfo = (bundle: Bundle) => {
    updateState({ bundleInfo: bundle });
  };

  const contextValue: AppContextType = {
    ...appState,
    login,
    logout,
    setPairingCode,
    setDeviceStatus,
    setBundleInfo,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
