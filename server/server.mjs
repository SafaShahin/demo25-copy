import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import pool from './db.js';  // PostgreSQL connection
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import HTTP_CODES from '../Client/api-tests/utils/httpCodes.mjs';
import treeRoutes from './routes/treeRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables - .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = process.env.PORT || 10000;

server.use(session({
    store: new (pgSession(session))({
      pool: pool, // PostgreSQL con
      tableName: 'session' // PostgreSQL db session table
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } //  false: testing locally (http://localhost:10000) :  true: deploying on Render (HTTPS)
}));

server.use(express.json());

 
server.use(express.static(path.join(__dirname, '../Client/public')));


server.get("/manifest.webmanifest", (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/public/manifest.webmanifest"));
});

server.use('/api/tree', treeRoutes);


server.get("/session", (req, res) => {
    if (!req.session.user) {
        req.session.user = { id: uuidv4() };
    }
    res.status(HTTP_CODES.SUCCESS.OK).json({ session: req.session.user });
});


server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/public', 'index.html'));
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

process.on("uncaughtException", (err) => {
    console.error(" Uncaught error:", err);
    process.exit(1);
});
