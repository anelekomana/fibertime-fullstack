"use client";

import React, { useState, useEffect, useRef } from "react";

import { getDeviceStatus } from "../services/api";
import styles from "../styles/ConnectionStep.module.css";
import { useApp } from "../context/AppContext";

export default function ConnectionStep() {
  const [connectionState, setConnectionState] = useState<
    "connecting" | "connected"
  >("connecting");
  const {
    pairingCode,
    accessToken,
    setDeviceStatus,
    setBundleInfo,
    bundleInfo,
  } = useApp();

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectedRef = useRef(false);
  const [deviceMacAddress, setDeviceMacAddress] = useState("00-00-00-00-00-00");

  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (isConnectedRef.current) return;

      const response = await getDeviceStatus(accessToken, pairingCode.code);
      if (response.status === "connected") {
        isConnectedRef.current = true;
        setConnectionState("connected");
        setDeviceStatus(response.status);
        setBundleInfo(response.bundle);
        setDeviceMacAddress(response.macAddress);

        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      }
    };

    // Start polling
    intervalIdRef.current = setInterval(checkConnectionStatus, 5000);
    checkConnectionStatus();

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [
    accessToken,
    pairingCode,
    setConnectionState,
    setDeviceStatus,
    setBundleInfo,
  ]);

  // Get expiration date
  const expirationDate = bundleInfo?.expirationDate
    ? new Date(bundleInfo.expirationDate)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

  // Calculate difference between now and expiration date
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  // Calculate timeline progress
  const TOTAL_DAYS = 30;
  const elapsedDays = TOTAL_DAYS - diffDays;
  const progressPercent = Math.max(
    0,
    Math.min(100, (elapsedDays / TOTAL_DAYS) * 100)
  );

  const formattedDate = expirationDate
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {connectionState === "connecting" ? "Connecting..." : "Connected!"}
      </div>

      <div className={styles.iconRow}>
        <div className={styles.tvIcon}></div>
        {connectionState === "connecting" ? (
          <>
            <span className={styles.connectingDots}></span>
            <div className={styles.wifiIcon}></div>
            <span className={styles.connectingDots}></span>
          </>
        ) : (
          <>
            <span className={styles.connectedDots}></span>
            <div className={styles.wifiIcon}></div>
            <span className={styles.connectedDots}></span>
          </>
        )}
        <div className={styles.globeIcon}></div>
      </div>

      <div className={styles.yellowCard}>
        <div className={styles.wifiTvBundle}>
          <div className={styles.wifiLogo}></div>
          <span className={styles.daysText}>1</span>
          <div className={styles.tvLogoSmall}></div>
          <span className={styles.daysText}>30 Days</span>
        </div>

        <div className={styles.deviceSection}>
          <div className={styles.deviceRow}>
            <div className={styles.tvLogoSmall}></div>
            <span className={styles.stylesdeviceText}>Device</span>
          </div>
          <div className={styles.macAddress}>[{deviceMacAddress}]</div>
        </div>

        {connectionState === "connected" && (
          <>
            <div className={styles.remainingTime}>
              {diffDays} days {diffHours} hours remaining...
            </div>
            <div className={styles.expirationDate}>
              expires at {formattedDate}
            </div>
            <div className={styles.timelineContainer}>
              <div className={styles.timeline}>
                <div
                  className={styles.timelineProgress}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className={styles.timelineLabels}>
                <span>0 days</span>
                <span>30 days</span>
              </div>
            </div>
          </>
        )}
      </div>

      {connectionState === "connecting" ? (
        <div className={styles.connectingMessage}>
          Busy connecting your TV... make sure it is switched on and connected
          to @fibertime
        </div>
      ) : (
        <div className={styles.supportMessage}>
          Check your active bundles by WhatsApping us on
          <br />
          <b>078 886 1090</b>
        </div>
      )}
    </div>
  );
}
