import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	experimental: {
		// turbopackFileSystemCacheForDev: true, // Disabled to avoid turbopack issues
		browserDebugInfoInTerminal: true,
	},
	// reactCompiler: true, // Disabled until babel-plugin-react-compiler is installed
	typedRoutes: true,
	turbopack: {},
};

export default nextConfig;
