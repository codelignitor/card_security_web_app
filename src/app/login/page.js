"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import countryCodes from "../lib/Counttycodes";

export default function LoginPage() {
  const router = useRouter();
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [Phone, setphone] = useState("")
  const [otpError, setOtpError] = useState("");
    const [showCountryCode, setShowCountryCode] = useState(true);
  const [loginData, setLoginData] = useState(null);
  const [formData, setFormData] = useState({
    countryCode: "+1", // Default country code
  });


  const options = countryCodes.map((country) => ({
    value: `${country.code}-${country.name}`,
    label: `${country.flag} ${country.name} (${country.code})`,
  }));

  // Check if we're on the client side
  const isClient = typeof window !== "undefined";

  const handleChange = (selectedOption) => {
    const [code, name] = selectedOption.value.split("-");
    setFormData((prev) => ({
      ...prev,
      countryCode: code,
      selectedCountry: name,
    }));
  };

  // Updated country selector handler
  const handleCountryCodeChange = (e) => {
    const selectedValue = e.target.value;
    const selectedCountryObj = countryCodes.find(
      (country) => `${country.code}-${country.name}` === selectedValue
    );

    if (selectedCountryObj) {
      setFormData((prev) => ({
        ...prev,
        countryCode: selectedCountryObj.code,
        selectedCountry: selectedCountryObj.name,
      }));
    }
    // Clear error when user changes selection
    if (error) setError("");
  };

  // Get selected country info for display
  const getSelectedCountryInfo = () => {
    const selected = countryCodes.find(
      (country) =>
        country.code === formData.countryCode &&
        country.name === formData.selectedCountry
    );
    return (
      selected ||
      countryCodes.find((country) => country.name === "United States")
    );
  };

 const handleEmailOrPhoneChange = (e) => {
  const newValue = e.target.value;
  setEmailOrPhone(newValue);

  // Corrected: use newValue instead of value
  const isEmail = /[a-zA-Z]/.test(newValue);
  setShowCountryCode(!isEmail);

  // Clear error when user starts typing
  if (error) setError("");

  // Save email/phone if remember me is checked
  if (rememberMe && isClient) {
    try {
      localStorage.setItem("savedEmail", newValue);
    } catch (error) {
      console.error("Error saving email:", error);
    }
  }
};


  const setStoredAuth = (token, user, remember) => {
    if (isClient) {
      try {
        if (remember) {
          // Store in localStorage for persistence
          localStorage.setItem("authToken", token);
          localStorage.setItem("userData", JSON.stringify(user));
        } else {
          // Store in sessionStorage for session only
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userData", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Error storing auth data:", error);
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!isOtpMode) {
      // First step: Send login request to get OTP
      setLoading(true);
      setError("");

      try {
        const requestBody = {
          country_code: formData.countryCode,
          login_input: emailOrPhone,
        };

        console.log(
          "Sending request body:",
          JSON.stringify(requestBody, null, 2)
        );

        const response = await fetch(
          "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok && data.status) {
          // Success - OTP sent, show OTP form
          setLoginData(data);
          setIsOtpMode(true);
          console.log("Login verification code sent:", data);
          setphone(data.phone_no);

          // Save credentials if remember me is checked
          if (rememberMe && isClient) {
            try {
              localStorage.setItem("savedEmail", emailOrPhone);
              localStorage.setItem("savedCountryCode", formData.countryCode);
              localStorage.setItem("rememberLogin", "true");
            } catch (error) {
              console.error("Error saving credentials:", error);
            }
          }
        } else {
          // Handle API errors
          console.error("API Error:", data);
          setError(
            data.message ||
              `Login failed (${response.status}). Please check your credentials.`
          );
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Second step: Verify OTP
      handleOtpVerification();
    }
  };

  const handleBack = () => {
    setIsOtpMode(false);
    setOtp("");
    setOtpError("");
    setLoginData(null);
  };

  const handleResendOtp = async () => {
    // Check for loginData instead of userInfo
    if (!loginData) return;

    setLoading(true);
    setOtpError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/reset-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            country_code: formData.countryCode,
            email: loginData.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status) {
        setSuccess("Verification code resent successfully!");
        console.log("Resend otp", data);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setOtpError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    // Clear error when user starts typing
    if (otpError) setOtpError("");
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    setOtpError("");

    try {
      const requestBody = {
        email: loginData.email,
        otp: otp,
      };

      const response = await fetch(
        "https://cardsecuritysystem-8xdez.ondigitalocean.app/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data.status) {
        console.log("Login successful:", data);

        // ✅ Save user data including role
        const userData = {
          token: data.token,
          user: data.user,
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        // ✅ Role-based redirection
        const userRole = data.user?.role;

        if (userRole === "superadmin") {
          router.push("/admin");
        } else if (userRole === "BUSINESS_USER") {
          router.push("/dashboard");
        } else {
          // Default to admin for any other role or missing role
          router.push("/admin");
        }
      } else {
        setOtpError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setOtpError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-[60%] object-fill"
        >
          <source
            src="https://d3rfyed8zhcsm.cloudfront.net/Header2.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-25">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-xl sm:text-2xl my-2 font-bold text-white drop-shadow-lg"
              >
                <video autoPlay loop muted playsInline width="70">
               <source src="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20WebM%20version.webm" alt="CardNest Logo" />

                  Your browser does not support the video tag.
                </video>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-sm sm:max-w-md">
          {/* Main Card */}
          <div className="rounded-xl text-black bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl p-6 sm:p-8 transition-all duration-300 ease-in-out transform">
            <form onSubmit={handleSignIn}>
              {!isOtpMode ? (
                // Login Form
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-6 sm:mb-8">
                    Sign in to your account
                  </h2>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    {/* Country Selector */}
                    <div>
                      <label
                        htmlFor="countryCode"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Select your country
                      </label>
                     

                      <Select
                        id="countryCode"
                        name="countryCode"
                        value={options.find(
                          (opt) =>
                            opt.value ===
                            `${formData.countryCode}-${formData.selectedCountry}`
                        )}
                        onChange={handleChange}
                        isDisabled={loading}
                        options={options}
                        placeholder="Select your country"
                        className="text-sm sm:text-base"
                        classNamePrefix="react-select"
                      />
                    </div>

                    {/* Email/Phone Input */}
                 
                 <div>
      <label
        htmlFor="emailOrPhone"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Email or Phone
      </label>
      <div className="flex">
        {showCountryCode && (
          <div className="flex-shrink-0 flex items-center px-3 py-3 border border-gray-300 border-r-0 rounded-l-md shadow-sm bg-gray-50 text-sm text-gray-600">
            {getSelectedCountryInfo().flag} {formData.countryCode || "+1"}
          </div>
        )}

        <input
          id="emailOrPhone"
          type="text"
          value={emailOrPhone}
          onChange={handleEmailOrPhoneChange}
          disabled={loading}
          className={`flex-1 min-w-0 px-3 py-3 border border-gray-300 ${
            showCountryCode ? "rounded-r-md" : "rounded-md"
          } shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/90 disabled:bg-gray-100 text-sm sm:text-base`}
          placeholder="Enter your email or phone number"
          required
        />
      </div>
    </div>

                    <button
                      type="submit"
                      disabled={
                        loading || !emailOrPhone.trim() || !formData.countryCode
                      }
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? "Sending OTP..." : "Sign in"}
                    </button>

                    <div className="text-center">
                      <span className="text-sm text-gray-600">
                        New to our App?{" "}
                        <Link
                          href="/signup"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Create account
                        </Link>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                // OTP Form
                <>
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={loading}
                      className="flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium disabled:text-gray-400"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </button>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
                    Enter verification code
                  </h2>
                  <p className="text-sm text-gray-600 mb-6 sm:mb-8 break-words">
                    We sent a code to {getSelectedCountryInfo().flag}{" "}
                    {formData.countryCode} {Phone}
                  </p>

                  {/* OTP Error Message */}
                  {otpError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                      {otpError}
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                      {success}
                    </div>
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Verification code
                      </label>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        disabled={loading}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg sm:text-xl tracking-widest bg-white/90 disabled:bg-gray-100"
                        placeholder="000000"
                        maxLength="6"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
                      >
                        {loading ? "Sending..." : "Resend code"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-transparent py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center space-x-4 text-sm text-black/90 drop-shadow-lg">
              <span>© CardNest</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">
                Privacy & terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


