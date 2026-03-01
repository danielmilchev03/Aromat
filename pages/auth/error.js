import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const errors = {
    Configuration: {
      title: 'Server Error',
      message: 'There is a problem with the server configuration. Please contact support.',
    },
    AccessDenied: {
      title: 'Access Denied',
      message: 'You do not have permission to sign in.',
    },
    Verification: {
      title: 'Verification Error',
      message: 'The verification link may have expired or already been used.',
    },
    Default: {
      title: 'Authentication Error',
      message: 'An unexpected error occurred. Please try again.',
    },
  };

  const { title, message } = errors[error] || errors.Default;

  return (
    <>
      <Head>
        <title>{title} — Aromat</title>
      </Head>
      <Navbar />

      <main className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-black mb-3">{title}</h1>
          <p className="text-gray-500 text-sm mb-8">{message}</p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-3 rounded-2xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
