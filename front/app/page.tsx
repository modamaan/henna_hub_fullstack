import React from 'react'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Testimonials from './components/Testimonials';
import AboutUs from './components/AboutUs';
import NewsletterSubscription from './components/NewsletterSubscription';
import Footer from './components/Footer';

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
    <Navbar />
    <Hero />
    <FeaturedProducts />
    <Testimonials />
    <AboutUs />
    <NewsletterSubscription />
    <Footer />
  </div>
  )
}

export default page