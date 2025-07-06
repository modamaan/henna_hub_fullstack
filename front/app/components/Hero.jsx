"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import henna1 from '../../public/images/henna1.webp'
// import { useAuth } from "../context/Auth"

export default function Hero() {
  const router = useRouter()
  // const [auth, setAuth] = useAuth()
  
  const handleShopNow = () => {
    router.push('/shop')
  }
  
  return (
    <section className="relative h-[80vh] bg-gradient-to-r from-green-800 to-green-600 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-green-700/70" />
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Discover the Art of Henna
        </h1>
        {/* <pre className="text-white" >{JSON.stringify(auth,null,4)}</pre> */}
        <p className="text-xl text-green-100 mb-8 max-w-lg">
          Experience the beauty and tradition of natural henna products, crafted for your skin and soul.
        </p>
        <div className="space-x-4">
          <Button 
            size="lg" 
            className="bg-white text-green-800 hover:bg-green-100"
            onClick={handleShopNow}
          >
            Shop Now
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white bg-white/20">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
