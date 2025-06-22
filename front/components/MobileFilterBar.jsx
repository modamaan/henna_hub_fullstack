"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, X } from "lucide-react"

export function MobileFilterBar({ onFilterChange, orderCount }) {
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    paymentMethod: "all",
    searchQuery: "",
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      status: "all",
      dateRange: "all",
      paymentMethod: "all",
      searchQuery: "",
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const activeFilterCount =
    Object.values(filters).filter((value, index) => value !== "all" && value !== "" && index !== 3).length +
    (filters.searchQuery ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search orders, customers, or products..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter("searchQuery", e.target.value)}
          className="pl-10 border-sage-200 focus:border-sage-500 focus:ring-sage-500"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{orderCount} orders</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="bg-sage-100 text-sage-700">
              {activeFilterCount} filters
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Status Filters */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant={filters.status === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("status", "all")}
              className={filters.status === "all" ? "bg-green-600 text-white hover:bg-green-700" : "border-sage-200"}
            >
              All
            </Button>
            <Button
              variant={filters.status === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("status", "completed")}
              className={filters.status === "completed" ? "bg-green-600 text-white hover:bg-green-700" : "border-sage-200"}
            >
              Completed
            </Button>
            <Button
              variant={filters.status === "in progress" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("status", "in progress")}
              className={filters.status === "in progress" ? "bg-green-600 text-white hover:bg-green-700" : "border-sage-200"}
            >
              In Progress
            </Button>
          </div>

          {/* Advanced Filters Sheet */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="border-sage-200 hover:bg-sage-50">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-sage-600 text-white text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96">
              <SheetHeader>
                <SheetTitle>Filter Orders</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Order Status</label>
                  <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                    <SelectTrigger className="border-sage-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                  <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
                    <SelectTrigger className="border-sage-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Method Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Method</label>
                  <Select value={filters.paymentMethod} onValueChange={(value) => updateFilter("paymentMethod", value)}>
                    <SelectTrigger className="border-sage-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <Button variant="outline" onClick={clearFilters} className="w-full border-sage-200 hover:bg-sage-50">
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
