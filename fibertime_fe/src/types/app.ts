export interface User {
  id: string;
  phoneNumber: string;
  createdAt: string;
  role: string;
}

export interface Bundle {
  id: string;
  name: string;
  expirationDate: string;
}

export interface PairingCode {
  id: string;
  code: string;
  expiresAt: string;
  status: string;
  createdAt: string;
}

export interface AppState {
  user: User | null;
  accessToken: string | null;
  pairingCode: PairingCode | null;
  deviceStatus: string | null;
  bundleInfo: Bundle | null;
}

export interface AppContextType extends AppState {
  login: (userData: User, token: string) => void;
  logout: () => void;
  setPairingCode: (paringCodeData: PairingCode) => void;
  setDeviceStatus: (status: string) => void;
  setBundleInfo: (bundle: Bundle) => void;
}
