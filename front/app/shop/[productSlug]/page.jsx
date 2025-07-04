"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "../../context/Cart";
import { Label } from "@/components/ui/label";
import henna from "../../../public/images/henna.jpg";
import henna1 from "../../../public/images/henna1.webp";
import henna2 from "../../../public/images/henna2.webp";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ProductDetails({ params }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cart, setCart] = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [product, setProduct] = useState({
    category: "",
    photo: null,
    name: "",
    description: "",
    price: "",
    quantity: "",
    _id: "",
    shipping: "",
  });
  const [shipping, setShipping] = useState("");
  const [id, setId] = useState("");
  const router = useRouter();

  // console.log("related products", relatedProducts);

  // toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  console.log("all items gets", product);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Find the existing product in the cart
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        // If the product is already in the cart, increment only its quantity
        return prevCart.map(
          (item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item // Return other items unchanged
        );
      }
      // If the product is not in the cart, add it with a quantity of 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleBack = () => {
    router.back();
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  useEffect(() => {
    if (params?.productSlug) getSingleProduct();
  }, [params?.productSlug]);

  // console.log("get single product", product);
  // console.log("shipping", shipping);
  // console.log("ID", id);

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/get-product/${params.productSlug}`
      );
      setProduct({
        category: data?.product?.category,
        photo: data?.product?.photo, // Adjust based on your API response structure for photo
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        quantity: data.product.quantity,
        _id: data.product._id,
        shipping: data.product.shipping,
      });
      setId(data.product._id);
      setShipping(data.product.shipping);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-8 text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Product Details */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative w-full h-0" style={{ paddingBottom: "75%" }}>
                <img
                  src={product.photo}
                  alt={product.name}
                  className="w-full h-full object-contain absolute top-0 left-0"
                />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Category: {product?.category?.name}
              </p>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              {product.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                ₹{product.price}
              </p>
              {/* <div className="flex items-center">
                <Label htmlFor="quantity" className="sr-only">
                  Quantity
                </Label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
            
                    className="h-10 w-10 text-green-600"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-14 h-10 text-center border-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-10 w-10 text-green-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div> */}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => addToCart(product)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                className={`bg-white border-green-600 ${
                  isFavorite ? "text-red-500" : "text-green-600"
                }`}
                onClick={toggleFavorite}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-green-800">
            Similar Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {relatedProducts.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className="relative w-full h-0"
                  style={{ paddingBottom: "75%" }}
                >
                  <img
                    src={product.photo}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-contain"
                  />
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-base sm:text-lg text-green-700 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="font-bold mt-2 text-green-600">
                    ₹{product.price}
                  </p>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-green-50 text-green-600 border-green-600"
                  >
                    <Link href={`/shop/${product.slug}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
