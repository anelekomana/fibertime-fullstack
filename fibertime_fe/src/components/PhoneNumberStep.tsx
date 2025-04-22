"use client";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { requestOTP } from "../services/api";
import styles from "../styles/PhoneNumberStep.module.css";

export default function PhoneNumberStep() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        fibertime
        <span style={{ fontSize: "0.6rem", verticalAlign: "super" }}>™</span>
      </div>
      <div className={styles.card}>
        <div className={styles.heading}>Log in to connect to WiFi</div>
        <div className={styles.subheading}>Enter your phone number below:</div>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            if (!phoneNumber || phoneNumber.length < 10) {
              setError("Please enter a valid phone number");
              return;
            }
            setIsLoading(true);
            try {
              const response = await requestOTP(phoneNumber);
              navigate("/verify-otp", {
                state: { phoneNumber, otp: response.otp },
              });
            } catch (err) {
              setError("Failed to send OTP. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <div className={styles.inputRow}>
            <button type="button" className={styles.flagSelect} tabIndex={-1}>
              {/* For now we are using a hardcoded image for a SA flag, in a real application we would use a phone number input component */}
              <img
                src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/za.svg"
                alt="ZA"
                className={styles.flagIcon}
              />
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            <input
              className={styles.input}
              type="tel"
              placeholder="082 345 6789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={12}
            />
          </div>
          <button className={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Next"}
          </button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
