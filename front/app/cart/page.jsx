"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/Cart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import image from "../../images/henna.jpg";
import image1 from "../../images/henna1.webp";
import image2 from "../../images/henna2.webp";
import { Minus, Plus, Trash2, Tag, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../context/Auth";
import RazorpayButton from "../../components/RazorpayButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [shippingAddressOption, setShippingAddressOption] = useState("current");

  // Add to cart: ensure quantity is set to 1 if not present
  const addToCart = (product) => {
    const existing = cart.find(
      (item) => (item._id || item.id) === (product._id || product.id)
    );
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((item) =>
        (item._id || item.id) === (product._id || product.id)
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  // Update quantity for cart items
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map((item) => {
      if ((item._id || item.id) === id) {
        // Always use the correct key and never fallback to undefined
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  // Remove item from cart
  const removeItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate totals using cart
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const discount = Math.round(subtotal * 0.2);
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  // Format currency in INR
  const formatINR = (amount) =>
    amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {auth?.user ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-emerald-900 mb-2">
                Your Cart
              </h2>
              <p className="text-emerald-700">
                {cart.length > 0
                  ? `You have ${cart.length} item${
                      cart.length > 1 ? "s" : ""
                    } in your cart. ${
                      auth?.token ? "" : "Please login to checkout."
                    }`
                  : "Your cart is empty. Add items to your cart!"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-emerald-900 mb-6">
                      Shopping Cart
                    </h3>

                    <div className="space-y-6">
                      {cart.map((item, index) => (
                        <div key={item._id || item.id}>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl overflow-hidden border border-emerald-200">
                                <Image
                                  src={item.photo}
                                  alt={item.name}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-emerald-900 mb-2">
                                    {item.name}
                                  </h4>
                                  <div className="space-y-1">
                                    <p className="text-sm text-emerald-600">
                                      <span className="font-medium">
                                        Description:
                                      </span>{" "}
                                      {item.description
                                        ? item.description.substring(0, 30)
                                        : ""}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:items-end gap-3">
                                  <p className="text-xl font-bold text-emerald-900">
                                    {formatINR(item.price)}
                                  </p>
                                  <p className="text-md text-emerald-700">
                                    Total:{" "}
                                    {formatINR(
                                      item.price * (item.quantity || 1)
                                    )}
                                  </p>

                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-emerald-200 rounded-lg bg-emerald-50">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          updateQuantity(
                                            item._id,
                                            (item.quantity || 1) - 1
                                          )
                                        }
                                        className="h-8 w-8 p-0 hover:bg-emerald-100 text-emerald-700"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="w-8 text-center text-sm font-medium text-emerald-900">
                                        {item.quantity || 1}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          updateQuantity(
                                            item._id,
                                            (item.quantity || 1) + 1
                                          )
                                        }
                                        className="h-8 w-8 p-0 hover:bg-emerald-100 text-emerald-700"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeItem(item._id)}
                                      className="h-8 w-8 p-0 hover:bg-red-50 text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {index < cart.length - 1 && (
                            <Separator className="mt-6 bg-emerald-100" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden sticky top-8">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-emerald-900 mb-6">
                      Order Summary
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-700">Subtotal</span>
                        <span className="font-semibold text-emerald-900">
                          {formatINR(subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-emerald-700">
                          Discount (-20%)
                        </span>
                        <span className="font-semibold text-red-600">
                          -{formatINR(discount)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-emerald-700">Delivery Fee</span>
                        <span className="font-semibold text-emerald-900">
                          {formatINR(deliveryFee)}
                        </span>
                      </div>

                      <Separator className="bg-emerald-100" />

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-emerald-900">
                          Total
                        </span>
                        <span className="text-xl font-bold text-emerald-900">
                          {formatINR(total)}
                        </span>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="mb-6">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                          <Input
                            placeholder="Add promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    {/* Shipping Address Dropdown */}
                    <div className="mb-6">
                      <label className="block text-emerald-700 font-medium mb-2">
                        Shipping Address
                      </label>
                      <Select
                        value={shippingAddressOption}
                        onValueChange={setShippingAddressOption}
                      >
                        <SelectTrigger className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                          <SelectValue placeholder="Select shipping address" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current">Current Address</SelectItem>
                          <SelectItem value="pickup">Pick up from store</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Checkout Button replaced with RazorpayButton */}
                    <RazorpayButton
                      amount={total}
                      user={auth?.user}
                      cart={cart}
                      shippingAddressOption={shippingAddressOption}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">
              Please log in to view your cart.
            </h2>
            <Link href="/login">
              <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition-all duration-200">
                Go to Login
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
