import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutPage = () => (
  <>
    <Navbar />
    {/* SEO Content Section */}
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Why Choose HennaHub for Natural Henna Products?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Premium Quality Assurance
              </h3>
              <p className="text-gray-600 mb-4">
                Every product in our collection undergoes rigorous quality testing to ensure 
                you receive only the finest natural henna products. Our organic henna powder 
                and mehndi cones meet the highest standards of purity and effectiveness.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Fast Delivery Across India
              </h3>
              <p className="text-gray-600 mb-4">
                We offer quick and reliable delivery services across all major cities in India. 
                Your natural henna products will reach you safely and promptly, ensuring you 
                can start your henna journey without delay.
              </p>
            </div>
          </div>
          <div className="bg-green-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-green-800 mb-4">
              Natural Henna Benefits
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">For Hair:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Natural hair conditioning and strengthening</li>
                  <li>• Chemical-free hair coloring</li>
                  <li>• Adds natural shine and volume</li>
                  <li>• Prevents hair fall and dandruff</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-700 mb-2">For Body Art:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Safe for all skin types</li>
                  <li>• Long-lasting beautiful designs</li>
                  <li>• Natural cooling properties</li>
                  <li>• Traditional and modern applications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* FAQ Section for SEO */}
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions About Natural Henna Products
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                How to use natural henna powder for hair?
              </h3>
              <p className="text-gray-600">
                Mix the organic henna powder with warm water and let it rest for 4-6 hours. 
                Apply to clean, dry hair and leave for 2-4 hours. Rinse thoroughly with water.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Are your mehndi cones ready to use?
              </h3>
              <p className="text-gray-600">
                Yes, our organic mehndi cones are pre-mixed and ready for immediate application. 
                Simply cut the tip and start creating beautiful designs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                How long does henna color last?
              </h3>
              <p className="text-gray-600">
                Natural henna color typically lasts 2-4 weeks on skin and 6-8 weeks on hair, 
                depending on application technique and aftercare.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </>
);

export default AboutPage;
