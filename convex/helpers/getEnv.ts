import { getEnv } from '@t3-oss/env-nextjs';
import { env } from '../../src/env';

export const getConvexEnv = getEnv(env);
