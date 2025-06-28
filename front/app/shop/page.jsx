"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import Navbar from "../components/Navbar";
import { useCart } from "../context/Cart";
import Footer from "../components/Footer";
import { useSearch } from "../context/Search";

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
  </div>
);

export default function ShopPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [cart, setCart] = useCart();
  const [values, setValues] = useSearch();
  const [products, setProducts] = useState([]);
  const [offer, setOffer] = useState([]);
  const [categoryList, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [InitialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data?.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to fetch total product count",
        variant: "destructive",
      });
    }
  };

  const getAllOfferProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/get-offer`
      );
      if (data?.offerProduct) {
        setOffer(data.offerProduct);
      } else {
        setOffer(null);
      }
    } catch (error) {
      setOffer(null);
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCategory();
    getTotal();
    getAllOfferProducts();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      router.push("/search");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (categoryFilter && categoryFilter !== "all") {
      setLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/category/${categoryFilter}`
        )
        .then(({ data }) => {
          setProducts(data?.products || []);
        })
        .catch(() => {
          toast({
            title: "Failed to fetch products for category",
            variant: "destructive",
          });
        })
        .finally(() => setLoading(false));
    } else {
      getAllProducts();
    }
  }, [categoryFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />
      {offer && offer._id && (
        <section className="bg-green-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h2 className="text-4xl font-bold mb-4">Special Offer!</h2>
                <p className="text-xl mb-6">
                  Get {offer.offer}% off on {offer.name} - {offer.description}
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
                      src={offer.photo}
                      alt={offer.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover mb-4 rounded-lg"
                    />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      {offer.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <span className="text-2xl font-bold text-green-600 ">
                          ₹{offer.offer}
                        </span>
                        <span className="text-sm line-through text-gray-400">
                          ₹{offer.price}
                        </span>
                      </div>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white ml-10"
                        onClick={() => {
                          const existingIndex = cart.findIndex(
                            (item) => item._id === offer._id
                          );
                          let newCart;
                          if (existingIndex !== -1) {
                            newCart = cart.map((item, idx) =>
                              idx === existingIndex
                                ? {
                                    ...item,
                                    quantity: (item.quantity || 1) + 1,
                                  }
                                : item
                            );
                          } else {
                            newCart = [...cart, { ...offer, quantity: 1 }];
                          }
                          setCart(newCart);
                          localStorage.setItem("cart", JSON.stringify(newCart));
                          toast({ title: `${offer.name} added to cart!` });
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto px-4 my-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search products..."
              value={values.keyword}
              onChange={(e) =>
                setValues({ ...values, keyword: e.target.value })
              }
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
      </form>
      {InitialLoading ? (
        <Loader />
      ) : (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <Link href={`/shop/${product.slug}`}>
                    <Image
                      src={product.photo}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover"
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
                      ₹{product.price.toFixed(2)}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        const existingIndex = cart.findIndex(
                          (item) => item._id === product._id
                        );
                        let newCart;
                        if (existingIndex !== -1) {
                          newCart = cart.map((item, idx) =>
                            idx === existingIndex
                              ? { ...item, quantity: (item.quantity || 1) + 1 }
                              : item
                          );
                        } else {
                          newCart = [...cart, { ...product, quantity: 1 }];
                        }
                        setCart(newCart);
                        localStorage.setItem("cart", JSON.stringify(newCart));
                        toast({
                          title: `${product.name} added to cart!`,
                        });
                      }}
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
      <div>
        {products && products.length < total && (
          <Button
            className="w-fit px-6 py-2 mx-auto my-6 block rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              setPage(page + 1);
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
      <Footer />
    </div>
  );
}
