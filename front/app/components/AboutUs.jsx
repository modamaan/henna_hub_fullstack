import Image from "next/image"
import { Button } from "@/components/ui/button"
import henna from '../../public/images/henna.jpg'

export default function AboutUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <Image
              src={henna}
              alt="Henna Artistry"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Our Commitment to Quality</h2>
            <p className="text-gray-600 mb-6">
              At Henna Haven, we're dedicated to providing the highest quality, all-natural henna products.
              Our commitment to authenticity and tradition ensures that you receive only the best for your
              skin and your art.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Learn More About Us</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
