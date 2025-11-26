import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	experimental: {
		// turbopackFileSystemCacheForDev: true, // Disabled to avoid turbopack issues
		browserDebugInfoInTerminal: true,
	},
	// reactCompiler: true, // Disabled for stability
	typedRoutes: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack: (config, { isServer }) => {
		// Ignore markdown files during build
		config.module.rules.push({
			test: /\.md$/,
			type: 'asset/source',
		});

		// Exclude packages that have compatibility issues for now
		config.module.rules.push({
			test: /packages\/(plate|ui)/,
			loader: 'ignore-loader',
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
		root: __dirname,
		rules: {
			'*.md': {
				loaders: [{ loader: 'raw-loader' }],
				as: '*.js',
			},
		},
	},
};

export default nextConfig;
