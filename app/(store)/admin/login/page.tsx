'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '../../../../schemas/auth';
import { loginAdmin } from '../../../../actions/auth';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { ShieldAlert, LogIn } from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAdmin(data);

      if (result.success) {
        router.push(redirectPath);
        router.refresh();
      } else {
        setError(result.error || 'Invalid credentials.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred during authentication.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md w-full bg-white border border-zinc-100 p-8 rounded-3xl shadow-sm space-y-6 font-sans">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center text-zinc-900">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-zinc-950">Administrator Access</h1>
          <p className="text-xs text-zinc-400">Enter credentials to unlock the administrative vault.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('username')}
            label="Username"
            placeholder="admin"
            error={errors.username?.message}
            disabled={isLoading}
          />

          <Input
            {...register('password')}
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            disabled={isLoading}
          />

          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Dashboard
            </Button>
          </div>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600">
            ← Return to public website
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-[80vh] flex items-center justify-center">
        <div className="text-sm text-zinc-400">Loading...</div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
