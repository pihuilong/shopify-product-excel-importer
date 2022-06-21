# Config

<https://trilon.io/blog/announcing-nestjs-8-whats-new#Template-literal-types-and-ConfigService>
> With the template literal types now available in TypeScript v4.2, we are able to implement a new infer feature that lets us infer the type of a nested custom configuration object's property, even when using dot notation

Since the `infer` option is non-default and needs to be added each time it is used, we implement it as a default by extending ConfigService in Nest.

## Config Priority
> From highest priority to lowest
1. process.env
- Can manage it by container orchestrators such as K8s
2. .env files
- Dotenv is ignored by git, so you can have your custom local setting
3. non-sensitive config for specified env
- such as [./envs/developement.ts](./envs/developement.ts)
4. default non-sensitive config
- [./envs/default.ts](./envs/default.ts)
