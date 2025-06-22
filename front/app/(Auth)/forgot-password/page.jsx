"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
// import { useAuth } from "@/app/context/Auth";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    recoveryId: "",
    newPassword: "",
  });
//   const [auth, setAuth] = useAuth()
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.recoveryId.trim())
      newErrors.recoveryId = "Recovery ID is required";
    if (!formData.newPassword)
      newErrors.newPassword = "New password is required";
    else if (formData.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";
    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, proceed with submission
      console.log("Form submitted:", formData);
      // Here you would typically send the data to your server for authentication

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/forgot-password`,
          {
            email: formData.email,
            recoveryId: formData.recoveryId,
            newPassword: formData.newPassword
          }
        );
        console.log("new forgot password",res)
        if (res && res.data.success) {
          toast({
            title: res.data && res.data.message,
          });
          router.push("/");
        } else {
          toast({
            variant: "destructive",
            title: res.data.message,
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      }
    } else {
      setErrors(newErrors);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg">
          <div className="p-4 space-y-1">
            <h2 className="text-2xl font-bold text-center">
              Reset Your Password
            </h2>
            <p className="text-center text-gray-600">
              Enter your email, recovery ID, and new password to reset your
              account.
            </p>
          </div>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="recoveryId"
                  className="block text-sm font-medium"
                >
                  Recovery ID
                </label>
                <input
                  id="recoveryId"
                  name="recoveryId"
                  type="text"
                  placeholder="Enter your recovery ID"
                  value={formData.recoveryId}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
                {errors.recoveryId && (
                  <p className="text-red-500 text-sm">{errors.recoveryId}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm">{errors.newPassword}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
              >
                Reset Password
              </button>
            </form>
          </div>
          <div className="p-4 flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <a href="/login" className="text-green-600 hover:underline">
                Log in
              </a>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-green-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
