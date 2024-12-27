// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Spinner = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000); // Redirects after 3 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      className="w-16 h-16 border-4 border-t-4 border-green-500 border-solid rounded-full"
      style={{
        animation: 'spin 1s linear infinite, circling 2s ease-in-out infinite',
      }}
    ></div>

    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes circling {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(360deg) translateX(30px); }
        100% { transform: rotate(720deg); }
      }
    `}</style>
  </div>
  );
};

export default Spinner;

