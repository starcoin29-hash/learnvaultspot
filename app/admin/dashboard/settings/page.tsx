import React from 'react';
import { getWebsiteSetting } from '../../../../actions/settings';
import { SettingsForm } from './_components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  // Fetch initial settings from DB
  const seoSettings = await getWebsiteSetting('seo_settings');
  const contactSettings = await getWebsiteSetting('contact_settings');
  const aboutSettings = await getWebsiteSetting('about_settings');

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">Website Settings</h1>
        <p className="text-xs text-zinc-400">Configure global metadata overrides, company history details, and support lines.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-150 p-6 md:p-8 shadow-sm">
        <SettingsForm
          seo={seoSettings}
          contact={contactSettings}
          about={aboutSettings}
        />
      </div>
    </div>
  );
}
