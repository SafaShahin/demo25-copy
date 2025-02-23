import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import { v4 as uuidv4 } from 'uuid';
import HTTP_CODES from './api-tests/utils/httpCodes.mjs';
import treeRoutes from './routes/treeRoutes.js';

const server = express();
const port = process.env.PORT;

//  environment variable for MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sessiondb';


console.log("Attempt to connect to MongoDB at:", MONGO_URI);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); 
});

const MongoStore = connectMongo.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions'
});

server.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore,
    cookie: { secure: false }
}));

server.use(express.json());
server.use(express.static('../public'));
server.use('/api/tree', treeRoutes);

server.get("/session", (req, res) => {
    if (!req.session.user) {
        req.session.user = { id: uuidv4() };
    }
    res.status(HTTP_CODES.SUCCESS.OK).send(`User session: ${JSON.stringify(req.session.user)}`);
});

// Root route
server.get("/", (req, res) => {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World');
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// errors hndlin  
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
