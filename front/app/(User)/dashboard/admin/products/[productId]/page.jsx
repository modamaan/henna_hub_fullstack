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
  Trash2,
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

const shippingOptions = [
  { _id: "1", name: "Yes" },
  { _id: "2", name: "No" },
];

// Assume these are defined elsewhere in your application

export default function UpdateProduct({ params }) {
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
  });
  const [shipping, setShipping] = useState("");
  const [id, setId] = useState("");

  // console.log("Products list", product);
  // console.log("Products old shipping", product.shipping);
  // console.log("Products new shipping", shipping);
  // console.log("Products category", product.category.name);

  //   console.log("Params",params.productId)

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

  // get singleProduct

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/get-product/${params.productId}`
      );
      setProduct({
        category: data?.product?.category,
        photo: data?.product?.photo, // Adjust based on your API response structure for photo
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        quantity: data.product.quantity,
      });
      setId(data.product._id);
      setShipping(data.product.shipping);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, []);

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
      toast({
        title: "Something went wrong in getting category",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // update
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Product to be created:", product);
    // Here you would typically send the data to your backend
    const { name, description, price, quantity, photo, category, shipping } =
      product;
    // Validate fields
    if (!name || !description || !price || !quantity || !photo || !category) {
      let errorMessage = "The following fields are required: ";
      if (!name) errorMessage += "Name, ";
      if (!description) errorMessage += "Description, ";
      if (!price) errorMessage += "Price, ";
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

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/update-product/${id}`,
        productData
      );

      console.log("update product database", data);

      if (data?.success) {
        toast({
          title: data.message,
          variant: "success",
        });
        router.push("/dashboard/admin/products");
      } else {
        toast({
          title: "Product updated Successfully",
          variant: "success",
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

  const handleDelete = async () => {
    try {
      let answer = window.prompt(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/delete-product/${id}`
      );
      toast({
        title: "Product deleted Successfully",
        variant: "success",
      });
      router.push("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast({
        title: "something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="space-y-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 -ml-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <CardTitle className="text-xl sm:text-2xl font-bold text-center text-green-800">
                  Update Product
                </CardTitle>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="hover:bg-red-200 hover:text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                </Button>
              </div>
            </CardHeader>
            {/*  */}
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Select a Category</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                    value={product.category}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={product.category.name || "Select category"}
                      />
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
                            src={product.photo}
                            alt="Product preview"
                            className="max-w-full max-h-full object-contain" // Ensure the image fits within the container
                          />
                          <span className="mt-2 text-sm text-gray-600">
                            {product.photo.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center w-full h-full">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/product-photo/${id}`}
                            alt="Product preview"
                            className="max-w-full max-h-full object-contain" // Ensure the image fits within the container
                          />
                          <span className="mt-2 text-sm text-red-600">
                            {"{Unknown Photo} Please select new photo"}
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      value={product.quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping">Shipping</Label>
                  <Select
                    value={shipping._id} // Ensure shipping is a valid option
                    onValueChange={(value) =>
                      handleSelectChange("shipping", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={shipping || "Select shipping"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingOptions.map((option) => (
                        <SelectItem key={option._id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Update Product
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
