import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Testimonials() {
  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          What Our Customers Say
        </h2>
        <div className="relative">
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {[1, 2, 3].map((testimonial) => (
                <CarouselItem key={testimonial} className="flex justify-center">
                  <Card className="bg-white p-6 text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <CardContent>
                      <div className="flex justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4">
                        "The quality of these henna products is outstanding. My
                        designs have never looked better!"
                      </p>
                      <p className="font-semibold text-green-800">
                        - Happy Customer {testimonial}
                      </p>
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
