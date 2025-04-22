"use client";

import { Routes, Route } from "react-router-dom";
import PhoneNumberStep from "./components/PhoneNumberStep";
import TVScreen from "./components/TVScreen";
import OTPVerificationStep from "./components/OTPVerificationStep";
import PairingCodeStep from "./components/PairingCodeStep";
import ConnectionStep from "./components/ConnectionStep";
import NotFound from "./app/not-found";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PhoneNumberStep />} />
      <Route path="/tv" element={<TVScreen />} />
      <Route path="/verify-otp" element={<OTPVerificationStep />} />
      <Route path="/pair-device" element={<PairingCodeStep />} />
      <Route path="/connection" element={<ConnectionStep />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
