"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Save,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/context/Auth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CategoryCreator() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [selected, setSelected] = useState();
  const { toast } = useToast();

  const basePath = "/dashboard/admin";

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
    { id: "users", label: "Users", icon: User, href: "/users" },
    {
      id: "allproduct",
      label: "All Products",
      icon: ShoppingBag,
      href: "/products",
    },
  ];

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/category/get-category`
      );
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong when getting categories",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle category submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/category/create-category`,
        { name }
      );
      if (data?.success) {
        toast({
          title: `${data?.category?.name} is created`,
        });
        getAllCategory();
        setName(""); // Clear input after category creation
      } else {
        toast({
          title: `${data?.message}`,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong in input form",
        variant: "destructive",
      });
    }
  };

  // Handle category update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selected?._id || !editingName) return;

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/category/update-category/${selected._id}`,
        { name: editingName }
      );
      if (data.success) {
        toast({
          title: `${editingName} has been updated successfully`,
        });
        setSelected(null);
        setEditingId(null);
        setEditingName("");
        getAllCategory(); // Refresh categories
      } else {
        toast({
          title: `${data?.message}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong during the update",
        variant: "destructive",
      });
    }
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/category/delete-category/${id}`
      );
      if (data.success) {
        toast({
          title: "Category Deleted",
          description: "The category has been removed.",
          variant: "destructive",
        });
        getAllCategory(); // Refresh categories
      } else {
        toast({
          title: `${data?.message}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
    setSelected({ _id: id, name });
  };

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
          {/* <aside className="hidden lg:block w-64 bg-white shadow-md">
            <SidebarContent />
          </aside> */}

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Card className="bg-white shadow-md">
              <CardHeader className="border-b border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-evently  sm:gap-4  md:gap-8">
                  <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-green-800">
                    Manage Categories
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form
                  onSubmit={handleSubmit}
                  className="mb-6 flex flex-col gap-2"
                >
                  <Input
                    type="text"
                    placeholder="Enter New Category"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                  </Button>
                </form>

                <div className="overflow-x-auto -mx-4 sm:-mx-6 sm:px-2 md:px-5 ">
                  <div className="inline-block min-w-full align-middle">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category Name</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((category) => (
                          <TableRow key={category._id}>
                            <TableCell>
                              {editingId === category._id ? (
                                <Input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) =>
                                    setEditingName(e.target.value)
                                  }
                                  className="w-full"
                                />
                              ) : (
                                category.name
                              )}
                            </TableCell>
                            <TableCell>
                              {editingId === category._id ? (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    onClick={handleUpdate}
                                    className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center w-full sm:w-auto"
                                  >
                                    <Save className="mr-2 h-4 w-4" /> Save
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditingName("");
                                    }}
                                    variant="ghost"
                                    className="flex items-center justify-center w-full sm:w-auto"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    onClick={() =>
                                      handleEdit(category._id, category.name)
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center w-full sm:w-auto"
                                  >
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                  </Button>
                                  <Button
                                    onClick={() => handleDelete(category._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center w-full sm:w-auto"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}