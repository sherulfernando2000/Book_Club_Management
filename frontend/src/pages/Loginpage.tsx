import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { login } from "../services/authService";
import toast from "react-hot-toast";
import axios from "axios";
import { login } from "../services/authService";
import { useAuth } from "../context/useAuth";


interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Loginpage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authenticate } = useAuth();
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false)

  // Replace these with your actual image URLs
  const backgroundImageUrl = "library2.jpeg";
  // const logo = "your-logo-url";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const openForgotPasswordDialog = () => {
  //   // Implement forgot password dialog logic
  //   console.log("Forgot password clicked");
  // };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      setIsLoading(true);
      try {
         const user = await login(formData);
        toast.success(`Welcome, ${user.user.name}!`);
        // console.log(`Welcome, ${user.name}!`)
        // console.log(`user ${user.user}`)
        localStorage.setItem("user", JSON.stringify(user.user));
        authenticate(user.accessToken);
        navigate("/dashboard");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMsg = error.response?.data?.message || "Login failed";
          toast.error(errorMsg);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="login-page">
      
      {
          openForgotPasswordDialog 
          &&
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-40 z-50"
            onClick={() => setOpenForgotPasswordDialog(false)} // Close on outside click
          >
            <div
              className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded shadow-[0px_0px_10px_0px] shadow-black/10"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Forget Password?</h2>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="w-full border mt-1 border-gray-500/30 focus:border-indigo-500 outline-none rounded py-2.5 px-4"
                type="email"
                placeholder="Enter your email"
              />
              <button
                type="button"
                className="w-full my-3 bg-gray-800 active:scale-95 transition py-2.5 rounded text-white"
              >
                Send Email
              </button>
              <p className="text-gray-500/90 text-sm mt-4">
                Don't have an account?
                <Link to="/signup" className="text-indigo-400 hover:underline ml-1">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          
        }
      <div className="flex min-h-screen w-full">

        
        <div
          className="hidden md:flex w-1/2 flex-col justify-center items-center bg-black  text-center relative"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 flex-col justify-center items-center text-blue-500">
            <h1 className="text-2xl md:text-4xl font-semibold text">
              Welcome to
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">
              BOOK CLUB LIBRARY
            </h2>
            <p className="text-sm md:text-base">Books Bring Us Together</p>
          </div>
        </div>

        <div className="w-full min-h-screen md:w-1/2 flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="md:w-96 w-80 flex flex-col items-center justify-center"
          >
            <img src="booklogo.jpeg" alt="" className='w-15 h-15' />
            <h1 className="text-2xl md:text-2xl font-bold text-blue-800">
              SIGN IN
            </h1>

            <p className="text-sm text-gray-500/90 mt-3">
              Welcome back! Please sign in to continue
            </p>

            <div className="w-full p-2">
              <div
                className={`flex items-center w-full bg-transparent border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors duration-300 focus-within:border-black/60 ${
                  errors.email && submitted
                    ? "border-red-500"
                    : isEmailFocused
                    ? "border-black/60 bg-gray-50"
                    : "border-gray-300/60"
                }`}
              >
                <svg
                  width="16"
                  height="11"
                  viewBox="0 0 16 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                    fill="#6B7280"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  className="bg-transparent text-black/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                />
              </div>
              {errors.email && submitted && (
                <div className="text-red-500 text-xs mt-1 text-left pl-6 w-full">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="w-full p-2">
              <div
                className={`flex items-center mt-6 w-full bg-transparent border h-12 rounded-full overflow-hidden pl-6 gap-2 transition-colors duration-300 focus-within:border-black/60 ${
                  errors.password && submitted
                    ? "border-red-500"
                    : isPasswordFocused
                    ? "border-black/80 bg-gray-50"
                    : "border-gray-300/60"
                }`}
              >
                <svg
                  width="13"
                  height="17"
                  viewBox="0 0 13 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                    fill="#6B7280"
                  />
                </svg>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="bg-transparent text-black/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                />

                {!showPassword ? (
                  <svg
                    className="m-3 cursor-pointer"
                    onClick={togglePasswordVisibility}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5C5 5 1 12 1 12s4 7 11 7 11-7 11-7-4-7-11-7z"
                      stroke="#6B7280"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#6B7280"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="m-3 cursor-pointer"
                    onClick={togglePasswordVisibility}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.94 17.94C16.14 19.24 14.14 20 12 20 5 20 1 12 1 12c.73-1.31 1.63-2.52 2.66-3.6M22.08 11.08c-.56-1.31-1.33-2.5-2.29-3.52-1.9-1.97-4.29-3.01-6.79-3.01-.73 0-1.45.09-2.16.25M1 1l22 22"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              {errors.password && submitted && (
                <div className="text-red-500 text-xs mt-1 pl-6 text-left w-full">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="w-full p-2 flex items-center justify-between mt-8 text-gray-500/80">
              <div className="flex items-center gap-2">
                <input className="h-5" type="checkbox" id="checkbox" />
                <label className="text-sm" htmlFor="checkbox">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm underline cursor-pointer hover:text-indigo-500"
                onClick={()=>setOpenForgotPasswordDialog(!openForgotPasswordDialog)}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-5/6  h-11 rounded-full text-white bg-black hover:opacity-90 hover:scale-95 transition-opacity disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>

            <div className="flex items-center gap-4 w-full my-5">
              <div className="w-full h-px bg-gray-300/90"></div>
              <p className="w-full text-nowrap text-sm text-gray-500/90">
                or sign in with
              </p>
              <div className="w-full h-px bg-gray-300/90"></div>
            </div>

            <div className="flex flex-wrap gap-4 mt-2 justify-center">
              <button
                type="button"
                className="w-12 h-12 bg-gray-500/10 flex items-center justify-center rounded-full hover:shadow-md"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
              </button>

              <button
                type="button"
                className="w-12 h-12 bg-gray-500/10 flex items-center justify-center rounded-full hover:shadow-md"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </button>
            </div>

            <p className="text-gray-500/90 text-sm mt-4">
              Don't have an account?
              <Link
                to="/signup"
                className="text-indigo-400 hover:underline ml-1"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>

        
         
      </div>
    </div>
  );
};

export default Loginpage;