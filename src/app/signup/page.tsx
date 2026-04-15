'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function SignUp() {
  const router = useRouter();
  const { signInUser } = useAuth();

  const [step, setStep] = useState<'SIGNUP' | 'OTP'>('SIGNUP');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, mobile }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setStep('OTP');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      signInUser(
        { id: data.user.id, email: data.user.email, name: data.user.name },
        data.token
      );
      alert('Registration successful!');
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

      <div className='w-[350px] border border-gray-300 rounded p-6 shadow-sm relative'>
        {step === 'SIGNUP' ? (
          <>
            <h1 className='text-3xl font-normal mb-4'>Create account</h1>

            {error && (
              <div className='mb-4 text-red-600 text-sm border-l-4 border-red-600 pl-2'>
                {error}
              </div>
            )}

            <form onSubmit={handleRegistration} className='space-y-4'>
              <div>
                <label className='block text-sm font-bold mb-1'>Your name</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='First and last name'
                  className='w-full border border-gray-400 rounded px-3 py-1 outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-bold mb-1'>Mobile number</label>
                <input
                  type='tel'
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder='Mobile number'
                  className='w-full border border-gray-400 rounded px-3 py-1 outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]'
                />
              </div>
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
                  placeholder='At least 6 characters'
                  className='w-full border border-gray-400 rounded px-3 py-1 outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]'
                  required
                  minLength={6}
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full mt-2 bg-[#F3A847] hover:bg-[#e49733] border border-[#a88734] text-black py-1.5 rounded-md shadow-sm disabled:opacity-50 text-sm font-normal'
              >
                {loading ? 'Registering...' : 'Verify email'}
              </button>
            </form>

            <p className='text-xs mt-6 pt-4 border-t border-gray-200'>
              Already have an account?{' '}
              <Link href='/signin' className='text-[#0066c0] hover:underline hover:text-[#c45500]'>
                Sign in &rsaquo;
              </Link>
            </p>
          </>
        ) : (
          <div className='animate-in fade-in zoom-in duration-200'>
            <h1 className='text-2xl font-normal mb-2'>Verify email address</h1>
            <p className='text-sm mb-4'>
              To verify your email, we&apos;ve sent a One Time Password (OTP) to{' '}
              <span className='font-bold'>{email}</span>.
            </p>

            {error && (
              <div className='mb-4 text-red-600 text-sm border-l-4 border-red-600 pl-2'>
                {error}
              </div>
            )}

            <form onSubmit={handleOtpVerify} className='space-y-4'>
              <div>
                <label className='block text-sm font-bold mb-1'>Enter OTP</label>
                <input
                  type='text'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\\D/g, '').slice(0, 6))}
                  className='w-full border border-gray-400 rounded px-3 py-1 text-center tracking-[0.5em] font-mono text-lg outline-none focus:border-amazon-orange focus:shadow-[0_0_3px_2px_rgba(255,153,0,0.5)]'
                  placeholder='------'
                  required
                  maxLength={6}
                />
              </div>
              <button
                type='submit'
                disabled={loading || otp.length !== 6}
                className='w-full bg-[#F3A847] hover:bg-[#e49733] border border-[#a88734] text-black py-1.5 rounded-md shadow-sm disabled:opacity-50 text-sm font-normal'
              >
                {loading ? 'Verifying...' : 'Create your Amazon account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}