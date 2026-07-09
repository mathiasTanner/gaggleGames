export default ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';

  return {
    auth: {
      secret: env(
        'ADMIN_JWT_SECRET',
        isProduction ? undefined : 'gaggle-dev-admin-secret'
      ),
    },
    apiToken: {
      salt: env(
        'API_TOKEN_SALT',
        isProduction ? undefined : 'gaggle-dev-api-token-salt'
      ),
    },
    transfer: {
      token: {
        salt: env(
          'TRANSFER_TOKEN_SALT',
          isProduction ? undefined : 'gaggle-dev-transfer-token-salt'
        ),
      },
    },
    secrets: {
      encryptionKey: env(
        'ENCRYPTION_KEY',
        isProduction ? undefined : '12345678901234567890123456789012'
      ),
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
  };
};
