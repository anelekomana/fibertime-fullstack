import {
  OTPResponse,
  LoginResponse,
  DeviceCodeResponse,
  DeviceStatusResponse,
} from "../types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const requestOTP = async (phoneNumber: string): Promise<OTPResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/request-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber }),
  });
  return response.json();
};

export const login = async (
  phoneNumber: string,
  otp: string
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber, otp }),
  });
  return response.json();
};

export const createDeviceCode = async (
  accessToken: string,
  userId: string,
  macAddress: string
): Promise<DeviceCodeResponse> => {
  const response = await fetch(`${BASE_URL}/api/device/create-device-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ userId, macAddress }),
  });
  return response.json();
};

export const connectDevice = async (
  accessToken: string,
  deviceCode: string
): Promise<{ status: string }> => {
  const response = await fetch(`${BASE_URL}/api/device/connect-device`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ deviceCode }),
  });
  return response.json();
};

export const getDeviceStatus = async (
  accessToken: string,
  deviceCode: string
): Promise<DeviceStatusResponse> => {
  const response = await fetch(`${BASE_URL}/api/device?code=${deviceCode}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};
