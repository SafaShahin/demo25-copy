import express from 'express';
import pg from 'pg';
import HTTP_CODES from '../Client/api-tests/utils/httpCodes.mjs';
import treeRoutes from './routes/treeRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = process.env.PORT || 3000;

// PostgreSQL Database Connection
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL, // Render provides this
    ssl: { rejectUnauthorized: false } //  Render PostgreSQL
});


server.use(express.json());

// Sessions -  PostgreSQL
server.use(async (req, res, next) => {
    try {
        let sessionId = req.headers['session-id']; // Retrieve session ID from request headers
        
        if (!sessionId) {
            // If no session ID, a new session creted. PostgreSQL generates UUID
            const result = await pool.query(
                `INSERT INTO sessions (data) VALUES ($1) RETURNING id`,
                [JSON.stringify({})]
            );
            sessionId = result.rows[0].id;
            req.headers['session-id'] = sessionId; // Attach new session ID to headers
        }

        // Retrieve session data from database
        const sessionResult = await pool.query(`SELECT data FROM sessions WHERE id = $1`, [sessionId]);
        req.session = { id: sessionId, data: sessionResult.rows.length > 0 ? sessionResult.rows[0].data : {} };
        next();
    } catch (error) {
        console.error("Error managing session:", error);
        next();
    }
});

// Middleware to Save Session Changes
server.use(async (req, res, next) => {
    try {
        if (req.session) {
            await pool.query(
                `UPDATE sessions SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
                [JSON.stringify(req.session.data), req.session.id]
            );
        }
    } catch (error) {
        console.error("Error saving session:", error);
    }
    next();
});


server.use(express.static(path.join(__dirname, '../Client/public'), {
    index: false
}));

server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/public', 'index.html'));
});

server.get("/manifest.webmanifest", (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/public/manifest.webmanifest"));
});

server.use('/api/tree', treeRoutes);


server.get("/session", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).json({ session: req.session });
});


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on("uncaughtException", (err) => {
    console.error(" Uncaught error:", err);
    process.exit(1);
});
