import React from 'react'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Testimonials from './components/Testimonials';
import AboutUs from './components/AboutUs';
import NewsletterSubscription from './components/NewsletterSubscription';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

const HomePage = () => {
  return (
    <>
      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Navbar />
        
        {/* Hero Section */}
        <section aria-label="Hero">
          <Hero />
        </section>
        
        {/* Featured Products Section */}
        <section aria-label="Featured Products" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
              Premium Organic Henna Products
            </h2>
            <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Discover our collection of pure, natural henna products including organic henna powder, 
              mehndi cones, and natural hair dye. All products are 100% chemical-free and sourced from 
              the finest natural ingredients.
            </p>
            <FeaturedProducts />
          </div>
        </section>
        
        {/* SEO Content Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
                Why Choose HennaHub for Natural Henna Products?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-semibold text-green-800 mb-4">
                    Pure Organic Henna Powder
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Our natural henna powder is sourced from the finest Lawsonia inermis plants, 
                    ensuring the highest quality and purest color. Perfect for hair dyeing, 
                    mehndi designs, and traditional applications.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• 100% organic and chemical-free</li>
                    <li>• Rich, natural color development</li>
                    <li>• Safe for all skin types</li>
                    <li>• Traditional preparation methods</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-green-800 mb-4">
                    Premium Mehndi Cones
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Experience the art of mehndi with our professional-grade mehndi cones. 
                    Each cone is carefully crafted for precise application and long-lasting designs.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Ready-to-use mehndi paste</li>
                    <li>• Smooth application texture</li>
                    <li>• Long-lasting color results</li>
                    <li>• Professional quality finish</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-green-50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-800 mb-4">
                  Natural Hair Dye Benefits
                </h3>
                <p className="text-gray-700 mb-4">
                  Our pure henna for hair provides natural conditioning while delivering rich, 
                  vibrant color. Unlike chemical dyes, henna strengthens hair and adds natural shine.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Natural Conditioning</div>
                    <div className="text-gray-600">Strengthens hair naturally</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Chemical-Free</div>
                    <div className="text-gray-600">No harmful ingredients</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-800">Long-Lasting Color</div>
                    <div className="text-gray-600">Rich, vibrant results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section aria-label="Customer Testimonials" className="py-16">
          <Testimonials />
        </section>
        
        {/* About Us Section */}
        <section aria-label="About HennaHub" className="py-16 bg-green-50">
          <AboutUs />
        </section>
        
        {/* Newsletter Section */}
        <section aria-label="Newsletter Subscription" className="py-16">
          <NewsletterSubscription />
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
      
      {/* Structured Data for Product Collection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "HennaHub Product Collection",
            "description": "Premium organic henna products including natural henna powder, mehndi cones, and natural hair dye",
            "url": "https://hennahub.shop/shop",
            "numberOfItems": 20,
            "itemListElement": [
              {
                "@type": "Product",
                "name": "Organic Henna Powder",
                "description": "Pure natural henna powder for hair and body art",
                "url": "https://hennahub.shop/shop/organic-henna-powder",
                "category": "Natural Hair Dye"
              },
              {
                "@type": "Product", 
                "name": "Mehndi Cones",
                "description": "Professional mehndi cones for traditional designs",
                "url": "https://hennahub.shop/shop/mehndi-cones",
                "category": "Body Art"
              }
            ]
          })
        }}
      />
    </>
  )
}

export default HomePage