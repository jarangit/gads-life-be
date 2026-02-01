// filepath: /Users/jarandonchaaim/Documents/dev/personal/my-project/gads-life-be/src/config/app.config.ts
export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  adminApiKey: process.env.ADMIN_API_KEY || 'default_admin_key',
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USERNAME || 'root',
    pass: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'gadslife_db',
  },
});
