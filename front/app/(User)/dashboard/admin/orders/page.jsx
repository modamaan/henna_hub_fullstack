"use client";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "../../../../context/Auth";
import { MobileFilterBar } from "./../../../../../components/MobileFilterBar";
import { MobileOrderCard } from "./../../../../../components/MobileOrderCard";
import { MobileOrderTable } from "./../../../../../components/MobileOrderTable";

// ... keep your last30DaysData, weeklyData, monthlyData, and orders as-is (they are already valid JS objects)

// Convert "as const" to simple strings

const last30DaysData = [
  {
    date: "Jan 1",
    day: "Mon",
    revenue: 4200,
    orders: 28,
    avgOrderValue: 150,
    customers: 25,
  },
  {
    date: "Jan 2",
    day: "Tue",
    revenue: 3800,
    orders: 22,
    avgOrderValue: 173,
    customers: 20,
  },
  {
    date: "Jan 3",
    day: "Wed",
    revenue: 5100,
    orders: 34,
    avgOrderValue: 150,
    customers: 31,
  },
  {
    date: "Jan 4",
    day: "Thu",
    revenue: 4600,
    orders: 31,
    avgOrderValue: 148,
    customers: 28,
  },
  {
    date: "Jan 5",
    day: "Fri",
    revenue: 6200,
    orders: 42,
    avgOrderValue: 148,
    customers: 38,
  },
  {
    date: "Jan 6",
    day: "Sat",
    revenue: 7800,
    orders: 52,
    avgOrderValue: 150,
    customers: 47,
  },
  {
    date: "Jan 7",
    day: "Sun",
    revenue: 6900,
    orders: 46,
    avgOrderValue: 150,
    customers: 41,
  },
  {
    date: "Jan 8",
    day: "Mon",
    revenue: 4400,
    orders: 29,
    avgOrderValue: 152,
    customers: 26,
  },
  {
    date: "Jan 9",
    day: "Tue",
    revenue: 3900,
    orders: 24,
    avgOrderValue: 163,
    customers: 22,
  },
  {
    date: "Jan 10",
    day: "Wed",
    revenue: 5300,
    orders: 35,
    avgOrderValue: 151,
    customers: 32,
  },
  {
    date: "Jan 11",
    day: "Thu",
    revenue: 4800,
    orders: 32,
    avgOrderValue: 150,
    customers: 29,
  },
  {
    date: "Jan 12",
    day: "Fri",
    revenue: 6400,
    orders: 43,
    avgOrderValue: 149,
    customers: 39,
  },
  {
    date: "Jan 13",
    day: "Sat",
    revenue: 8100,
    orders: 54,
    avgOrderValue: 150,
    customers: 49,
  },
  {
    date: "Jan 14",
    day: "Sun",
    revenue: 7200,
    orders: 48,
    avgOrderValue: 150,
    customers: 43,
  },
  {
    date: "Jan 15",
    day: "Mon",
    revenue: 4700,
    orders: 31,
    avgOrderValue: 152,
    customers: 28,
  },
  {
    date: "Jan 16",
    day: "Tue",
    revenue: 4100,
    orders: 26,
    avgOrderValue: 158,
    customers: 24,
  },
  {
    date: "Jan 17",
    day: "Wed",
    revenue: 5600,
    orders: 37,
    avgOrderValue: 151,
    customers: 34,
  },
  {
    date: "Jan 18",
    day: "Thu",
    revenue: 5000,
    orders: 33,
    avgOrderValue: 152,
    customers: 30,
  },
  {
    date: "Jan 19",
    day: "Fri",
    revenue: 6800,
    orders: 45,
    avgOrderValue: 151,
    customers: 41,
  },
  {
    date: "Jan 20",
    day: "Sat",
    revenue: 8500,
    orders: 56,
    avgOrderValue: 152,
    customers: 51,
  },
  {
    date: "Jan 21",
    day: "Sun",
    revenue: 7600,
    orders: 50,
    avgOrderValue: 152,
    customers: 45,
  },
  {
    date: "Jan 22",
    day: "Mon",
    revenue: 4900,
    orders: 32,
    avgOrderValue: 153,
    customers: 29,
  },
  {
    date: "Jan 23",
    day: "Tue",
    revenue: 4300,
    orders: 27,
    avgOrderValue: 159,
    customers: 25,
  },
  {
    date: "Jan 24",
    day: "Wed",
    revenue: 5800,
    orders: 38,
    avgOrderValue: 153,
    customers: 35,
  },
  {
    date: "Jan 25",
    day: "Thu",
    revenue: 5200,
    orders: 34,
    avgOrderValue: 153,
    customers: 31,
  },
  {
    date: "Jan 26",
    day: "Fri",
    revenue: 7100,
    orders: 46,
    avgOrderValue: 154,
    customers: 42,
  },
  {
    date: "Jan 27",
    day: "Sat",
    revenue: 8800,
    orders: 57,
    avgOrderValue: 154,
    customers: 52,
  },
  {
    date: "Jan 28",
    day: "Sun",
    revenue: 7900,
    orders: 51,
    avgOrderValue: 155,
    customers: 46,
  },
  {
    date: "Jan 29",
    day: "Mon",
    revenue: 5100,
    orders: 33,
    avgOrderValue: 155,
    customers: 30,
  },
  {
    date: "Jan 30",
    day: "Tue",
    revenue: 4500,
    orders: 28,
    avgOrderValue: 161,
    customers: 26,
  },
];

