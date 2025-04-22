"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/TVScreen.module.css";
import { useApp } from "../context/AppContext";
import { createDeviceCode } from "../services/api";
import { getDeviceMacAddress } from "../utils/storage";

export default function TVScreen() {
  const { user, accessToken, pairingCode, setPairingCode } = useApp();
  const [error, setError] = useState("");

  const generatePairingCode = async () => {
    setError("");
    if (!user?.id || !accessToken) {
      setError("Please log in to generate a pairing code");
      return;
    }
    if (pairingCode) {
      const now = new Date();
      const expiresAt = new Date(pairingCode.expiresAt);
      if (now < expiresAt) return;
    }
    try {
      const macAddress = getDeviceMacAddress();
      const response = await createDeviceCode(accessToken, user.id, macAddress);
      setPairingCode(response);
    } catch (err) {
      setError("Failed to generate pairing code. Please try again.");
    }
  };

  useEffect(() => {
    generatePairingCode();
  }, [user, accessToken]);

  // interval to check expiration every minute
  useEffect(() => {
    if (!pairingCode) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const expiresAt = new Date(pairingCode.expiresAt);
      if (now >= expiresAt) {
        generatePairingCode();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [pairingCode, user, accessToken]);

  const displayCode = pairingCode?.code || "----";

  return (
    <div className={styles.container}>
      <div className={styles.centerBox}>
        <div className={styles.logo}>
          fibertime
          <span style={{ fontSize: "0.6rem", verticalAlign: "super" }}>™</span>
        </div>
        <div className={styles.instructions}>
          On your phone go to <span className={styles.bold}>fibertime.tv</span>
          <br />
          and enter this code
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.codeRow}>
          {displayCode.split("").map((char, index) => (
            <div className={styles.codeBox} key={index}>
              {char}
            </div>
          ))}
        </div>
        <div className={styles.help}>
          For help WhatsApp{" "}
          <span className={styles.whatsapp}>078 886 1090</span>
        </div>
      </div>
    </div>
  );
}
