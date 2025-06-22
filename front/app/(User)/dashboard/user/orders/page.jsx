"use client";
import Navbar from "@/app/components/Navbar";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  Settings,
  Check,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChartIcon,
  Activity,
  Grid3X3,
  List,
} from "lucide-react";
import Image from "next/image";
import { MobileOrderCard } from "../../../../../components/MobileOrderCard";
import { MobileOrderTable } from "../../../../../components/MobileOrderTable";
import { MobileFilterBar } from "../../../../../components/MobileFilterBar";
import axios from "axios";
import { useAuth } from "../../../../context/Auth";

function getStatusColor(status) {
  switch (status.toLowerCase()) {
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
  switch (status.toLowerCase()) {
    case "completed":
      return <Check className="h-3 w-3" />;
    default:
      return null;
  }
}

const page = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [chartType, setChartType] = useState("area");
  const [viewMode, setViewMode] = useState("cards");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    paymentMethod: "all",
    searchQuery: "",
  });

  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (
        filters.status !== "all" &&
        order.orderStatus?.toLowerCase() !== filters.status
      ) {
        return false;
      }

      // Payment method filter
      if (
        filters.paymentMethod !== "all" &&
        order.paymentStatus?.toLowerCase() !== filters.paymentMethod
      ) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          order.id?.toLowerCase().includes(query) ||
          order.customerName?.toLowerCase().includes(query) ||
          (order.products &&
            order.products.some((product) =>
              product.name?.toLowerCase().includes(query)
            ))
        );
      }

      return true;
    });
  }, [orders, filters]);

  const toggleRow = (orderId) => {
    setExpandedRow((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Orders Section */}
        <Card className="bg-white shadow-sm border border-sage-200">
          <CardHeader className="border-b border-sage-100">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Order Transactions
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Latest transaction orders in real time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* View Mode Toggle - Hidden on mobile */}
                  <div className="flex items-center gap-1 bg-sage-50 rounded-lg p-1">
                    <Button
                      variant={viewMode === "cards" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("cards")}
                      className={
                        viewMode === "cards"
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : ""
                      }
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "compact" ? "default" : "ghost"}
                      size="sm"
                      disabled
                      onClick={() => setViewMode("compact")}
                      className={
                        viewMode === "compact"
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : ""
                      }
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-sage-200 hover:bg-sage-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Mobile Filter Bar */}
              <MobileFilterBar
                onFilterChange={setFilters}
                orderCount={filteredOrders.length}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {/* Conditional Rendering Based on View Mode */}
            {viewMode === "cards" ? (
              /* Mobile-Optimized Order Cards */
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <MobileOrderCard
                    key={order._id}
                    order={order}
                    isExpanded={expandedRow === order._id}
                    onToggle={() => toggleRow(order._id)}
                  />
                ))}
              </div>
            ) : (
              /* Table View */
              <MobileOrderTable
                orders={filteredOrders}
                expandedRow={expandedRow}
                onToggleRow={toggleRow}
              />
            )}

            {/* Load More / Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-sage-200 gap-4">
              <div className="text-sm text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="border-sage-200"
                >
                  ←
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sage-200 hover:bg-sage-50"
                >
                  →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
