import React from 'react';
import { Badge } from '../../../components/Badge';
import { Breadcrumbs } from '../../../components/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default function TermsPage() {
  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 font-sans">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Terms & Conditions', href: '/terms' }]} />

        {/* Heading */}
        <div className="space-y-4">
          <Badge variant="secondary">Terms & Conditions</Badge>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900">
            Terms & Conditions
          </h1>
          <p className="text-zinc-400 text-xs">Last Updated: June 2026</p>
        </div>

        {/* Terms Text */}
        <div className="text-sm sm:text-base leading-relaxed text-zinc-700 space-y-6">
          <p>
            Welcome to <strong>Learn Vault</strong>. By browsing our website, purchasing our digital books, or reading our blog, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900 mt-8">1. Digital Products License</h2>
          <p>
            Upon successful payment verification for any digital book, Learn Vault grants you a non-exclusive, non-transferable, revocable license to download and view the book for your personal, non-commercial use only.
          </p>
          <p className="bg-[#FAF7F0] border border-zinc-200/50 p-4 rounded-xl text-sm italic text-zinc-600">
            <strong>License Restriction:</strong> Sharing, re-selling, redistributing, or copying any digital book files purchased from Learn Vault is strictly prohibited. Every PDF is watermarked with the purchaser's name, email, and order details.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900 mt-8">2. Refunds Policy</h2>
          <p>
            Due to the immediate digital nature of our products, all digital ebook purchases on Learn Vault are final and non-refundable. If you experience technical issues downloading your files, please contact us immediately at <a href="mailto:info@learnvault.com" className="underline hover:text-zinc-900">info@learnvault.com</a> with your transaction reference.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900 mt-8">3. Guest Checkout Accountless Policy</h2>
          <p>
            Learn Vault does not manage customer accounts. All purchases are finalized via guest checkouts. Your download links are linked to a cryptographically secure token valid for up to 10 separate downloads. You are solely responsible for saving and backing up your downloaded files immediately after checkout.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900 mt-8">4. Blog Content Disclaimer</h2>
          <p>
            The information published on the Learn Vault blog across Education, Wealth, Health, and Relationships is for informational and educational purposes only. It should not be construed as professional financial, legal, or medical advice.
          </p>
        </div>

      </div>
    </div>
  );
}
