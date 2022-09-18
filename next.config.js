module.exports = {
    webpack5: true,
    webpack: config => {
        config.resolve.fallback = {
            fs: false,
            http: false,
            https: false,
            crypto: false,
            stream: false,
            querystring: false,
            fallback: false,
        };

        return config;
    },
};
