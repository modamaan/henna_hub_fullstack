"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/context/Auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Products() {
  const router = useRouter();
  const { toast } = useToast();
  const [auth, setAuth] = useAuth();
  const [categoryList, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // Add state for pagination and loading
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "" ||
          categoryFilter === "all" ||
          product?.category?._id === categoryFilter)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, products]);

  // const categories = Array.from(new Set(products.map(p => p.category)));

  const handleBack = () => {
    router.back();
  };

  // get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/product-list/${page}`
      );
      setProducts((prev) =>
        page === 1 ? data?.products : [...prev, ...data?.products]
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      toast({
        title: "Failed to fetch total product count",
        variant: "destructive",
      });
    }
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

  // Load more products
  const loadMore = async () => {
    setPage((prev) => prev + 1);
  };

  // Fetch products and total on mount, fetch more on page change
  useEffect(() => {
    getAllProducts();
    getAllCategory();
    getTotal();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (page === 1) return;
    getAllProducts();
    // eslint-disable-next-line
  }, [page]);

  // console.log("all category",categoryList)
  console.log("products", products);
  console.log("all filtered products", filteredProducts);

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
          <div className="container mx-auto px-4 py-8">
            <div>
              <div className="p-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 -ml-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
                All Products List
              </h1>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Select onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryList.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/dashboard/admin/products/${product.slug}`}
                >
                  <Card className="overflow-hidden">
                    <img
                      src={product.photo}
                      alt={product.name}
                      className="w-full h-48 object-contain"
                    />
                    <CardContent className="p-4">
                      <h2 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ${product.price}
                      </p>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
            {products.length < total && (
              <Button
                className="w-fit px-6 py-2 mx-auto my-6 block rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
