"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import axios from "axios";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/testimonial/approved`
      );
      if (response.data.success) {
        setTestimonials(response.data.testimonials);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));

  if (loading) {
    return (
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            What Our Customers Say
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            What Our Customers Say
          </h2>
          <div className="text-center text-gray-600">
            <p>No testimonials available yet.</p>
            <p className="mt-2">Be the first to share your experience!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          What Our Customers Say
        </h2>
        <div className="relative">
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial._id}
                  className="flex justify-center"
                >
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-lg rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1 text-center">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-green-600 mb-1">
                            {testimonial.location}
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">
                        "{testimonial.text}"
                      </p>

                      <div className="relative">
                        <Image
                          src={testimonial.hennaImage}
                          alt={`Henna by ${testimonial.name}`}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg border border-green-100"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {testimonial.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-green-800 p-2 rounded-full shadow-lg" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-green-800 p-2 rounded-full shadow-lg" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
