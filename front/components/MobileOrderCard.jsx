"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  Check,
  Settings,
  Calendar,
  CreditCard,
  User,
  Package,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import moment from "moment";
import { useAuth } from "@/app/context/Auth";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

// Utility function to determine badge color
function getStatusColor(status) {
  switch ((status || "").toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
    case "processing":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    case "cancel":
      return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
  }
}

// Utility function to return icon for status
function getStatusIcon(status) {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return <Check className="h-3 w-3" />;
    default:
      return null;
  }
}

export function MobileOrderCard({ order, isExpanded, onToggle }) {
  const [auth] = useAuth();
  // Helper to get product name/image if populated, else fallback
  const productName = order?.products?.name;
  // const productImage = firstProduct?.photo?.url || "/placeholder.svg";
  const productCount = order.products ? order.products.length : 0;
  // Buyer name (if populated)
  const buyerName = order.buyer?.name || "You";
  // Payment method (if available)
  const paymentMethod =
    order.payment?.status === "Success" ? "Paid" : "Payment Failed";
  const paymentColor =
    order.payment?.status === "Success" ? "text-green-600" : "text-red-600";
  // Order date
  const orderDate = order.createdAt ? moment(order.createdAt).fromNow() : "-";
  // Status
  const status = order.status || "";
  const isAdmin = auth?.user?.role === 1 || auth?.user?.role === "admin";
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [badgeStatus, setBadgeStatus] = useState(status);
  // Amounts
  const subtotal = Array.isArray(order.products)
    ? order.products.reduce((sum, item) => {
        const product = item.product || {};
        const quantity = item.quantity || 1;
        const price = typeof product.price === "number" ? product.price : 0;
        return sum + price * quantity;
      }, 0)
    : 0;
  const deliveryFee = order.deliveryFee ?? 0;
  const tax = order.tax ?? 0;
  const totalAmount = subtotal + deliveryFee + tax;

  const handleStatusChange = async (value) => {
    setSelectedStatus(value);
    setUpdating(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/order-status/${order._id}`,
        { status: value }
      );
      // Optionally show a toast or reload data
    } catch (err) {
      // Optionally show error
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    setBadgeStatus(selectedStatus);
  }, [selectedStatus]);

  return (
    <Card className="bg-white shadow-sm border border-sage-200 hover:shadow-md transition-all duration-300 mb-4">
      <CardContent className="p-0">
        {/* Main Order Info */}
        <div className="p-4 cursor-pointer" onClick={onToggle}>
          <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {status.toLowerCase() === "delivered" && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <User className="h-4 w-4" />
                  <span>{order?.buyer?.name}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`${getStatusColor(
                  badgeStatus
                )} text-xs font-medium border px-2 py-1`}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(badgeStatus)}
                  {badgeStatus}
                </div>
              </Badge>
              {isAdmin && (
                <div className="ml-2 min-w-[120px]">
                  <Select
                    value={selectedStatus}
                    onValueChange={handleStatusChange}
                    disabled={updating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Process">Not Process</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancel">Cancel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{orderDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <span className={`text-gray-600 font-semibold ${paymentColor}`}>
                {paymentMethod}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="font-bold text-sage-700">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{productCount} items</span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-sage-100 bg-sage-25">
            <div className="p-4 space-y-4">
              {/* Products List */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Ordered Products
                </h4>
                <div className="space-y-3">
                  {Array.isArray(order.products) &&
                    order.products.map((item) => {
                      const product = item.product || {}; // populated product or just id
                      const quantity = item.quantity || 1;
                      return (
                        <div
                          key={product._id || product.id || item._id}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-sage-200 shadow-sm"
                        >
                          <img
                            src={product.photo}
                            alt={product.name || "Product"}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover w-12 h-12"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm text-gray-800 truncate">
                              <span className="text-xs">Name:</span>{" "}
                              {product.name}
                            </h5>
                            {product.description && (
                              <div className="text-sm text-gray-500 truncate">
                                {product.description.substring(0, 30)}
                              </div>
                            )}
                            {typeof product.price !== "undefined" && (
                              <div className="text-sm text-gray-700 font-semibold">
                                Price: ₹{product.price} x {quantity} = ₹
                                {product.price * quantity}
                              </div>
                            )}
                            <div className="text-xs text-gray-600">
                              Quantity: {quantity}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-sage-200 p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Order Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-800">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery ({order.deliveryMethod || 'Standard'}):</span>
                    <span className="text-gray-800">
                      ₹{deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  {order.shippingAddress && (
                    <div className="flex flex-col gap-1 text-sm mt-1">
                      <span className="text-gray-600">Address:</span>
                      <span className="text-gray-800 break-words whitespace-pre-line bg-sage-50 rounded p-2 border border-sage-100">
                        {order.shippingAddress}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-800">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-sage-200 pt-2 mt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-gray-800">Total Amount:</span>
                      <span className="text-sage-700">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-sage-200 hover:bg-sage-50"
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sage-200 hover:bg-sage-50"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
