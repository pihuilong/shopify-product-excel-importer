import type { Config, ObjectType, Production } from './config.interface';

const util = {
  isObject<T>(value: T): value is T & ObjectType {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },
  merge<T extends ObjectType, U extends ObjectType>(target: T, source: U): T & U {
    for (const key of Object.keys(source)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (this.isObject(targetValue) && this.isObject(sourceValue)) {
        Object.assign(sourceValue, this.merge(targetValue, sourceValue));
      }
    }

    return { ...target, ...source };
  },
};

export const configuration = async (): Promise<Config> => {
  const { config: defaultConfig } = await import('./envs/default');
  const { config: environmentConfig } = <{ config: Production }>(
    await import(`./envs/${process.env.NODE_ENV || 'development'}`)
  );

  // NOTE: Merge default config with environment specific config.
  return util.merge(defaultConfig, environmentConfig);
};
