"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { ShoppingCart, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import henna1 from "../../images/henna.jpg";
import henna2 from "../../images/henna1.webp";
import henna3 from "../../images/henna2.webp";
import Navbar from "../components/Navbar";
import { useCart } from "../context/Cart";
import Footer from "../components/Footer";

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
  </div>
);

export default function ShopPage() {
  const { toast } = useToast();
  const [cart, setCart] = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  // offer product state
  const [offer, setOffer] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryList, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/get-product"
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Stop the loader once data is fetched
    }
  };

  // get all offer products
  const getAllOfferProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/product/get-offer"
      );
      setOffer(data?.offerProducts);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } 
  };

  useEffect(() => {
    getAllProducts();
    getAllCategory();
    getAllOfferProducts()
  }, []);

  console.log("get all offer products",offer)

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        return prevCart.map(
          (item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

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

  const categories = [
    "All",
    ...new Set(categoryList.map((product) => product.category)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Special Offer Banner */}
      <section className="bg-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h2 className="text-4xl font-bold mb-4">Special Offer!</h2>
              <p className="text-xl mb-6">
                Get 20% off on our Mehndi Henna Kit - Perfect for beginners and
                professionals alike!
              </p>
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-green-100"
              >
                Shop Now
              </Button>
            </div>
            <div className="md:w-1/2">
              <Card className="w-full max-w-md mx-auto">
                <CardContent className="p-6">
                  <Image
                    src={henna2}
                    alt="Mehndi Henna Kit"
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover mb-4 rounded-lg"
                  />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    Mehndi Henna Kit
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete kit with everything you need for stunning henna
                    designs.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      $39.99
                    </span>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 my-8 flex flex-col md:flex-row gap-4">
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

      {/* Product Grid or Loader */}
      {loading ? (
        <Loader /> // Show loader while data is being fetched
      ) : (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <Link href={`/shop/${product.slug}`}>
                    <img
                      src={`http://localhost:8080/api/v1/product/product-photo/${product._id}`}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-contain"
                    />
                  </Link>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name}
                    </p>
                    <p className="text-green-600 font-bold">
                      ${product.price.toFixed(2)}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
