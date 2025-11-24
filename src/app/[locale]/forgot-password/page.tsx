'use client';

import React, { useState, useId } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const ForgotPasswordPage = () => {
	const router = useRouter();
	const emailId = useId();

	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			await authClient.forgetPassword({
				email: email,
				redirectTo: '/reset-password',
			});
			setSuccess(true);
		} catch (err) {
			setError('Failed to send reset email. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex min-h-screen bg-[#050505] font-sans text-gray-200'>
			{/* Left Panel - Image & Brand */}
			<div className='relative hidden w-1/2 bg-[#050505] p-[30px] lg:flex'>
				<div className='group relative h-full w-full overflow-hidden rounded-[40px] bg-black'>
					<div className='pointer-events-none absolute inset-0 z-20 rounded-[40px] border border-white/5 shadow-[inset_0_0_80px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,1)]'></div>

					<div className='absolute inset-0 z-0'>
						<img
							src='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
							alt='Abstract Structure'
							className='h-full w-full object-cover opacity-50 grayscale transition-transform duration-[30s] ease-linear hover:scale-105'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent' />
						<div className='absolute inset-0 bg-blue-900/20 mix-blend-overlay' />
					</div>

					<div className='relative z-30 flex h-full w-full flex-col justify-between p-12'>
						<div className='flex items-center gap-3'>
							<div className='flex h-10 w-10 items-center justify-center rounded-lg border border-blue-400/30 bg-black/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-md'>
								<div className='h-3 w-3 animate-pulse rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]' />
							</div>
							<h1 className='text-2xl font-light tracking-[0.3em] text-white drop-shadow-md'>
								ALIAS
							</h1>
						</div>

						<div className='animate-fade-slide-up mb-4'>
							<h2 className='mb-8 text-5xl font-thin leading-tight tracking-tight drop-shadow-xl'>
								Recover your <br />
								account with  <br />
								<span className='font-normal text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]'>
									ease.
								</span>
							</h2>
							<div className='border-l border-blue-500/30 pl-6'>
								<p className='mb-4 max-w-md text-sm font-light leading-relaxed tracking-wide text-gray-300'>
									Enter your email address and we'll send you instructions to reset your password.
								</p>
								<span className='text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400/80'>
									ALIAS — Secure & Reliable
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Form */}
			<div className='relative flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-24'>
				<div className='bg-grid-white/[0.02] pointer-events-none absolute inset-0 lg:hidden' />

				<div className='animate-fade-in z-10 w-full max-w-md'>
					<div className='mb-10'>
						<h2 className='mb-2 text-3xl font-light text-white'>Reset password</h2>
						<p className='text-sm text-gray-500'>
							We'll send you a link to reset your password.
						</p>
					</div>

					{error && (
						<div className='mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400'>
							{error}
						</div>
					)}

					{success ? (
						<div className='space-y-6'>
							<div className='rounded-lg border border-green-500/30 bg-green-900/20 p-4 text-sm text-green-400'>
								<p className='mb-2 font-medium'>Check your email</p>
								<p className='text-green-400/80'>
									We've sent password reset instructions to {email}
								</p>
							</div>

							<Link
								href='/login'
								className='flex w-full transform items-center justify-center gap-2 rounded-lg border border-gray-800 py-3.5 font-medium text-white transition-all duration-300 hover:border-gray-700 hover:bg-gray-900'>
								<FaArrowLeft className='text-xs' />
								Back to Login
							</Link>
						</div>
					) : (
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='space-y-1'>
								<label
									htmlFor={emailId}
									className='ml-1 text-xs uppercase tracking-wider text-gray-500'>
									Email address
								</label>
								<input
									id={emailId}
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white placeholder-gray-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20'
									placeholder='name@company.com'
									required
								/>
							</div>

							<button
								type='submit'
								disabled={isLoading}
								className='flex w-full transform items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'>
								{isLoading ? (
									<>Sending...</>
								) : (
									<>
										Send Reset Link <FaArrowRight className='text-xs' />
									</>
								)}
							</button>

							<Link
								href='/login'
								className='flex w-full items-center justify-center gap-2 rounded-lg border border-gray-800 py-3.5 text-sm font-medium text-gray-300 transition-all hover:border-gray-700 hover:bg-gray-900'>
								<FaArrowLeft className='text-xs' />
								Back to Login
							</Link>
						</form>
					)}

					<p className='mt-10 text-center text-xs text-gray-600'>
						Don't have an account?{' '}
						<Link href='/sign-up' className='text-blue-400 hover:underline'>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;