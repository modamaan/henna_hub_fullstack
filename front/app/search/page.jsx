"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSearch } from "../context/Search";
import { useCart } from "../context/Cart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Loader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
  </div>
);

const SearchPage = () => {
  const [values, setValues] = useSearch();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useCart();

  useEffect(() => {
    // Simulate loading for demonstration; replace with real data fetching logic
    if (values && values.results && values.results.length >= 0) {
      setLoading(false);
    }
  }, [values]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <Navbar />
      {/* Search Result Headline */}
      <h2 className="text-3xl font-bold text-center text-green-700 mt-10 mb-8 drop-shadow-sm">
        Search Results
      </h2>
      <p className="text-base font-bold text-center text-green-700 mt-3 mb-4 drop-shadow-sm">
        Found {values.results.length}{" "}
      </p>
      {/* Product Grid or Loader */}
      {loading ? (
        <Loader />
      ) : (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {values.results.map((product) => (
                <Card key={product._id} className="overflow-hidden">
                  <Link href={`/shop/${product.slug}`}>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/product-photo/${product._id}`}
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
      <Footer />
    </div>
  );
};

export default SearchPage;
