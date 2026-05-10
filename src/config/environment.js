export function loadEnvironment() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_API_KEY',
    'EMAIL_HOST',
    'EMAIL_USER',
    'EMAIL_PASS',
    'ALERT_EMAIL_TO'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️ Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }

  return {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    adminApiKey: process.env.ADMIN_API_KEY,
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    emailHost: process.env.EMAIL_HOST,
    emailPort: Number(process.env.EMAIL_PORT || 587),
    emailSecure: process.env.EMAIL_SECURE === 'true',
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    alertEmailTo: process.env.ALERT_EMAIL_TO,
    port: Number(process.env.PORT || 3000),
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}
