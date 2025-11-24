'use client';

import React, { useState } from 'react';
import { FaGoogle, FaApple, FaLinkedin, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const LoginPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const res = await authClient.signIn.email({
				email: email,
				password: password,
			});

			if (res?.data) {
				const callbackUrl =
					searchParams?.get('callbackUrl') ||
					(process.env.NEXT_PUBLIC_URL as string) ||
					'/';
				router.push(callbackUrl);
			}
		} catch (err) {
			setError('Login failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialLogin = async (provider: 'google' | 'apple' | 'linkedin') => {
		try {
			if (provider === 'linkedin') {
				// Handle LinkedIn login if supported
				return;
			}
			await authClient.signIn.social({ provider });
		} catch (err) {
			setError('Social login failed. Please try again.');
		}
	};

	return (
		<div className='flex min-h-screen bg-[#050505] font-sans text-gray-200'>
			{/* Left Panel - Image & Brand */}
			<div className='relative hidden w-1/2 bg-[#050505] p-[30px] lg:flex'>
				<div className='group relative h-full w-full overflow-hidden rounded-[40px] bg-black'>
					{/* DEPTH TRICK: Inner Shadow Layer to make image look embedded/deep */}
					<div className='pointer-events-none absolute inset-0 z-20 rounded-[40px] border border-white/5 shadow-[inset_0_0_80px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,1)]'></div>

					{/* Background Image */}
					<div className='absolute inset-0 z-0'>
						{/* Abstract Architectural / Data Structure Image */}
						<img
							src='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
							alt='Abstract Structure'
							className='h-full w-full object-cover opacity-50 grayscale transition-transform duration-[30s] ease-linear hover:scale-105'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent' />
						<div className='absolute inset-0 bg-blue-900/20 mix-blend-overlay' />
					</div>

					{/* Content Layer */}
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
								Design your <br />
								intelligence, <br />
								<span className='font-normal text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]'>
									strategically.
								</span>
							</h2>
							<div className='border-l border-blue-500/30 pl-6'>
								<p className='mb-4 max-w-md text-sm font-light leading-relaxed tracking-wide text-gray-300'>
									Join a network of visionaries using advanced analytics to shape
									the future of enterprise.
								</p>
								<span className='text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400/80'>
									ALIAS — Gateway to AI Excellence
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Login Form */}
			<div className='relative flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-24'>
				{/* Mobile Background (Subtle) */}
				<div className='bg-grid-white/[0.02] pointer-events-none absolute inset-0 lg:hidden' />

				<div className='animate-fade-in z-10 w-full max-w-md'>
					<div className='mb-10'>
						<h2 className='mb-2 text-3xl font-light text-white'>Welcome back</h2>
						<p className='text-sm text-gray-500'>
							Enter your credentials to access the Admin Portal.
						</p>
					</div>

					{error && (
						<div className='mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400'>
							{error}
						</div>
					)}

					<form onSubmit={handleLogin} className='space-y-6'>
						<div className='space-y-1'>
							<label className='ml-1 text-xs uppercase tracking-wider text-gray-500'>
								Email address
							</label>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white placeholder-gray-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20'
								placeholder='name@company.com'
								required
							/>
						</div>

						<div className='relative space-y-1'>
							<label className='ml-1 text-xs uppercase tracking-wider text-gray-500'>
								Password
							</label>
							<div className='relative'>
								<input
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white placeholder-gray-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20'
									placeholder='••••••••'
									required
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-600 transition-colors hover:text-gray-300'>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						<div className='flex items-center justify-between text-xs text-gray-500'>
							<label className='flex cursor-pointer items-center hover:text-gray-300'>
								<input
									type='checkbox'
									className='mr-2 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-0 focus:ring-offset-0'
								/>
								Remember me
							</label>
							<Link href='/forgot-password' className='transition-colors hover:text-blue-400'>
								Forgot password?
							</Link>
						</div>

						<button
							type='submit'
							disabled={isLoading}
							className='flex w-full transform items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'>
							{isLoading ? (
								<>Processing...</>
							) : (
								<>
									Sign In <FaArrowRight className='text-xs' />
								</>
							)}
						</button>
					</form>

					<div className='mt-8'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-800'></div>
							</div>
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-[#050505] px-4 text-gray-600'>
									Or continue with
								</span>
							</div>
						</div>

						<div className='mt-6 grid grid-cols-3 gap-4'>
							<button
								onClick={() => handleSocialLogin('google')}
								className='group flex items-center justify-center rounded-lg border border-gray-800 px-4 py-2.5 transition-all hover:border-gray-700 hover:bg-gray-900'>
								<FaGoogle className='text-gray-400 group-hover:text-white' />
							</button>
							<button
								onClick={() => handleSocialLogin('apple')}
								className='group flex items-center justify-center rounded-lg border border-gray-800 px-4 py-2.5 transition-all hover:border-gray-700 hover:bg-gray-900'>
								<FaApple className='text-gray-400 group-hover:text-white' />
							</button>
							<button
								onClick={() => handleSocialLogin('linkedin')}
								className='group flex items-center justify-center rounded-lg border border-gray-800 px-4 py-2.5 transition-all hover:border-gray-700 hover:bg-gray-900'>
								<FaLinkedin className='text-gray-400 group-hover:text-blue-400' />
							</button>
						</div>
					</div>

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

export default LoginPage;
