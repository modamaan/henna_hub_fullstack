"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, Check, Settings } from "lucide-react";
import Image from "next/image";

function getStatusColor(status) {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "in progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "waiting":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getStatusIcon(status) {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return <Check className="h-3 w-3" />;
    default:
      return null;
  }
}

export function MobileOrderTable({ orders, expandedRow, onToggleRow }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-sage-25 border-b border-sage-100 hover:bg-sage-25">
            <TableHead className="w-12 text-gray-700"></TableHead>
            <TableHead className="font-semibold text-gray-700 min-w-[200px]">
              Product Name
            </TableHead>
            <TableHead className="font-semibold text-gray-700 min-w-[150px]">
              Customer Name
            </TableHead>
            <TableHead className="font-semibold text-gray-700 min-w-[120px]">
              Date
            </TableHead>
            <TableHead className="font-semibold text-gray-700 min-w-[100px]">
              Payment
            </TableHead>
            <TableHead className="font-semibold text-gray-700 min-w-[100px]">
              Amount
            </TableHead>
            <TableHead className="font-semibold text-gray-700 min-w-[120px]">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-700 min-w-[80px]">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            // Calculate totalAmount and subtotal for flat product array
            const subtotal = Array.isArray(order.products)
              ? order.products.reduce(
                  (sum, item) => sum + (item?.price ?? 0),
                  0
                )
              : 0;
            const shipping = order.shipping ?? 0;
            const tax = order.tax ?? 0;
            const totalAmount = subtotal + shipping + tax;
            // Helper to get first product details (populated)
            const firstProduct = order.products && order.products[0] ? order.products[0] : null;
            const productName = firstProduct?.name || `Product ${firstProduct?._id || ""}`;
            const productImage = firstProduct?.photo?.url || "/placeholder.svg";
            const productCount = order.products ? order.products.length : 0;
            return (
              <React.Fragment key={order._id}>
                <TableRow
                  className="hover:bg-sage-25 cursor-pointer border-b border-sage-100 bg-white transition-colors"
                  onClick={() => onToggleRow(order._id)}
                >
                  <TableCell className="w-12">
                    <div className="flex items-center gap-2">
                      {(order.orderStatus || "").toLowerCase() ===
                        "completed" && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {expandedRow === order._id ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Image
                          src={productImage}
                          alt="Product"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {productName}
                        </div>
                        {productCount > 1 && (
                          <div className="text-xs text-gray-500">
                            +{productCount - 1} other products
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {order.buyer?.name || "You"}
                  </TableCell>
                  <TableCell className="text-gray-700 whitespace-nowrap">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          order.payment?.status === "Success"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.payment?.status === "Success"
                          ? "Paid"
                          : "Payment Failed"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 whitespace-nowrap">
                    ${totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        order.status
                      )} text-xs font-medium border px-2 py-1 whitespace-nowrap`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        order.orderStatus
                      )} text-xs font-medium border px-2 py-1 whitespace-nowrap`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4 text-gray-400" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRow === order._id && (
                  <TableRow>
                    <TableCell colSpan={9} className="p-0">
                      <div className="bg-sage-25 p-4 md:p-6 border-t border-sage-100">
                        <div className="space-y-4 md:space-y-6">
                          {/* Products List */}
                          <div>
                            <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                              Ordered Products
                            </h4>
                            <div className="space-y-3">
                              {order.products.map((item) => (
                                <div
                                  key={item?._id || item}
                                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-lg border border-sage-200 shadow-sm"
                                >
                                  <Image
                                    src={item?.photo?.url || "/placeholder.svg"}
                                    alt={item?.name || "Product"}
                                    width={48}
                                    height={48}
                                    className="md:w-[60px] md:h-[60px] rounded-lg object-cover border border-sage-200 flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-gray-800 truncate">
                                      {item?.name || `Product ${item?._id || item}`}
                                    </h5>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-1">
                                      <span className="text-sm text-gray-600">Qty: 1</span>
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <span className="text-sm text-gray-600">
                                          ${(item?.price ?? 0).toFixed(2)} each
                                        </span>
                                        <span className="text-sm font-bold text-sage-700">
                                          ${(item?.price ?? 0).toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="bg-white rounded-lg border border-sage-200 p-4 shadow-sm">
                            <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
                              Order Summary
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="text-gray-800">
                                  ${subtotal.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="text-gray-800">
                                  ${shipping.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax:</span>
                                <span className="text-gray-800">
                                  ${tax.toFixed(2)}
                                </span>
                              </div>
                              <div className="border-t border-sage-200 pt-2 mt-2">
                                <div className="flex justify-between text-base md:text-lg font-bold">
                                  <span className="text-gray-800">
                                    Total Amount:
                                  </span>
                                  <span className="text-sage-700">
                                    ${totalAmount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
