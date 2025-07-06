"use client";
import { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function TestimonialPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    text: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Image size should be less than 10MB",
        });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.text.trim()) newErrors.text = "Testimonial text is required";
    if (rating === 0) newErrors.rating = "Please select a rating";
    if (!selectedImage) newErrors.image = "Henna image is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("rating", rating);
        formDataToSend.append("text", formData.text);
        formDataToSend.append("hennaImage", selectedImage);

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/testimonial/create`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          toast({
            title: res.data.message,
          });
          // Reset form
          setFormData({ name: "", location: "", text: "" });
          setRating(0);
          setSelectedImage(null);
          setImagePreview(null);
          setErrors({});
        } else {
          toast({
            variant: "destructive",
            title: res.data.message,
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: error.response?.data?.error || "Something went wrong",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
      toast({
        variant: "destructive",
        title: "Please fill all required fields",
      });
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setRating(index + 1)}
        onMouseEnter={() => setHoveredRating(index + 1)}
        onMouseLeave={() => setHoveredRating(0)}
        className="focus:outline-none"
      >
        <Star
          className={`w-8 h-8 transition-colors ${
            index < (hoveredRating || rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      </button>
    ));
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Share Your Experience
            </CardTitle>
            <CardDescription className="text-center">
              Tell us about your henna experience and share your beautiful designs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm">{errors.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex items-center gap-2">
                  {renderStars()}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 && `${rating} out of 5`}
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-red-500 text-sm">{errors.rating}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Your Testimonial *</Label>
                <Textarea
                  id="text"
                  name="text"
                  placeholder="Share your experience with our henna products..."
                  value={formData.text}
                  onChange={handleInputChange}
                  rows={4}
                />
                {errors.text && (
                  <p className="text-red-500 text-sm">{errors.text}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hennaImage">Henna Design Image *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                      </p>
                      <Input
                        id="hennaImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-4"
                      />
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Testimonial"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
