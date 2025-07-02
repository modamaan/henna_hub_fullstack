import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "../app/context/Cart";
import { useRouter } from "next/navigation";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayButton = ({ amount, user, cart, shippingAddressOption, deliveryMethod, deliveryFee }) => {
  const { toast } = useToast();
  const [_, setCart] = useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (paymentSuccess) {
      // Remove cart from localStorage and clear React state
      localStorage.removeItem("cart");
      setCart([]);
      router.push("/dashboard/user/orders");
    }
  }, [paymentSuccess, setCart, router]);

  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const res = await loadRazorpayScript();
    if (!res) {
      toast({
        title: "Razorpay SDK failed to load.",
        description: "Please check your internet connection.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    // Create order on backend
    try {
      const { data: order } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payment/create-order`,
        {
          amount,
          currency: "INR",
        }
      );
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Set this in your .env.local
        amount: order.amount,
        currency: order.currency,
        name: "Henna Shop",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          // Send payment details and cart/user to backend for verification and order save
          try {
            const verifyRes = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart,
                userId: user?._id,
                shippingAddressOption, // Pass the selected shipping address option
                deliveryMethod, // Pass the selected delivery method
                deliveryFee, // Pass the delivery fee
              }
            );
            if (verifyRes.data.success) {
              toast({
                title: "Payment Success!",
                description: "Payment verified and order saved!",
                variant: "default",
              });
              setPaymentSuccess(true);
            } else {
              toast({
                title: "Payment Verification Failed!",
                description:
                  verifyRes.data.message || "Could not verify payment.",
                variant: "destructive",
              });
              setIsProcessing(false);
            }
          } catch (err) {
            toast({
              title: "Error verifying payment",
              description:
                err?.response?.data?.message ||
                "An error occurred during payment verification.",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast({
        title: "Error creating order",
        description:
          err?.response?.data?.message ||
          "An error occurred while creating the order.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!cart || cart.length === 0 || isProcessing}
    >
      {isProcessing ? "Processing..." : "Pay Now"}
    </button>
  );
};

export default RazorpayButton;
