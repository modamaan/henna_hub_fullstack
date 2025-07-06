import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "./context/Cart";
import { AuthProvider } from "./context/Auth";
import { SearchProvider } from "./context/Search";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Generate metadata for different pages
export async function generateMetadata({ params }: { params: { slug?: string } }) {
  const pathname = params?.slug || "";

  // Shop page metadata
  if (pathname === "shop") {
    return {
      title: "Shop Natural Henna Products Online - HennaHub",
      description:
        "Buy premium organic henna powder, mehndi cones, and natural hair dye online. Pure, chemical-free henna products for hair and body art. Fast delivery across India.",
      keywords:
        "buy henna online, natural henna powder, organic mehndi cones, pure henna for hair, natural hair dye, henna products India",
      openGraph: {
        title: "Shop Natural Henna Products Online - HennaHub",
        description:
          "Buy premium organic henna powder, mehndi cones, and natural hair dye online.",
        url: "https://hennahub.shop/shop",
        type: "website",
      },
    };
  }

  // Default metadata (homepage and others)
  return {
    title: {
      default: "HennaHub – Premium Organic Henna Products Online India",
      template: "%s | HennaHub",
    },
    description:
      "Buy pure and natural henna products online at HennaHub. Premium organic henna powder, mehndi cones, and natural hair dye. Fast delivery across India, 100% organic and chemical-free.",
    keywords: [
      "buy henna online India",
      "natural henna powder",
      "organic mehndi cones",
      "pure henna for hair",
      "natural hair dye",
      "mehndi design products",
      "organic henna paste",
      "chemical free henna",
      "henna for tattoos",
      "traditional mehndi",
    ],
    authors: [{ name: "HennaHub" }],
    creator: "HennaHub",
    publisher: "HennaHub",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://hennahub.shop"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://hennahub.shop",
      siteName: "HennaHub",
      title: "HennaHub – Premium Organic Henna Products Online India",
      description:
        "Buy pure and natural henna products online at HennaHub. Premium organic henna powder, mehndi cones, and natural hair dye. Fast delivery across India.",
      images: [
        {
          url: "/images/henna1.webp",
          width: 1200,
          height: 630,
          alt: "HennaHub - Premium Organic Henna Products",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "HennaHub – Premium Organic Henna Products Online India",
      description:
        "Buy pure and natural henna products online at HennaHub. Premium organic henna powder, mehndi cones, and natural hair dye.",
      images: ["/images/henna1.webp"],
      creator: "@hennahub",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#166534" />
        <link
          rel="apple-touch-icon"
          href="/images/favicon-9_imresizer192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-9_imresizer192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-9_imresizer192.png"
        />
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "HennaHub",
              url: "https://hennahub.shop",
              logo: "https://hennahub.shop/images/favicon-9_imresizer192.png",
              description: "Premium organic henna products online store",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
              },
            }),
          }}
        />
        {/* Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "HennaHub",
              url: "https://hennahub.shop",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://hennahub.shop/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
              {children}
              <Toaster />
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
