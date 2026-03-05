import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
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
        <Navbar />

        {/* Header */}
        <section className="pt-28 pb-16 bg-pattern">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-5">
            <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Get In Touch</p>
            <h1 className="font-serif text-5xl md:text-6xl text-black">Contact Us</h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
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
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Whether you want to report an issue, suggest a feature, or simply say hello —
                    we value every message.
                  </p>
                </div>

                <div className="space-y-6 text-sm">
                  <div className="bg-light-bg rounded-xl p-4 space-y-1">
                    <p className="font-serif text-accent tracking-wider text-[10px] uppercase">Email</p>
                    <p className="text-gray-700">contact@aromat.app</p>
                  </div>
                  <div className="bg-light-bg rounded-xl p-4 space-y-1">
                    <p className="font-serif text-accent tracking-wider text-[10px] uppercase">Location</p>
                    <p className="text-gray-700">The Internet, Worldwide</p>
                  </div>
                  <div className="bg-light-bg rounded-xl p-4 space-y-1">
                    <p className="font-serif text-accent tracking-wider text-[10px] uppercase">Response Time</p>
                    <p className="text-gray-700">Within 48 hours</p>
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div className="md:col-span-3">
                {submitted ? (
                  <div className="text-center py-16 space-y-6 rounded-2xl border border-gray-100 bg-light-bg">
                    <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xl">✓</div>
                    <h3 className="font-serif text-2xl text-black">Message Sent</h3>
                    <p className="text-gray-500">Thank you for reaching out. We'll get back to you soon.</p>
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                      className="btn-secondary text-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block font-serif text-[10px] text-gray-500 tracking-[0.15em] uppercase">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-black focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block font-serif text-[10px] text-gray-500 tracking-[0.15em] uppercase">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-black focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-serif text-[10px] text-gray-500 tracking-[0.15em] uppercase">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-black focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none transition-all"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="bug">Report a Bug</option>
                        <option value="partnership">Partnership</option>
                        <option value="data">Data Correction</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-serif text-[10px] text-gray-500 tracking-[0.15em] uppercase">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-black focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none transition-all resize-none"
                        placeholder="Tell us what's on your mind..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary"
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
        <section className="bg-light-bg py-16">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-serif text-3xl text-black">Explore Fragrances</h2>
            <p className="text-gray-500 text-base">While you wait for our reply, discover something beautiful.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/gallery" className="btn-secondary">Browse Gallery</Link>
              <Link href="/gallery" className="btn-primary">Top Rated</Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
