// NOTE: Contain default config for all environments and can be overwritten by environment specific config.
// Non-sensitive config can be stored directly in these files.
// Sensitive config should be passed from process.env which will be handled by dotEnv.
// process.env or .env files will override the default config.
export const config = {
  // NOTE: Add default config here
  hello: 'Hello World!!',
};
