"use client";
// import React from 'react'

// const AdminDashboard = () => {
//   return (
//     <AdminRoute>
//     <div>AdminDashboard</div>
//     </AdminRoute>
//   )
// }

// export default AdminDashboard

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Mail,
  MapPin,
  Smartphone,
  Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/context/Auth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const basePath = "/dashboard/admin";

  console.log("Pathname ", pathname);

  const sidebarItems = [
    {
      id: "category",
      label: "Create Category",
      icon: LayoutDashboard,
      href: "/create-category",
    },
    {
      id: "createproduct",
      label: "Create Product",
      icon: ShoppingBag,
      href: "/create-product",
    },
    {
      id: "allorders",
      label: "All Orders",
      icon: ShoppingBag,
      href: "/orders",
    },
    { id: "users", label: "Users", icon: User, href: "/users" },
    {
      id: "allproduct",
      label: "All Products",
      icon: ShoppingBag,
      href: "/products",
    },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: Gem,
      href: "/testimonials",
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-green-800">Dashboard</h2>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link key={item.id} href={`${basePath}${item.href}`}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal hover:bg-green-100 hover:text-green-800"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header for mobile */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold text-green-800">Dashboard</h1>
          <Avatar>
            <AvatarImage alt={auth?.user?.name} />
            <AvatarFallback>
              {auth?.user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar for larger screens */}
          <aside className="hidden lg:block w-64 bg-white shadow-md">
            <SidebarContent />
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome, {auth?.user?.name}
                </h1>
                <Avatar className="hidden lg:flex h-12 w-12 bg-gray-800 ">
                  <AvatarImage alt={auth?.user?.name} />
                  <AvatarFallback>
                    {auth?.user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800">
                    Admin Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-lg text-gray-900">
                        {auth?.user?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg text-gray-900">
                        {auth?.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-lg text-gray-900">
                        {[
                          auth?.user?.address?.street,
                          auth?.user?.address?.town,
                          auth?.user?.address?.state,
                          auth?.user?.address?.pincode
                        ].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-lg text-gray-900">
                        {auth?.user?.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
