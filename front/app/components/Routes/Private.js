"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/Auth";
import axios from "axios";
import { useToast } from "@/hooks/use-toast"; // Shadcn toast hook
import Spinner from "../Spinner";

export default function PrivateRoute({ children }) { // Accept children as prop
  const { toast } = useToast(); // Destructure the toast function
  const [ok, setOk] = useState(false);
  const [auth] = useAuth(); // Adjusted to only get auth

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/auth/user-auth');
        console.log("Response of private route", res);

        if (res.data.ok) {
          setOk(true); // User is authorized, allow access
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
          description: "Something went wrong while checking user access.",
          variant: "destructive",
        });
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token, toast]);

  return ok ? children : <Spinner />; // Return children instead of Outlet
}


// // components/Routes/PrivateRoute.js
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const PrivateRoute = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     // Replace this with your authentication check
//     const checkAuth = async () => {
//       // Example: Check auth from local storage or API
//       const token = localStorage.getItem('auth'); // Example token check
//       if (token) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//         router.push('/login'); // Redirect to login page if not authenticated
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, [router]);

//   if (loading) {
//     return <div><Spinner/></div>; // Optionally show a loading indicator
//   }

//   return isAuthenticated ? children : null;
// };

// export default PrivateRoute;

