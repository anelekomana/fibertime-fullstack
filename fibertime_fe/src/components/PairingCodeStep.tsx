"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { connectDevice } from "../services/api";
import styles from "../styles/PairingCodeStep.module.css";

export default function PairingCodeStep() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useApp();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, event) => {
    const value = event.target.value;

    const newCode = [...code];
    newCode[index] = value.charAt(value.length - 1);
    setCode(newCode);

    if (index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const combinedCode = code.join("");

    if (!combinedCode || combinedCode.length !== 4) {
      setError("Please enter a valid 4-character code");
      return;
    }

    setIsLoading(true);
    try {
      await connectDevice(accessToken, combinedCode);
      navigate("/connection");
    } catch (err) {
      setError(
        "Failed to connect device. Please check the code and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Enter the four digit code on the TV or device screen
        </h1>
        <div className={styles.codeInputs}>
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className={styles.codeInput}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[index] = el;
              }}
            />
          ))}
        </div>
        <p className={styles.helpText}>Help, I can't find my code</p>
        <button
          className={styles.connectButton}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Connecting..." : "Connect"}
        </button>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
