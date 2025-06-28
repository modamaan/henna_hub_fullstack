"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "../context/Cart";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedroducts] = useState([]);
  const [products, setProducts] = useState([]);
  const { toast } = useToast();
  const [cart, setCart] = useCart();
  console.log("Cartlenght", cart);

  const addToCart = (product) => {
    console.log("product items", product);

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

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/get-product`
      );
      setProducts(data?.products || []);
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

  useEffect(() => {
    // Fetch all products on mount
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/get-product`
        );
        setProducts(data?.products || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Only filter by category === 'henna'
    const filtered = products.filter(
      (product) => product?.category?.name === "featured"
    );
    setFeaturedroducts(filtered);
  }, [products]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Featured Products
        </h2>
        {/* Mobile and Tablet Grid */}
        <div className="block lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
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
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-green-700 font-bold mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      // Check if product already exists in cart
                      const existingIndex = cart.findIndex(
                        (item) => item._id === product._id
                      );
                      let newCart;
                      if (existingIndex !== -1) {
                        // If exists, increment quantity
                        newCart = cart.map((item, idx) =>
                          idx === existingIndex
                            ? { ...item, quantity: (item.quantity || 1) + 1 }
                            : item
                        );
                      } else {
                        // If not, add with quantity 1
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Desktop Carousel */}
        <div className="hidden lg:block">
          <Carousel className="w-full max-w-5xl mx-auto text-white">
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem
                  key={product._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
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
                        <p className="text-green-700 font-bold mb-4">
                          ₹{product.price.toFixed(2)}
                        </p>
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
                                  ? {
                                      ...item,
                                      quantity: (item.quantity || 1) + 1,
                                    }
                                  : item
                              );
                            } else {
                              newCart = [...cart, { ...product, quantity: 1 }];
                            }
                            setCart(newCart);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(newCart)
                            );
                            toast({ title: `${product.name} added to cart!` });
                          }}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 " />
            <CarouselNext className="absolute right-0  top-1/2 transform -translate-y-1/2 bg-gray-600" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
