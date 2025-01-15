import dotenv from 'dotenv';

dotenv.config();

export const config = {
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        name: process.env.DB_NAME
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'tu_secreto_super_seguro',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
}; 