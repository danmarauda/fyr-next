'use client';

import React, { useState, useId } from 'react';
import { FaGoogle, FaApple, FaLinkedin, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const SignUpPage = () => {
	const router = useRouter();
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate passwords match
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			setIsLoading(false);
			return;
		}

		// Validate password strength
		if (formData.password.length < 8) {
			setError('Password must be at least 8 characters');
			setIsLoading(false);
			return;
		}

		try {
			const res = await authClient.signUp.email({
				email: formData.email,
				password: formData.password,
				name: formData.name,
			});

			if (res?.data) {
				router.push('/');
			}
		} catch {
			setError('Sign up failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialSignUp = async (provider: 'google' | 'apple' | 'linkedin') => {
		try {
			if (provider === 'linkedin') {
				return;
			}
			await authClient.signIn.social({ provider });
		} catch {
			setError('Social sign up failed. Please try again.');
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className='flex min-h-screen bg-[#050505] font-sans text-gray-200'>
			{/* Left Panel - Image & Brand */}
			<div className='relative hidden w-1/2 bg-[#050505] p-[30px] lg:flex'>
				<div className='group relative h-full w-full overflow-hidden rounded-[40px] bg-black'>
					<div className='pointer-events-none absolute inset-0 z-20 rounded-[40px] border border-white/5 shadow-[inset_0_0_80px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(0,0,0,1)]'></div>

					<div className='absolute inset-0 z-0'>
						<img
							src='https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop'
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
								Join the future <br />
								of enterprise <br />
								<span className='font-normal text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]'>
									intelligence.
								</span>
							</h2>
							<div className='border-l border-blue-500/30 pl-6'>
								<p className='mb-4 max-w-md text-sm font-light leading-relaxed tracking-wide text-gray-300'>
									Create your account and start leveraging advanced analytics for
									strategic decision making.
								</p>
								<span className='text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400/80'>
									ALIAS — Your AI Partner
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Sign Up Form */}
			<div className='relative flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-24'>
				<div className='bg-grid-white/[0.02] pointer-events-none absolute inset-0 lg:hidden' />

				<div className='z-10 w-full max-w-md animate-fade-in'>
					<div className='mb-10'>
						<h2 className='mb-2 text-3xl font-light text-white'>Create account</h2>
						<p className='text-sm text-gray-500'>
							Get started with your free account today.
						</p>
					</div>

					{error && (
						<div className='mb-4 rounded-lg border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400'>
							{error}
						</div>
					)}

					<form onSubmit={handleSignUp} className='space-y-6'>
						<div className='space-y-1'>
							<label
								htmlFor={nameId}
								className='ml-1 text-xs uppercase tracking-wider text-gray-500'>
								Full name
							</label>
							<input
								id={nameId}
								type='text'
								name='name'
								value={formData.name}
								onChange={handleChange}
								className='w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white placeholder-gray-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20'
								placeholder='John Doe'
								required
							/>
						</div>

						<div className='space-y-1'>
							<label
								htmlFor={emailId}
								className='ml-1 text-xs uppercase tracking-wider text-gray-500'>
								Email address
							</label>
							<input
								id={emailId}
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								className='w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white placeholder-gray-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20'
								placeholder='name@company.com'
								required
							/>
						</div>

						<div className='relative space-y-1'>
							<label
								htmlFor={passwordId}
								className='ml-1 text-xs uppercase tracking-wider text-gray-500'>
								Password
							</label>
							<div className='relative'>
								<input
									id={passwordId}
									type={showPassword ? 'text' : 'password'}
									name='password'
									value={formData.password}
									onChange={handleChange}
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

						<div className='relative space-y-1'>
							<label
								htmlFor={confirmPasswordId}
								className='ml-1 text-xs uppercase tracking-wider text-gray-500'>
								Confirm password
							</label>
							<div className='relative'>
								<input
									id={confirmPasswordId}
									type={showConfirmPassword ? 'text' : 'password'}
									name='confirmPassword'
									value={formData.confirmPassword}
									onChange={handleChange}
									className='w-full rounded-lg border border-gray-800 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white placeholder-gray-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20'
									placeholder='••••••••'
									required
								/>
								<button
									type='button'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className='absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-600 transition-colors hover:text-gray-300'>
									{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						<div className='text-xs text-gray-500'>
							<label className='flex cursor-pointer items-start hover:text-gray-300'>
								<input
									type='checkbox'
									className='mr-2 mt-0.5 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-0 focus:ring-offset-0'
									required
								/>
								<span>
									I agree to the{' '}
									<Link href='/terms' className='text-blue-400 hover:underline'>
										Terms of Service
									</Link>{' '}
									and{' '}
									<Link href='/privacy' className='text-blue-400 hover:underline'>
										Privacy Policy
									</Link>
								</span>
							</label>
						</div>

						<button
							type='submit'
							disabled={isLoading}
							className='flex w-full transform items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'>
							{isLoading ? (
								<>Processing...</>
							) : (
								<>
									Create Account <FaArrowRight className='text-xs' />
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
									Or sign up with
								</span>
							</div>
						</div>

						<div className='mt-6 grid grid-cols-3 gap-4'>
							<button
								type='button'
								onClick={() => handleSocialSignUp('google')}
								className='group flex items-center justify-center rounded-lg border border-gray-800 px-4 py-2.5 transition-all hover:border-gray-700 hover:bg-gray-900'>
								<FaGoogle className='text-gray-400 group-hover:text-white' />
							</button>
							<button
								type='button'
								onClick={() => handleSocialSignUp('apple')}
								className='group flex items-center justify-center rounded-lg border border-gray-800 px-4 py-2.5 transition-all hover:border-gray-700 hover:bg-gray-900'>
								<FaApple className='text-gray-400 group-hover:text-white' />
							</button>
							<button
								type='button'
								onClick={() => handleSocialSignUp('linkedin')}
								className='group flex items-center justify-center rounded-lg border border-gray-800 px-4 py-2.5 transition-all hover:border-gray-700 hover:bg-gray-900'>
								<FaLinkedin className='text-gray-400 group-hover:text-blue-400' />
							</button>
						</div>
					</div>

					<p className='mt-10 text-center text-xs text-gray-600'>
						Already have an account?{' '}
						<Link href='/login' className='text-blue-400 hover:underline'>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
