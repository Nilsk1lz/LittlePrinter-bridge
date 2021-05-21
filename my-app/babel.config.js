module.exports = (api) => {
  api.cache(false);

  const config = {
    presets: [
      [
        '@babel/env',
        {
          // useBuiltIns: 'usage',
          // corejs: 3,
        },
      ],
      '@babel/react',
    ],
    plugins: ['@babel/proposal-class-properties'],
  };

  // if (process.env.NODE_ENV !== 'test') config.include = ['src'];

  return config;
};
