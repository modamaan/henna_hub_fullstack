"use client";
import { useState, useEffect } from "react";
import { Star, Check, X, Eye, Trash2 } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/testimonial/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );
      if (response.data.success) {
        setTestimonials(response.data.testimonials);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        variant: "destructive",
        title: "Error fetching testimonials",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/testimonial/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );
      if (response.data.success) {
        toast({
          title: "Testimonial approved successfully",
        });
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error approving testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error approving testimonial",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/testimonial/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );
      if (response.data.success) {
        toast({
          title: "Testimonial deleted successfully",
        });
        fetchTestimonials();
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error deleting testimonial",
      });
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-3/4 bg-gray-100">
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-gray-800">Testimonials Management</h1>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testimonials.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No testimonials found
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testimonials.map((testimonial) => (
                            <TableRow key={testimonial._id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{testimonial.name}</p>
                                  <p className="text-sm text-gray-500 truncate max-w-32">
                                    {testimonial.text}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>{testimonial.location}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {renderStars(testimonial.rating)}
                                  <span className="text-sm text-gray-600 ml-1">
                                    ({testimonial.rating})
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={testimonial.isApproved ? "default" : "secondary"}
                                >
                                  {testimonial.isApproved ? "Approved" : "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(testimonial.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedTestimonial(testimonial)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>Testimonial Details</DialogTitle>
                                        <DialogDescription>
                                          View complete testimonial information
                                        </DialogDescription>
                                      </DialogHeader>
                                      {selectedTestimonial && (
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-4">
                                            <div>
                                              <h3 className="font-semibold">
                                                {selectedTestimonial.name}
                                              </h3>
                                              <p className="text-sm text-gray-600">
                                                {selectedTestimonial.location}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              {renderStars(selectedTestimonial.rating)}
                                              <span className="text-sm text-gray-600 ml-1">
                                                ({selectedTestimonial.rating}/5)
                                              </span>
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-gray-700 italic">
                                              "{selectedTestimonial.text}"
                                            </p>
                                          </div>
                                          <div className="relative">
                                            <Image
                                              src={selectedTestimonial.hennaImage}
                                              alt={`Henna by ${selectedTestimonial.name}`}
                                              width={400}
                                              height={300}
                                              className="w-full h-64 object-cover rounded-lg"
                                            />
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge
                                              variant={
                                                selectedTestimonial.isApproved
                                                  ? "default"
                                                  : "secondary"
                                              }
                                            >
                                              {selectedTestimonial.isApproved
                                                ? "Approved"
                                                : "Pending"}
                                            </Badge>
                                            <span className="text-sm text-gray-500">
                                              Submitted on{" "}
                                              {new Date(
                                                selectedTestimonial.createdAt
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </DialogContent>
                                  </Dialog>

                                  {!testimonial.isApproved && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApprove(testimonial._id)}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this testimonial? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(testimonial._id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 