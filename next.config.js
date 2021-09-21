
module.exports = {
  env: {
    NETWORK: process.env.NETWORK,
    ENVIRONMENT: process.env.ENVIRONMENT,
    PRIVATENODE: process.env.PRIVATENODE,
    LOCALNODE: process.env.LOCALNODE,
    IPFS_API_URL: process.env.IPFS_API_URL,
    APIADDR: process.env.APIADDR,
    DEVAPIADDR: process.env.DEVAPIADDR,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.module.rules.push({
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      });
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  }
};
