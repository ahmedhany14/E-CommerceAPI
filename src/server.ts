import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
const mongo_sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const helmet = require('helmet')
const limitRate = require('express-rate-limit')
import session from 'express-session';
import { AppRouter } from "./app";
import { connectDB } from './DBconnection';

dotenv.config({ path: 'config.env' });

// Controllers
import './Models/auth/auth-controller';


const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev')); // for logging requests in console 
app.use(express.json({})); // for parsing application/json
app.use(mongo_sanitize()); // for preventing nosql injection
app.use(xss()); // for preventing xss attacks
app.use(helmet()); // for setting security headers
app.use(limitRate({ windowMs: 60 * 60 * 1000, max: 100, message: 'Too many requests' })) // for limiting requests
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 10000
    }
}));


app.get('/', (req, res) => {
    res.send('Hello from express');
});


app.use('/ecommerce', AppRouter.getInstance());

const PORT = process.env.PORT;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT} hit http://localhost:${PORT}`);
});