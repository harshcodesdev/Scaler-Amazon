'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function SignIn() {
  const router = useRouter();
  const { signInUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sign in');

      signInUser(
        { id: data.user.id, email: data.user.email, name: data.user.name },
        data.token
      );
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white flex flex-col items-center pt-8'>
      <Link href='/'>
        <Image src='/amazon-logo.png' alt='Amazon' width={100} height={30} className='mb-4 object-contain' />
      </Link>

      <div className='w-[350px] border border-gray-300 rounded p-6 shadow-sm'>
        <h1 className='text-3xl font-normal mb-4'>Sign in</h1>

        {error && (
          <div className='mb-4 text-red-600 text-sm border-l-4 border-red-600 pl-2'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-bold mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-gray-400 rounded px-3 py-1 outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-bold mb-1'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border border-gray-400 rounded px-3 py-1 outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-[#F3A847] hover:bg-[#e49733] border border-[#a88734] text-black py-1.5 rounded-md shadow-sm disabled:opacity-50'
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        <p className='text-xs mt-4'>
          By continuing, you agree to Amazon&apos;s Conditions of Use and Privacy Notice.
        </p>
      </div>

      <div className='w-[350px] mt-6 flex items-center justify-between text-gray-500 text-xs'>
        <div className='w-1/3 border-b border-gray-300' />
        <span>New to Amazon?</span>
        <div className='w-1/3 border-b border-gray-300' />
      </div>

      <Link
        href='/signup'
        className='w-[350px] text-center mt-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 py-1.5 rounded-md shadow-sm text-sm'
      >
        Create your Amazon account
      </Link>
    </div>
  );
}