'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../../../../components/ui/Card';
import { Input } from '../../../../../components/ui/Input';
import { Textarea } from '../../../../../components/ui/Textarea';
import { Button } from '../../../../../components/ui/Button';
import { updateWebsiteSetting } from '../../../../../actions/settings';
import { Save, CheckCircle2 } from 'lucide-react';

interface SettingsFormProps {
  seo: any;
  contact: any;
  about: any;
}

export function SettingsForm({ seo, contact, about }: SettingsFormProps) {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'seo' | 'contact' | 'about'>('seo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // States for each section
  const [seoState, setSeoState] = useState({
    siteName: seo?.siteName || 'Learn Vault',
    defaultTitle: seo?.defaultTitle || 'Learn Vault | Bookstore & Blog',
    defaultDescription: seo?.defaultDescription || 'Curated digital bookstore and blog.',
    twitterHandle: seo?.twitterHandle || '@learnvault',
  });

  const [contactState, setContactState] = useState({
    email: contact?.email || 'info@learnvault.com',
    phone: contact?.phone || '+234 800 000 0000',
    address: contact?.address || '123 Learn Vault Boulevard',
  });

  const [aboutState, setAboutState] = useState({
    title: about?.title || 'About Learn Vault',
    story: about?.story || '',
    mission: about?.mission || '',
  });

  const handleSave = async (key: string, value: any) => {
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await updateWebsiteSetting(key, value);
      if (res.success) {
        setSuccess(`Successfully updated ${key.replace('_', ' ').toUpperCase()}!`);
        router.refresh();
      } else {
        setError(res.error || 'Failed to save settings.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Messages */}
      {success && (
        <div className="rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-800 border border-emerald-100 flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-200">
        {[
          { id: 'seo', label: 'SEO Settings' },
          { id: 'contact', label: 'Contact Coordinates' },
          { id: 'about', label: 'About Story & Mission' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id as any);
              setSuccess(null);
              setError(null);
            }}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-zinc-900 text-zinc-900 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'seo' && (
        <Card>
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold border-b border-zinc-150 pb-2">Global Search Engine Configs</h2>
            
            <Input
              label="Site Name"
              value={seoState.siteName}
              onChange={(e) => setSeoState({ ...seoState, siteName: e.target.value })}
              disabled={isSubmitting}
            />

            <Input
              label="Default SEO Title"
              value={seoState.defaultTitle}
              onChange={(e) => setSeoState({ ...seoState, defaultTitle: e.target.value })}
              disabled={isSubmitting}
            />

            <Textarea
              label="Default SEO Meta Description"
              value={seoState.defaultDescription}
              onChange={(e) => setSeoState({ ...seoState, defaultDescription: e.target.value })}
              rows={3}
              disabled={isSubmitting}
            />

            <Input
              label="Twitter Handle"
              value={seoState.twitterHandle}
              onChange={(e) => setSeoState({ ...seoState, twitterHandle: e.target.value })}
              disabled={isSubmitting}
            />

            <div className="pt-2">
              <Button onClick={() => handleSave('seo_settings', seoState)} isLoading={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Save SEO Configurations
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'contact' && (
        <Card>
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold border-b border-zinc-150 pb-2">Public Contact Coordinates</h2>
            
            <Input
              label="Email Address"
              type="email"
              value={contactState.email}
              onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
              disabled={isSubmitting}
            />

            <Input
              label="Phone Number"
              value={contactState.phone}
              onChange={(e) => setContactState({ ...contactState, phone: e.target.value })}
              disabled={isSubmitting}
            />

            <Textarea
              label="HQ Physical Address"
              value={contactState.address}
              onChange={(e) => setContactState({ ...contactState, address: e.target.value })}
              rows={3}
              disabled={isSubmitting}
            />

            <div className="pt-2">
              <Button onClick={() => handleSave('contact_settings', contactState)} isLoading={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Save Contact Coordinates
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'about' && (
        <Card>
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold border-b border-zinc-150 pb-2">Company Story & Mission</h2>
            
            <Input
              label="About Heading Title"
              value={aboutState.title}
              onChange={(e) => setAboutState({ ...aboutState, title: e.target.value })}
              disabled={isSubmitting}
            />

            <Textarea
              label="Story Content"
              value={aboutState.story}
              onChange={(e) => setAboutState({ ...aboutState, story: e.target.value })}
              rows={8}
              disabled={isSubmitting}
            />

            <Textarea
              label="Mission Statement"
              value={aboutState.mission}
              onChange={(e) => setAboutState({ ...aboutState, mission: e.target.value })}
              rows={4}
              disabled={isSubmitting}
            />

            <div className="pt-2">
              <Button onClick={() => handleSave('about_settings', aboutState)} isLoading={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Save About Story
              </Button>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
}
export default SettingsForm;
