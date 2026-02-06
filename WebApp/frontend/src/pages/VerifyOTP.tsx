import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthHandler from "../handler/auth";

/*Custom hook*/
import { useAuth } from "../hooks/AuthContext";

export const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const authHandler = new AuthHandler();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const setLoginDetails = () => {
    let savedEmail = localStorage.getItem("login-email");

    if (!savedEmail && !location.state?.email) {
      logout();
      return null;
    }

    if (!location.state?.email) setEmail(savedEmail || "");
  };

  useEffect(() => {
    setLoginDetails();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    let response = await authHandler.verify({
      email: email,
      otp,
    });

    if (response.success) {
      localStorage.removeItem("login-email");
      const { token, user_details } = response.data;

      login(token, user_details);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verify OTP</h1>
          <p className="mt-2 text-sm text-gray-600">
            An OTP has been sent to <strong>{email}</strong>.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleVerify}>
          <div>
            <label htmlFor="otp" className="sr-only">
              OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="number"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              className="w-full py-3 px-4 text-center text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify OTP
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <button className="font-medium text-indigo-600 hover:text-indigo-500">
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};
