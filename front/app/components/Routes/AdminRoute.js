"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/Auth";
import axios from "axios";
import { useToast } from "@/hooks/use-toast"; // Shadcn toast hook
import Spinner from "../Spinner";

export default function AdminRoute({ children }) { // Accept children as prop
  const { toast } = useToast(); // Destructure the toast function
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin-auth`);
        console.log("Response of Admin route", res);
      
        if (res.data.ok) {
          setOk(true); // User is an admin, allow access
        } else {
          setOk(false);
          // Show a toast if the access is unauthorized
          toast({
            title: "Unauthorized Access",
            description: "You do not have permission to access this page.",
            variant: "destructive", // Use destructive to indicate an error
          });
        }
      } catch (error) {
        setOk(false);
        console.error("Error in authCheck:", error);
        // Show a toast if there's an error (e.g., 401 or network error)
        toast({
          title: "Error",
          description: "Something went wrong while checking admin access.",
          variant: "destructive",
        });
      }
    };
    

    if (auth?.token) authCheck();
  }, [auth?.token, toast]);

  return ok ? children : <Spinner />; // Return children instead of Outlet
}
