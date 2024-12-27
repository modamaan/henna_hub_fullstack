"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {useCart} from '../context/Cart'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import henna1 from "../../images/henna1.webp";
import { useState } from "react";

const featuredProducts = [
  { _id: 1, name: "Natural Henna Powder", price: 14.99, image: henna1 },
  { _id: 2, name: "Organic Henna Cones", price: 19.99, image: henna1 },
  { _id: 3, name: "Henna Stencil Kit", price: 24.99, image: henna1 },
  { _id: 4, name: "Henna Aftercare Oil", price: 9.99, image: henna1 },
  { _id: 5, name: "Premium Henna Applicator", price: 12.99, image: henna1 },
  { _id: 6, name: "Henna Design Book", price: 29.99, image: henna1 },
];
export default function FeaturedProducts() {
  // i want to local store this cart and using redux and use navbar page 
  // const [cart, setCart] = useState([]);
  const [cart, setCart] = useCart();  
  console.log("Cartlenght",cart);
  
  const addToCart = (product) => {
    console.log("product items",product);
    
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Featured Products
        </h2>
        {/* Mobile and Tablet Grid */}
        <div className="block lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 4).map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-green-700 font-bold mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => addToCart(product)}
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
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {product.name}
                        </h3>
                        <p className="text-green-700 font-bold mb-4">
                          ${product.price.toFixed(2)}
                        </p>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => addToCart(product)}
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