// Weekly aggregated data
const weeklyData = [
  {
    period: "Week 1",
    revenue: 42600,
    orders: 255,
    avgOrderValue: 167,
    customers: 230,
  },
  {
    period: "Week 2",
    revenue: 45800,
    orders: 267,
    avgOrderValue: 171,
    customers: 241,
  },
  {
    period: "Week 3",
    revenue: 48200,
    orders: 281,
    avgOrderValue: 172,
    customers: 254,
  },
  {
    period: "Week 4",
    revenue: 51300,
    orders: 297,
    avgOrderValue: 173,
    customers: 268,
  },
];

// Monthly data for the year
const monthlyData = [
  {
    period: "Jan",
    revenue: 189374,
    orders: 1100,
    avgOrderValue: 172,
    customers: 993,
  },
  {
    period: "Feb",
    revenue: 205600,
    orders: 1180,
    avgOrderValue: 174,
    customers: 1067,
  },
  {
    period: "Mar",
    revenue: 198200,
    orders: 1140,
    avgOrderValue: 174,
    customers: 1031,
  },
  {
    period: "Apr",
    revenue: 221800,
    orders: 1260,
    avgOrderValue: 176,
    customers: 1138,
  },
  {
    period: "May",
    revenue: 234500,
    orders: 1320,
    avgOrderValue: 178,
    customers: 1192,
  },
  {
    period: "Jun",
    revenue: 245300,
    orders: 1380,
    avgOrderValue: 178,
    customers: 1247,
  },
];

const metrics = [
  {
    title: "Total Sales",
    value: "$189,374",
    change: "+12.5%",
    changeType: "positive",
    description: "Total earnings from sales",
    sparklineData: [
      { value: 45 },
      { value: 52 },
      { value: 48 },
      { value: 61 },
      { value: 58 },
      { value: 67 },
    ],
  },
  {
    title: "Total Orders",
    value: "4,138",
    change: "+8.2%",
    changeType: "positive",
    description: "Total number of orders",
    sparklineData: [
      { value: 32 },
      { value: 38 },
      { value: 35 },
      { value: 42 },
      { value: 39 },
      { value: 45 },
    ],
  },
  {
    title: "Avg Order Value",
    value: "$156.80",
    change: "+5.3%",
    changeType: "positive",
    description: "Average value per order",
    sparklineData: [
      { value: 148 },
      { value: 152 },
      { value: 150 },
      { value: 155 },
      { value: 154 },
      { value: 157 },
    ],
  },
  {
    title: "Customer Growth",
    value: "2,847",
    change: "+15.7%",
    changeType: "positive",
    description: "New customers acquired",
    sparklineData: [
      { value: 220 },
      { value: 240 },
      { value: 235 },
      { value: 260 },
      { value: 255 },
      { value: 285 },
    ],
  },
];

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

