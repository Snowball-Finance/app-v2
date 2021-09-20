
module.exports = {
  env: {
    NETWORK: process.env.NETWORK,
    PRIVATENODE: process.env.PRIVATENODE,
    APIADDR: process.env.APIADDR
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
  },
  images: {
    domains: ['raw.githubusercontent.com', 'gateway.pinata.cloud'],
  },
};
