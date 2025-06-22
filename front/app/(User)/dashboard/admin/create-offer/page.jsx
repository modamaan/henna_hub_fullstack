"use client";
import { useState, useEffect } from "react";
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
  ArrowLeft,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/context/Auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const shippingOptions = ["Yes", "No"];

export default function CreateProduct() {
  const router = useRouter();
  const { toast } = useToast();
  const [auth, setAuth] = useAuth();
  const [categoryList, setCategories] = useState([]);
  const [product, setProduct] = useState({
    category: "",
    photo: null,
    name: "",
    description: "",
    price: "",
    quantity: "",
    shipping: "",
    offer:""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProduct((prev) => ({ ...prev, photo: e.target.files[0] }));
    }
  };

  const handleBack = () => {
    router.back();
  };

  // all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Product to be created:", product);
    // Here you would typically send the data to your backend
    const { name, description, price, quantity, photo, category, shipping,offer } =
      product;
    // Validate fields
    if (!name || !description || !price || !quantity || !photo || !category || !offer) {
      let errorMessage = "The following fields are required: ";
      if (!name) errorMessage += "Name, ";
      if (!description) errorMessage += "Description, ";
      if (!price) errorMessage += "Price, ";
      if (!offer) errorMessage += "Offer price, ";
      if (!quantity) errorMessage += "Quantity, ";
      if (!photo) errorMessage += "Photo, ";
      if (!category) errorMessage += "Category, ";
      errorMessage = errorMessage.slice(0, -2); // Remove trailing comma and space
      toast({
        title: errorMessage,
        variant: "destructive",
      });
      return;
    }

    if (photo.size > 1000000) {
      toast({
        title: "Photo should be less than 1MB",
        variant: "destructive",
      });
      return;
    }

    // Create FormData
    const productData = new FormData();
    productData.append("name", name);
    productData.append("description", description);
    productData.append("price", price);
    productData.append("quantity", quantity);
    productData.append("photo", photo);
    productData.append("category", category);
    productData.append("shipping", shipping);
    productData.append("offer", offer);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/create-offer`,
        productData
      );

      console.log("product database", data);

      if (data?.success) {
        toast({
          title: data.message,
          variant: "success",
        });
        // Redirect to products page after successful creation
        setTimeout(() => {
          router.push("/dashboard/admin/products");
        }, 2000);
      } else {
        toast({
          title: "Product Created Successfully",
          variant: "success",
        });
        router.push("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-green-800">Dashboard</h2>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start text-left font-normal hover:bg-green-100 hover:text-green-800"
              onClick={() => router.push(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-3/4 bg-gray-100">
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar for larger screens */}
          {/* <aside className="hidden lg:block w-64 bg-white shadow-md">
            <SidebarContent />
          </aside> */}

          {/* Main Content */}
          <div className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 -ml-4"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <CardTitle className="text-2xl font-bold text-center text-green-800">
                      Create Special Product
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Select a Category</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryList.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo">Upload Photo</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="photo"
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Label
                          htmlFor="photo"
                          className="cursor-pointer flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none hover:border-gray-400 focus:outline-none"
                        >
                          {product.photo ? (
                            <div className="flex flex-col items-center w-full h-full">
                              <img
                                src={URL.createObjectURL(product.photo)}
                                alt="Product preview"
                                className="max-w-full max-h-full object-contain" // Ensure the image fits within the container
                              />
                              <span className="mt-2 text-sm text-gray-600">
                                {product.photo.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Upload className="w-8 h-8 text-gray-400" />
                              <span className="mt-2 text-sm text-gray-600">
                                Select a photo
                              </span>
                            </div>
                          )}
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        placeholder="Write a description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={product.price}
                          onChange={handleInputChange}
                          placeholder="Enter price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offer">Offer price</Label>
                        <Input
                          id="offer"
                          name="offer"
                          type="number"
                          value={product.offer}
                          onChange={handleInputChange}
                          placeholder="Enter Offer price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={product.quantity}
                          onChange={handleInputChange}
                          placeholder="Enter quantity"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping">Select Shipping</Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("shipping", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping" />
                        </SelectTrigger>
                        <SelectContent>
                          {shippingOptions.map((option) => (
                            <SelectItem
                              key={option}
                              value={option.toLowerCase()}
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Create Product
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
