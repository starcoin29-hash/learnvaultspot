import React from 'react';
import { getWebsiteSetting } from '../../../actions/settings';
import { Badge } from '../../../components/Badge';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { Mail, Phone, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ success?: string }>;
}

export default async function ContactPage({ searchParams }: Props) {
  const { success } = await searchParams;
  const settings = await getWebsiteSetting('contact_settings') || {
    email: 'info@learnvault.com',
    phone: '+234 800 000 0000',
    address: '123 Learn Vault Boulevard, Digital City',
  };

  const handleSendMessage = async (formData: FormData) => {
    'use server';
    const { redirect } = await import('next/navigation');
    redirect('/contact?success=true');
  };

  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Contact Us', href: '/contact' }]} />

        {/* Heading */}
        <div className="space-y-4">
          <Badge variant="secondary">Support</Badge>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900">
            Get in Touch
          </h1>
          <p className="text-zinc-500 font-sans text-sm sm:text-base leading-relaxed">
            Have questions about your purchases, download links, or content collaborations? Drop us a line.
          </p>
        </div>

        {/* Grid Split */}
        <div className="grid gap-8 md:grid-cols-12">
          
          {/* Info Details */}
          <div className="md:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200/50 bg-[#FAF7F0] p-6 space-y-6">
              <h2 className="font-serif text-lg font-bold">Contact Coordinates</h2>
              
              <div className="flex gap-4">
                <div className="p-2 bg-zinc-900 text-zinc-50 rounded-lg h-9 w-9 flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Email Address</h3>
                  <a href={`mailto:${settings.email}`} className="text-sm font-medium hover:underline text-zinc-700">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-2 bg-zinc-900 text-zinc-50 rounded-lg h-9 w-9 flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Phone Number</h3>
                  <a href={`tel:${settings.phone}`} className="text-sm font-medium hover:underline text-zinc-700">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-2 bg-zinc-900 text-zinc-50 rounded-lg h-9 w-9 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Headquarters</h3>
                  <p className="text-sm text-zinc-600 font-sans leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-lg font-bold mb-6">Send a Message</h2>
            
            <form action={handleSendMessage} className="space-y-4 font-sans">
              {success === 'true' && (
                <div className="rounded-lg bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-100">
                  ✓ Message successfully sent! We will get back to you shortly.
                </div>
              )}
              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-400 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-zinc-400 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your message here..."
                  className="flex w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-800"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
