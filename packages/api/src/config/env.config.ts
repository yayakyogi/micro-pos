import { config } from 'dotenv';

interface OptionsMakeEnv {
  pathEnv?: string;
  ensureKeys?: string[];
}

export class MakeEnv {
  static instance: MakeEnv;

  private constructor(
    options?: OptionsMakeEnv,
    private readonly raw: NodeJS.ProcessEnv = {},
    private readonly logger = console.warn,

    readonly storage = new Map<string, string>(),
  ) {
    const opts = options || ({} as OptionsMakeEnv);
    opts.pathEnv = opts.pathEnv ?? undefined;
    opts.ensureKeys = opts.ensureKeys ?? [];

    config(opts.pathEnv ? { path: opts.pathEnv } : undefined);
    this.raw = process.env;

    for (const [key, value] of Object.entries(this.raw)) {
      this.storage.set(key, value || '');
    }

    for (const key of opts.ensureKeys) {
      if (!this.storage.has(key)) throw new Error(`Environment variable ${key} is required`);
    }

    let message = 'Environment variables loaded';
    if (opts.ensureKeys.length > 0) {
      message = message.concat(` with ${opts.ensureKeys.length} keys to ensure`);
    }

    this.logger(message);
  }

  static initialize(options?: OptionsMakeEnv): MakeEnv {
    return this.instance || (this.instance = new MakeEnv(options));
  }

  static get storage(): Map<string, string> {
    return this.instance?.storage || new Map();
  }
}

interface IGetEnvResult {
  value: string;
  toNumber: () => number;
  toBoolean: () => boolean;
  toBeDefined: () => string;
}

export class EnvConfig {
  static get(key: string): IGetEnvResult {
    const value = MakeEnv.storage.get(key);
    if (!value) {
      throw new Error(`Environment variable ${key} is not defined`);
    }

    return {
      value,
      toNumber: () => {
        const number = Number(value);
        if (Number.isNaN(number)) {
          throw new Error(`Environment variable ${key} is not a number`);
        }

        return number;
      },
      toBoolean: () => {
        return ['true', '1', 'yes', 'y', 'on'].includes(value.toLowerCase());
      },
      toBeDefined: () => {
        if (!value) {
          throw new Error(`Environment variable ${key} is not defined`);
        }

        return value;
      },
    };
  }

  static get const() {
    return {
      PORT: this.get('SERVER_PORT').toNumber(),
      IS_DEVELOPMENT: this.get('NODE_ENV').value === 'development',
      IS_PRODUCTION: this.get('NODE_ENV').value === 'production',
      IS_TEST: this.get('NODE_ENV').value === 'test',
      DEBUG: this.get('DEBUG').toBoolean(),
      DATABASE: {
        HOST: this.get('DATABASE_HOST').toBeDefined(),
        PORT: this.get('DATABASE_PORT').toNumber(),
        USERNAME: this.get('DATABASE_USERNAME').toBeDefined(),
        PASSWORD: this.get('DATABASE_PASSWORD').toBeDefined(),
        NAME: this.get('DATABASE_NAME').toBeDefined(),
        SSL: this.get('DATABASE_SSL').toBoolean(),
      },
    };
  }
}
