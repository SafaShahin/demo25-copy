import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import { v4 as uuidv4 } from 'uuid';
import HTTP_CODES from './api-tests/utils/httpCodes.mjs';
import treeRoutes from './routes/treeRoutes.js';

const server = express();
const port = process.env.PORT || 8000;

mongoose.connect('mongodb://localhost:27017/sessiondb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("Error connecting to MongoDB:", err));

const MongoStore = connectMongo.create({
    mongoUrl: 'mongodb://localhost:27017/sessiondb',
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

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
