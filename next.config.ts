import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	experimental: {
		// turbopackFileSystemCacheForDev: true, // Disabled to avoid turbopack issues
		browserDebugInfoInTerminal: true,
	},
	// reactCompiler: true, // Disabled until babel-plugin-react-compiler is installed
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
};

export default nextConfig;
