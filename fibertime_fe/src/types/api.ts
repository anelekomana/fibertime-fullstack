export interface OTPResponse {
  phoneNumber: string;
  otp: string;
  expiresAt: string;
  id: string;
  createdAt: string;
  status: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    phoneNumber: string;
    createdAt: string;
    role: string;
  };
}

export interface DeviceCodeResponse {
  id: string;
  code: string;
  expiresAt: string;
  status: string;
  createdAt: string;
}

export interface DeviceStatusResponse {
  id: string;
  macAddress: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    phoneNumber: string;
    createdAt: string;
    role: string;
  };
  bundle: {
    id: string;
    name: string;
    expirationDate: string;
  };
  pairingCode: {
    id: string;
    code: string;
    status: string;
    expiresAt: string;
    createdAt: string;
  };
}
