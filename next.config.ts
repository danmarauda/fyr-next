import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	experimental: {
		// turbopackFileSystemCacheForDev: true, // Disabled to avoid turbopack issues
		browserDebugInfoInTerminal: true,
	},
	reactCompiler: true, // ✅ Enabled - automatic React optimization
	typedRoutes: true,
	webpack: (config, { isServer }) => {
		// Ignore markdown files during build
		config.module.rules.push({
			test: /\.md$/,
			type: 'asset/source',
		});

		// Fix radix-ui imports
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
			};
		}

		return config;
	},
	turbopack: {
		rules: {
			'*.md': {
				loaders: [{ loader: 'raw-loader' }],
				as: '*.js',
			},
		},
	},
};

export default nextConfig;
