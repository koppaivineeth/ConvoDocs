const nextConfig = {
    webpack: (config, { buildId, dev, isServer, dafaultLoaders, webpack }) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
    }
}

module.exports = nextConfig