"use client";

import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

export default function SignupPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // 'phone' or 'otp'
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved");
          },
        }
      );

      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  }, []);

  const sendOTP = async () => {
    setError("");
    setInfo("");
    if (!phone.startsWith("+")) {
      setError("Phone number must be in E.164 format (e.g. +923001234567)");
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmation;
      setInfo("OTP sent successfully");
      setStep("otp");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP. Check number format or try again.");
    }
  };

 const verifyOTPAndSignup = async () => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    const user = result.user;

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: user.phoneNumber,
      }),
    });

    if (!res.ok) {
      throw new Error("Signup API failed with status " + res.status);
    }

    const data = await res.json();
    console.log("✅ User registered (mock):", data);
    alert("Signup successful!");
  } catch (err) {
    console.error("❌ OTP Verification failed:", err);
    alert("OTP Verification failed");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Signup with OTP</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {info && <div className="mb-4 text-green-600">{info}</div>}

      {step === "phone" && (
        <>
          <input
            type="text"
            className="w-full p-2 mb-3 border rounded"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <input
            type="email"
            className="w-full p-2 mb-3 border rounded"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="tel"
            className="w-full p-2 mb-3 border rounded"
            placeholder="+923001234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value.trim())}
          />
          <button
            onClick={sendOTP}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Send OTP
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <input
            type="text"
            className="w-full p-2 mb-3 border rounded"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={verifyOTPAndSignup}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Verify OTP & Signup
          </button>
        </>
      )}

      {/* Required by Firebase */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
