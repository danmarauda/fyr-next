/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: function (config) {
		config.module.rules.push({
			test: /\.md$/,
			use: 'raw-loader',
		});
		return config;
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	// Allow cross-origin requests in development
	experimental: {
		allowedDevOrigins: [
			'http://localhost:3005',
			'http://192.168.1.12:3005',
		],
	},
};

module.exports = nextConfig;
