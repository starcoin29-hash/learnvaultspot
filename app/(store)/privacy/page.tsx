import React from 'react';
import { Badge } from '../../../components/Badge';
import { Breadcrumbs } from '../../../components/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default function PrivacyPage() {
  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8 font-sans">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Privacy Policy', href: '/privacy' }]} />

        {/* Heading */}
        <div className="space-y-4">
          <Badge variant="secondary">Privacy Policy</Badge>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-xs">Last Updated: June 2026</p>
        </div>

        {/* Policy Text */}
        <div className="text-sm sm:text-base leading-relaxed text-zinc-700 space-y-6">
          <p>
            At <strong>Learn Vault</strong>, we value your privacy above all else. Since we require no customer accounts, we do not build customer profiles, maintain user tracking dashboards, or send promotional emails.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900 mt-8">1. Information We Collect</h2>
          <p>
            When purchasing a digital book through our guest checkout process, we collect only the necessary details required to fulfill your order and verify payment:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your Name (for licensing and billing reference)</li>
            <li>Your Email Address (to record your secure transaction and associate your digital book download license)</li>
            <li>Payment metadata returned by our payment processor, Flutterwave (e.g., Transaction ID, reference, status)</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-zinc-900 mt-8">2. Payment Processing Security</h2>
          <p>
            All checkout payments are processed securely via <strong>Flutterwave</strong>. We never store, process, or see your credit card or bank details. Flutterwave encrypts and handles your payment coordinates in full compliance with PCI-DSS guidelines.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900 mt-8">3. Digital Licensing & Watermarking</h2>
          <p>
            To prevent unauthorized distribution of copyright materials, downloaded PDF books are dynamically stamped with a visible license watermark containing your Name, Email, and Transaction ID. This license metadata is stored securely in our database to validate your single-use download token.
          </p>

          <h2 className="font-serif text-lg font-bold text-zinc-900 mt-8">4. Data Deletion</h2>
          <p>
            If you wish to have your transaction record removed from our bookstore logging database, you may contact us at <a href="mailto:info@learnvault.com" className="underline hover:text-zinc-900">info@learnvault.com</a>. Please note that deleting transaction logs will invalidate your dynamic download link tokens.
          </p>
        </div>

      </div>
    </div>
  );
}
