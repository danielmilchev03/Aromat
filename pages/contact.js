import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app this would send to an API
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Contact | Aromat</title>
        <meta name="description" content="Get in touch with the Aromat team." />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl text-black hover:text-accent transition-colors">
              Aromat
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/gallery" className="text-gray-600 hover:text-black transition-colors">Gallery</Link>
              <Link href="/search" className="text-gray-600 hover:text-black transition-colors">Search</Link>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-accent"></div>
              <p className="text-accent text-sm font-serif tracking-widest">GET IN TOUCH</p>
              <div className="h-px w-12 bg-accent"></div>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-black">Contact Us</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Have a question, suggestion, or partnership inquiry? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-5 gap-16">
              {/* Info Column */}
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-black">Reach Out</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Whether you want to report an issue, suggest a feature, or simply say hello —
                    we value every message.
                  </p>
                </div>

                <div className="space-y-6 text-sm">
                  <div className="space-y-1">
                    <p className="font-serif text-accent tracking-wider text-xs uppercase">Email</p>
                    <p className="text-gray-700">contact@aromat.app</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif text-accent tracking-wider text-xs uppercase">Location</p>
                    <p className="text-gray-700">The Internet, Worldwide</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif text-accent tracking-wider text-xs uppercase">Response Time</p>
                    <p className="text-gray-700">Within 48 hours</p>
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div className="md:col-span-3">
                {submitted ? (
                  <div className="text-center py-16 space-y-6 border border-gray-200 bg-gray-50">
                    <div className="text-5xl text-accent">✓</div>
                    <h3 className="font-serif text-2xl text-black">Message Sent</h3>
                    <p className="text-gray-600">Thank you for reaching out. We'll get back to you soon.</p>
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-serif text-sm hover:border-accent hover:text-accent transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-serif text-gray-700 tracking-wider uppercase text-xs">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:border-accent focus:outline-none transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-serif text-gray-700 tracking-wider uppercase text-xs">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:border-accent focus:outline-none transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-serif text-gray-700 tracking-wider uppercase text-xs">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:border-accent focus:outline-none transition-colors"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="bug">Report a Bug</option>
                        <option value="partnership">Partnership</option>
                        <option value="data">Data Correction</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-serif text-gray-700 tracking-wider uppercase text-xs">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:border-accent focus:outline-none transition-colors resize-none"
                        placeholder="Tell us what's on your mind..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-10 py-3 bg-accent text-white font-serif hover:bg-yellow-600 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 border-t border-gray-200 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Explore Fragrances</h2>
            <p className="text-gray-600 text-lg">While you wait for our reply, discover something beautiful.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/gallery" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                Browse Gallery
              </Link>
              <Link href="/collections/top-rated" className="px-8 py-3 border-2 border-accent text-accent font-serif hover:bg-accent hover:text-white transition-colors">
                Top Rated
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
