import { getSession } from 'next-auth/react';
import { useSession, signOut } from 'next-auth/react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Profile() {
  const { data: session } = useSession();

  if (!session) return null;

  const user = session.user;
  const joinDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Head>
        <title>Profile — Aromat</title>
      </Head>
      <Navbar />

      <main className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Profile header */}
          <div className="flex items-center gap-6 mb-12">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="w-20 h-20 rounded-full ring-4 ring-gray-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-accent/10 text-accent flex items-center justify-center text-2xl font-serif">
                {user.name?.[0] || user.email?.[0] || '?'}
              </div>
            )}
            <div>
              <h1 className="font-serif text-2xl text-black">{user.name}</h1>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            </div>
          </div>

          {/* Account info card */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 mb-6">
            <h2 className="font-serif text-lg text-black mb-6">Account</h2>
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="text-sm text-gray-900">{user.name || '—'}</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Sign-in method</dt>
                <dd className="text-sm text-gray-900">Google</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm text-gray-500">Member since</dt>
                <dd className="text-sm text-gray-900">{joinDate}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-6 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
