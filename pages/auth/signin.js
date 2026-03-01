import { getProviders, signIn, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SignIn({ providers, csrfToken }) {
  const router = useRouter();
  const { error } = router.query;

  const errorMessages = {
    OAuthAccountNotLinked:
      'This email is already associated with another account. Please sign in with the original provider.',
    OAuthCallback: 'Something went wrong during authentication. Please try again.',
    default: 'An error occurred during sign in. Please try again.',
  };

  return (
    <>
      <Head>
        <title>Sign In — Aromat</title>
      </Head>
      <Navbar />

      <main className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl text-black mb-3">Welcome</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sign in to save your favourite fragrances and build your personal collection.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">
              {errorMessages[error] || errorMessages.default}
            </div>
          )}

          {/* Provider buttons */}
          <div className="space-y-3">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium text-gray-700 shadow-sm"
                >
                  {provider.id === 'google' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  Continue with {provider.name}
                </button>
              ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
            By signing in, you agree to our{' '}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      providers: providers ?? {},
      csrfToken: csrfToken ?? null,
    },
  };
}
