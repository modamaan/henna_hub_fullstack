"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "../context/Auth";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/Cart";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { toast } = useToast();
  // const [cart, setCart] = useState([]);
  const [cart, setCart] = useCart();
  // console.log("NavbartCart", cart);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const isLoggedIn = auth?.user != null;
  const router = useRouter();

  // remove cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };
  // update quentity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  // get total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  // cart content
  const CartContent = () => (
    <div className="space-y-4">
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/product-photo/${item._id}`}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 border rounded"
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span>{item.quantity}</span>
                <button
                  className="p-2 border rounded"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center font-bold pt-4 border-t">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <button className="w-full p-2 bg-gray-900 text-white rounded">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );

  // logout function
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast({
      title: "Logout successfully",
    });
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-800">
          Henna Haven
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-green-700 hover:text-green-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-green-700 hover:text-green-500 transition-colors"
          >
            Shop
          </Link>
          <Link
            href="about"
            className="text-green-700 hover:text-green-500 transition-colors"
          >
            About
          </Link>
          <Link
            href="contact"
            className="text-green-700 hover:text-green-500 transition-colors"
          >
            Contact
          </Link>
        </nav>
        {/* new  */}
        <div className="flex gap-4">
          {!auth.user ? (
            <>
              <Link href="/login" className="hidden md:inline-flex">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register" className="hidden md:inline-flex">
                <Button variant="outline">Register</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden md:inline-flex">
                  <User className="mr-2 h-4 w-4" />
                  {auth?.user?.name || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    href={`/dashboard/${
                      auth?.user?.role === 1 ? "admin" : "user"
                    }`}
                    className="flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* Cart Button */}
          <Button
            variant="outline"
            className="hidden md:inline-flex"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart ({cart.length})
          </Button>
        </div>
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <nav className="flex flex-col space-y-3 p-4">
            <Link
              href="/"
              className="text-green-700 hover:text-green-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-green-700 hover:text-green-500 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-green-700 hover:text-green-500 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-green-700 hover:text-green-500 transition-colors"
            >
              Contact
            </Link>

            {!auth.user ? (
              <>
                <Link href="/login" className="w-full justify-center">
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="w-full justify-center">
                  <Button variant="outline" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-center">
                    <User className="mr-2 h-4 w-4" />
                    {auth?.user?.name || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link
                      href={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className="flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    <span className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {/* Cart Button */}
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart ({cart.length})
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
