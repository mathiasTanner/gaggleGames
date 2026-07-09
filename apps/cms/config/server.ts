export default ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: env.array(
        'APP_KEYS',
        isProduction ? undefined : ['gaggle-dev-key-1', 'gaggle-dev-key-2']
      ),
    },
  };
};
