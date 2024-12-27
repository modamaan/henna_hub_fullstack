import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Henna Haven</h3>
            <p className="text-green-200">
              Bringing the beauty of henna to your doorstep with premium, natural products.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-green-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-200 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-green-200 hover:text-white transition-colors">
                <Instagram />
              </Link>
              <Link href="#" className="text-green-200 hover:text-white transition-colors">
                <Facebook />
              </Link>
              <Link href="#" className="text-green-200 hover:text-white transition-colors">
                <Twitter />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-700 text-center text-green-200">
          <p>&copy; 2023 Henna Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
