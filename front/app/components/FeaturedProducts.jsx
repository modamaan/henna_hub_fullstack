"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "../context/Cart";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductsByCategory() {
  const [products, setProducts] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [categories, setCategories] = useState([]);
  const { toast } = useToast();
  const [cart, setCart] = useCart();
  // Add state for controlled Accordion
  const [openCategories, setOpenCategories] = useState([]);

  // Fetch categories dynamically from backend
  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/category/get-category`
        );
        if (data.success) {
          setCategories(data.category);
        }
      } catch (error) {
        toast({
          title: "Something went wrong when getting categories",
          variant: "destructive",
        });
      }
    };
    getAllCategory();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/get-product`
        );
        setProducts(data?.products || []);
      } catch (error) {
        toast({ title: "Failed to load products", variant: "destructive" });
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Group products by category name
    const groupedByCat = {};
    products.forEach((product) => {
      const cat = product?.category?.name || "Other";
      if (!groupedByCat[cat]) groupedByCat[cat] = [];
      groupedByCat[cat].push(product);
    });
    setGrouped(groupedByCat);
  }, [products]);

  // Update openCategories when categories or grouped changes
  useEffect(() => {
    const open = categories.filter((cat) => grouped[cat.name]?.length).map((cat) => cat.name);
    setOpenCategories(open);
  }, [categories, grouped]);

  const addToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item._id === product._id);
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
    toast({ title: `${product.name} added to cart!` });
  };

  // Helper to get combo count (if available)
  const getComboCount = (product) => {
    if (product.comboCount) return product.comboCount;
    if (product.combo_count) return product.combo_count;
    if (product.combo) return product.combo;
    return null;
  };

  // Helper to get discounted price (if available)
  const getDiscountedPrice = (product) => {
    if (product.discountPrice) return product.discountPrice;
    if (product.discount_price) return product.discount_price;
    return null;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Shop by Category
        </h2>
        <Accordion
          type="multiple"
          value={openCategories}
          onValueChange={setOpenCategories}
          className="w-full"
        >
          {categories.map((cat) =>
            grouped[cat.name]?.length ? (
              <AccordionItem key={cat._id} value={cat.name}>
                <AccordionTrigger className="text-lg font-semibold text-black bg-gray-100 hover:bg-gray-200 px-6 py-4">
                  {cat.name}
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50 mt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {grouped[cat.name].map((product) => {
                      const comboCount = getComboCount(product);
                      const discounted = getDiscountedPrice(product);
                      return (
                        <Card
                          key={product._id}
                          className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col"
                        >
                          <Link href={`/shop/${product.slug}`}>
                            <Image
                              src={product.photo}
                              alt={product.name}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover"
                            />
                          </Link>
                          <CardContent className="p-4 flex-1 flex flex-col">
                            <h3 className="font-semibold text-lg mb-1">
                              {product.name}
                            </h3>
                            {comboCount && (
                              <p className="text-sm text-gray-500 mb-1">
                                Combo: {comboCount}
                              </p>
                            )}
                            <div className="mb-4">
                              {discounted ? (
                                <>
                                  <span className="text-green-700 font-bold text-lg mr-2">
                                    ₹{discounted.toFixed(2)}
                                  </span>
                                  <span className="line-through text-gray-400 text-base">
                                    ₹{product.price.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-green-700 font-bold text-lg">
                                  ₹{product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto"
                              onClick={() => addToCart(product)}
                            >
                              Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ) : null
          )}
        </Accordion>
      </div>
    </section>
  );
}
