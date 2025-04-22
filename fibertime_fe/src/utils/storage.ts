import { AppState } from "../types/app";

export const APP_DATA_KEY = "authData";

export const getStoredAppData = (): AppState | null => {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(APP_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

export const storeAppData = (data: AppState): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
};

export const clearAppData = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(APP_DATA_KEY);
};

export const getDeviceMacAddress = (): string | null => {
  if (typeof window === "undefined") return null;

  let macAddress = localStorage.getItem("macAddress");
  if (macAddress) return macAddress;

  // For demo purposes we have to mock the MAC address
  const generateMacAddress = (): string => {
    return Array.from({ length: 6 })
      .map(() =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0")
          .toUpperCase()
      )
      .join("-");
  };

  macAddress = generateMacAddress();
  localStorage.setItem("macAddress", macAddress);

  return macAddress;
};
