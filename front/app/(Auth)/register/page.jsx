"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    recoveryId: "",
  });

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
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.recoveryId.trim())
      newErrors.recoveryId = "Recovery email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.recoveryId))
      newErrors.recoveryId = "Recovery email is invalid";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log("FormData", formData);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            recoveryId: formData.recoveryId,
          }
        );
        // console.log("Response data",res);

        if (res.data.success) {
          toast({
            title: res.data.message,
          });
          router.push("/login");
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
      toast({
        title: "Registration Failed",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
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
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="recoveryId">Recovery Email</Label>
                <Input
                  id="recoveryId"
                  name="recoveryId"
                  type="email"
                  placeholder="recovery@example.com"
                  value={formData.recoveryId}
                  onChange={handleInputChange}
                />
                {errors.recoveryId && (
                  <p className="text-red-500 text-sm">{errors.recoveryId}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:underline">
                Log in
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-green-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-green-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
