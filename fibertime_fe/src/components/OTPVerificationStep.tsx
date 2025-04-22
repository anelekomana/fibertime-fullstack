"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { login } from "../services/api";
import { useApp } from "../context/AppContext";
import styles from "../styles/OTPVerificationStep.module.css";

export default function OTPVerificationStep() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login: authLogin } = useApp();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const phoneNumber = location.state?.phoneNumber || "";
  const navOtp = location.state?.otp || "";
  const inputRefs = useRef([] as (HTMLInputElement | null)[]);

  useEffect(() => {
    // Focus on the first input when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, ""); // only digits
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val.charAt(val.length - 1); // last digit only
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const combinedOtp = otp.join("");
    if (!combinedOtp || combinedOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      const response = await login(phoneNumber, combinedOtp);
      if (!response.accessToken || !response.user) {
        setError("Invalid or expired OTP.");
        return;
      }
      authLogin(response.user, response.accessToken);
      navigate("/pair-device");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.otpCard}>
        <div className={styles.otpHeading}>Log in to connect to WiFi</div>
        <div className={styles.otpSubheading}>
          Enter your 6-digit code below: ({navOtp})
        </div>
        <form className={styles.otpForm} onSubmit={handleSubmit}>
          <div className={styles.otpInputRow}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className={styles.otpInput}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current[index] = el;
                }}
              />
            ))}
          </div>
          <button
            className={styles.otpButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Next"}
          </button>
          {error && <div className={styles.otpError}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
