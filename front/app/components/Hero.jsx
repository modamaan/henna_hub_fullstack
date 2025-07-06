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
          Premium Organic Henna Products Online India
        </h1>
        {/* <pre className="text-white" >{JSON.stringify(auth,null,4)}</pre> */}
        <p className="text-xl text-green-100 mb-6 max-w-2xl">
          Buy pure and natural henna powder, mehndi cones, and organic hair dye. 
          100% chemical-free products for beautiful, long-lasting results.
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex">
          <Button 
            size="lg" 
            className="bg-white text-green-800 hover:bg-green-100 w-full md:w-auto"
            onClick={handleShopNow}
            aria-label="Shop natural henna products"
          >
            Shop Natural Henna Products
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-white border-white bg-white/20 w-full md:w-auto"
            aria-label="Learn about henna benefits"
          >
            Learn About Henna Benefits
          </Button>
        </div>
        
        {/* SEO Content for Search Engines */}
        <div className="hidden">
          <h2>Buy Henna Online India</h2>
          <p>Natural henna powder, organic mehndi cones, pure henna for hair, natural hair dye, chemical free henna products</p>
        </div>
      </div>
      
      {/* Background Image with Alt Text */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={henna1}
          alt="Premium organic henna products - natural henna powder and mehndi cones"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
    </section>
  )
}
