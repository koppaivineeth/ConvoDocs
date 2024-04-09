const nextConfig = {
    async redirects() {
        return [
            {
                source: "/sign-in",
                destination: "/api/auth/login",
                permanent: true
            },
            {
                source: "/sign-up",
                destination: "/api/auth/register",
                permanent: true
            }
        ]
    },

    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**",
            },
        ]
    },
    webpack: (config, { buildId, dev, isServer, dafaultLoaders, webpack }) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    }
}

module.exports = nextConfig