const orders = [
  {
    id: "#HH2131",
    customerName: "Anika Dokidis",
    orderDate: "22 Jan, 2025",
    totalAmount: 87.97,
    orderStatus: "Completed",
    paymentStatus: "Mastercard",
    products: [
      {
        id: 1,
        image: "/placeholder.svg?height=60&width=60",
        name: "Premium Henna Powder",
        quantity: 2,
        price: 24.99,
      },
      {
        id: 2,
        image: "/placeholder.svg?height=60&width=60",
        name: "Henna Applicator Cones",
        quantity: 1,
        price: 12.99,
      },
    ],
    subtotal: 62.97,
    shipping: 15.0,
    tax: 10.0,
  },
  {
    id: "#HH2130",
    customerName: "Randy Ekstrom",
    orderDate: "20 Jan, 2025",
    totalAmount: 68.97,
    orderStatus: "In Progress",
    paymentStatus: "Visa",
    products: [
      {
        id: 3,
        image: "/placeholder.svg?height=60&width=60",
        name: "Henna Design Stencils",
        quantity: 3,
        price: 18.99,
      },
    ],
    subtotal: 56.97,
    shipping: 8.0,
    tax: 4.0,
  },
  {
    id: "#HH9229",
    customerName: "Mira Curtis",
    orderDate: "24 Jan, 2025",
    totalAmount: 51.98,
    orderStatus: "Waiting",
    paymentStatus: "Paypal",
    products: [
      {
        id: 4,
        image: "/placeholder.svg?height=60&width=60",
        name: "Essential Oil Blend",
        quantity: 1,
        price: 29.99,
      },
      {
        id: 5,
        image: "/placeholder.svg?height=60&width=60",
        name: "Natural Henna Oil",
        quantity: 1,
        price: 16.99,
      },
    ],
    subtotal: 46.98,
    shipping: 5.0,
    tax: 0.0,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-sage-200 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-gray-900 mb-2">{`${label}`}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.dataKey}:</span>
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.dataKey === "revenue"
                ? `$${entry.value.toLocaleString()}`
                : entry.dataKey === "avgOrderValue"
                ? `$${entry.value}`
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const page = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [chartType, setChartType] = useState("area");
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("cards");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    paymentMethod: "all",
    searchQuery: "",
  });
  const [status, setStatus] = useState(
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel"
  );

  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/all-orders`
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

  const getChartData = () => {
    switch (timeRange) {
      case "7days":
        return last30DaysData.slice(-7);
      case "30days":
        return last30DaysData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return last30DaysData;
    }
  };

  const getMetricColor = (metric) => {
    switch (metric) {
      case "revenue":
        return "#059669";
      case "orders":
        return "#2563eb";
      case "avgOrderValue":
        return "#7c3aed";
      case "customers":
        return "#dc2626";
      default:
        return "#059669";
    }
  };

  const renderChart = () => {
    const data = getChartData();
    const color = getMetricColor(selectedMetric);
    const xKey =
      timeRange === "30days" || timeRange === "7days" ? "date" : "period";

    if (chartType === "area") {
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id={`${selectedMetric}Gradient`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) =>
              selectedMetric === "revenue"
                ? `$${value / 1000}k`
                : selectedMetric === "avgOrderValue"
                ? `$${value}`
                : value.toLocaleString()
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={selectedMetric}
            stroke={color}
            strokeWidth={3}
            fill={`url(#${selectedMetric}Gradient)`}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      );
    } else if (chartType === "line") {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) =>
              selectedMetric === "revenue"
                ? `$${value / 1000}k`
                : selectedMetric === "avgOrderValue"
                ? `$${value}`
                : value.toLocaleString()
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={selectedMetric}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      );
    } else {
      return (
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) =>
              selectedMetric === "revenue"
                ? `$${value / 1000}k`
                : selectedMetric === "avgOrderValue"
                ? `$${value}`
                : value.toLocaleString()
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={selectedMetric}
            fill={color}
            radius={[4, 4, 0, 0]}
            stroke={color}
            strokeWidth={0}
            opacity={0.8}
          />
        </BarChart>
      );
    }
  };
  return (
    <div className="min-h-screen bg-sage-50">
      {/* Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Metrics Cards with Sparklines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className="bg-white shadow-sm border border-sage-200 hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                      metric.changeType === "positive"
                        ? "text-green-700 bg-green-100"
                        : "text-red-700 bg-red-100"
                    }`}
                  >
                    {metric.changeType === "positive" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {metric.change}
                  </div>
                </div>

                {/* Sparkline Chart */}
                <div className="h-12 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metric.sparklineData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                          metric.changeType === "positive"
                            ? "#10b981"
                            : "#ef4444"
                        }
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 3,
                          fill:
                            metric.changeType === "positive"
                              ? "#10b981"
                              : "#ef4444",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 p-0 h-auto hover:text-sage-700"
                  >
                    From last month → See detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Sales Performance Chart */}
        <Card className="bg-white shadow-sm border border-sage-200 mb-8">
          <CardHeader className="border-b border-sage-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-sage-600" />
                  Sales Performance Analytics
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Interactive visualization of key sales metrics and trends
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Metric Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Metric:
                  </span>
                  <Select
                    value={selectedMetric}
                    onValueChange={setSelectedMetric}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Total Revenue</SelectItem>
                      <SelectItem value="orders">Order Volume</SelectItem>
                      <SelectItem value="avgOrderValue">
                        Avg Order Value
                      </SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Range Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Period:
                  </span>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Chart Type Selection */}
                <div className="flex items-center gap-1 bg-sage-50 rounded-lg p-1">
                  <Button
                    variant={chartType === "area" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("area")}
                    className={
                      chartType === "area" ? "bg-sage-600 text-white" : ""
                    }
                  >
                    <Activity className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === "line" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("line")}
                    className={
                      chartType === "line" ? "bg-sage-600 text-white" : ""
                    }
                  >
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === "bar" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("bar")}
                    className={
                      chartType === "bar" ? "bg-sage-600 text-white" : ""
                    }
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>

            {/* Chart Summary */}
            <div className="mt-6 p-4 bg-sage-25 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-sage-700">
                    {selectedMetric === "revenue" ? "$" : ""}
                    {getChartData()
                      .reduce((sum, item) => sum + item[selectedMetric], 0)
                      .toLocaleString()}
                    {selectedMetric === "avgOrderValue" ? "" : ""}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total{" "}
                    {selectedMetric === "revenue"
                      ? "Revenue"
                      : selectedMetric === "orders"
                      ? "Orders"
                      : selectedMetric === "avgOrderValue"
                      ? "Avg Order Value"
                      : "Customers"}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.max(
                      ...getChartData().map((item) => item[selectedMetric])
                    ).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Peak Value</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(
                      getChartData().reduce(
                        (sum, item) => sum + item[selectedMetric],
                        0
                      ) / getChartData().length
                    ).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Average</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
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
