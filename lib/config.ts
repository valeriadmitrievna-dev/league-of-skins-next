type NodeEnv = 'development' | 'production';

interface Config {
  nodeEnv: NodeEnv;
  riotVersion: string;
  dataUpdateDays: number;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  adminKey: string;
}

export const config: Config = {
  nodeEnv: (process.env.NODE_ENV as NodeEnv) || 'development',
  riotVersion: process.env.RIOT_VERSION || '16.4.1',
  dataUpdateDays: parseInt(process.env.DATA_UPDATE_DAYS ?? '7'),
  jwtAccessSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  adminKey: process.env.ADMIN_KEY!,
};
