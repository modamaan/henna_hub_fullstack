import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSubscription() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">Stay Connected</h2>
        <p className="text-gray-600 mb-6 text-center">
          Subscribe to our newsletter for exclusive offers, henna tips, and more!
        </p>
        <form className="flex flex-col sm:flex-row gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-grow border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}
