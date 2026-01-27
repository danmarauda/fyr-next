'use client';

import React, { useState, useId, Suspense } from 'react';
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const ResetPasswordForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const passwordId = useId();
	const confirmPasswordId = useId();

	const token = searchParams?.get('token');

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			setIsLoading(false);
			return;
		}

		if (password.length < 8) {
			setError('Password must be at least 8 characters');
			setIsLoading(false);
			return;
		}

		if (!token) {
			setError('Invalid or missing reset token');
			setIsLoading(false);
			return;
		}

		try {
			await authClient.resetPassword({
				newPassword: password,
				token: token,
			});
			setSuccess(true);
			setTimeout(() => {
				router.push('/login');
			}, 2000);
		} catch {
			setError('Failed to reset password. The link may have expired.');
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
							src='https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop'
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

						<div className='mb-4 animate-fade-slide-up'>
							<h2 className='mb-8 text-5xl font-thin leading-tight tracking-tight drop-shadow-xl'>
								Create a new <br />
								password for <br />
								<span className='font-normal text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]'>
									your account.
								</span>
							</h2>
							<div className='border-l border-blue-500/30 pl-6'>
								<p className='mb-4 max-w-md text-sm font-light leading-relaxed tracking-wide text-gray-300'>
									Choose a strong password to keep your account secure and
									protected.
								</p>
								<span className='text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400/80'>
									ALIAS — Your Security Matters
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Form */}
			<div className='relative flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-24'>
				<div className='bg-grid-white/[0.02] pointer-events-none absolute inset-0 lg:hidden' />

				<div className='z-10 w-full max-w-md animate-fade-in'>
					<div className='mb-10'>
						<h2 className='mb-2 text-3xl font-light text-white'>Reset your password</h2>
						<p className='text-sm text-gray-500'>Enter your new password below.</p>
					</div>

					{error && (
						<div className='mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400'>
							{error}
						</div>
					)}

					{success ? (
						<div className='space-y-6'>
							<div className='rounded-lg border border-green-500/30 bg-green-900/20 p-4 text-sm text-green-400'>
								<p className='mb-2 font-medium'>Password reset successful!</p>
								<p className='text-green-400/80'>Redirecting to login page...</p>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='relative space-y-1'>
								<label
									htmlFor={passwordId}
									className='ml-1 text-xs uppercase tracking-wider text-gray-500'>
									New password
								</label>
								<div className='relative'>
									<input
										id={passwordId}
										type={showPassword ? 'text' : 'password'}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className='w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white placeholder-gray-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20'
										placeholder='••••••••'
										required
										minLength={8}
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-600 transition-colors hover:text-gray-300'>
										{showPassword ? <FaEyeSlash /> : <FaEye />}
									</button>
								</div>
								<p className='ml-1 text-xs text-gray-600'>
									Must be at least 8 characters
								</p>
							</div>

							<div className='relative space-y-1'>
								<label
									htmlFor={confirmPasswordId}
									className='ml-1 text-xs uppercase tracking-wider text-gray-500'>
									Confirm new password
								</label>
								<div className='relative'>
									<input
										id={confirmPasswordId}
										type={showConfirmPassword ? 'text' : 'password'}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className='w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white placeholder-gray-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20'
										placeholder='••••••••'
										required
										minLength={8}
									/>
									<button
										type='button'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className='absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-600 transition-colors hover:text-gray-300'>
										{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
									</button>
								</div>
							</div>

							<button
								type='submit'
								disabled={isLoading}
								className='flex w-full transform items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'>
								{isLoading ? (
									<>Resetting...</>
								) : (
									<>
										Reset Password <FaArrowRight className='text-xs' />
									</>
								)}
							</button>
						</form>
					)}

					<p className='mt-10 text-center text-xs text-gray-600'>
						Remember your password?{' '}
						<Link href='/login' className='text-blue-400 hover:underline'>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

const ResetPasswordPage = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ResetPasswordForm />
		</Suspense>
	);
};

export default ResetPasswordPage;
