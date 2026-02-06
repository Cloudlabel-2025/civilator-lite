import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

import AuthHandler from "../handler/auth";

import Images from "../assets/Images";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const authHandler = new AuthHandler();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let response = await authHandler.login({
      email: email,
    });

    if (response.success) {
      localStorage.setItem("login-email", email);

      navigate("/verify-otp", { state: { email } });
    } else {
      setError(response.message || "Login failed. Please try again.");
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("login-email");
    if (savedEmail) {
      navigate("/verify-otp", { state: { email: savedEmail } });
    }
  }, []);

  return (
    <div className="flex w-[100vw] h-[100vh]">
      <img
        src={Images.LoginBanner}
        alt="Login Banner"
        className="w-[60%] h-full object-cover hidden md:block"
      />
      <div className="w-full md:w-[40%] p-8 md:px-20 flex flex-col justify-center gap-10">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-900">Login & Sign Up</h4>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address
          </p>
        </div>
        <img
          src={Images.LoginVector}
          className="w-auto h-[100px] object-contain"
        />
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send OTP
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            By logging in, you agree to our{" "}
            <a href="#" className="text-indigo-600 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <span>Powered by</span>
          <img
            src={Images.LogoLight}
            className="w-[max-content] h-[30px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};
