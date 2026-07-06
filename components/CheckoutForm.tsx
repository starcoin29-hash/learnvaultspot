'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ShoppingCart } from 'lucide-react';

const checkoutFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  bookId: string;
  bookTitle: string;
  price: string;
  discountPrice?: string | null;
}

export function CheckoutForm({ bookId, bookTitle, price, discountPrice }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          email: data.email,
          name: data.name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Checkout initialization failed.');
      }

      // Redirect to Flutterwave secure payment page
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('Payment gateway link was not generated.');
      }
    } catch (err: any) {
      console.error('Checkout redirect error:', err);
      setError(err.message || 'Payment server connection error.');
      setIsLoading(false);
    }
  };

  const finalPrice = discountPrice ? parseFloat(discountPrice) : parseFloat(price);

  return (
    <div className="rounded-2xl border border-zinc-200/50 bg-[#FAF7F0] p-6 space-y-6 font-sans">
      <div className="space-y-1">
        <h3 className="font-serif text-lg font-bold text-zinc-900">Instant Access</h3>
        <p className="text-xs text-zinc-500">
          Enter your name and email to purchase as a guest. Your secure download will load instantly after payment.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('name')}
          label="Your Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          disabled={isLoading}
        />

        <Input
          {...register('email')}
          label="Your Email Address"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          disabled={isLoading}
        />

        <div className="pt-2">
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Pay ₦{finalPrice.toLocaleString()} & Download
          </Button>
        </div>
      </form>
    </div>
  );
}
