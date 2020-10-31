import Ajv, { Options } from 'ajv';
import Config from './Config';

const validationOptions: Options = {
  // insert defaults by value (object literal is used).
  //
  // With the option value "empty" properties and items equal
  // to null or "" (empty string) will be considered missing
  // and assigned defaults.
  useDefaults: 'empty',

  // change data type of data to match type keyword.
  // 'array' means coerce scalar data types add additionally coerce scalar
  // data to an array with one element and vice versa (as required by the schema).
  coerceTypes: 'array',

  // Will remove additional properties from types that have the additionalProperties
  // keyword equal to false are removed.
  removeAdditional: true,

  format: 'full',

  // Use jsonPointers in error dataPaths instead of JSON dot notation
  // This is handy as we use it directly to perform look ups into the
  // schema itself.
  jsonPointers: true,

  // check all rules collecting all errors.
  allErrors: true,
};

const ajv = new Ajv(validationOptions);
const validate = ajv.compile({
  title: 'Env Schema',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['APP_DB_HOST', 'APP_DB_USER', 'APP_DB_PASSWORD', 'APP_DB_NAME'],
  additionalProperties: true,
  properties: {
    APP_DB_HOST: {type: 'string'},
    APP_DB_USER: {type: 'string'},
    APP_DB_PASSWORD: {type: 'string'},
    APP_DB_NAME: {type: 'string'},
  },
});

export type Env = {
  APP_DB_HOST: string,
  APP_DB_USER: string,
  APP_DB_PASSWORD: string,
  APP_DB_NAME: string,
};

export class ConfigValidationError extends Error {
  constructor(readonly errors: Ajv.ErrorObject[]) {
    super(`Config validation failed with ${errors.length} errors`);
  }
}

export default function getConfFromEnv(maybeEnv: Partial<Env>): Config {
  const valid = validate(maybeEnv);
  if (!valid && validate.errors && validate.errors.length > 0) {
    throw new ConfigValidationError(validate.errors);
  }

  const env = maybeEnv as Env;

  return Object
    .keys(env)
    .reduce(
      (conf, envKey) => {
        switch (envKey) {
          case 'APP_DB_HOST':
            conf.DB_HOST = env[envKey];
            break;

          case 'APP_DB_USER':
            conf.DB_USER = env[envKey];
            break;

          case 'APP_DB_PASSWORD':
            conf.DB_PASSWORD = env[envKey];
            break;

          case 'APP_DB_NAME':
            conf.DB_NAME = env[envKey];
            break;

          default:
            // Quietly drop extra props that may be in the env
        }

        return conf;
      },
      {} as Config,
    );
}
