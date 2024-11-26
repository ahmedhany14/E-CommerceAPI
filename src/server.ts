import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';
const xss = require('xss-clean')
const helmet = require('helmet')
import { AppRouter } from "./app";
import session from 'express-session';
import { connectDB } from './DBconnection';
const limitRate = require('express-rate-limit')
import { AppError } from './Common/utils/AppError';
const mongo_sanitize = require('express-mongo-sanitize')
import { catchErrors } from './Common/utils/catchErrors';

dotenv.config({ path: 'config.env' });

// Controllers
import './Models/Profile/Seller/seller-controller';
import './Models/FeedBacks/feedback-controller'
import './Models/BookMarks/bookmark-controller';
import './Models/Products/product-controller';
import './Models/Profile/profile-controller';
import './Models/Account/account-controller';
import './Models/auth/auth-controller';
import './Models/Cart/cart-controller';

const app = express();

if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));
app.use(xss());
app.use(helmet());
app.use(express.json({}));
app.use(mongo_sanitize());
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 10000
    }
}));
app.use(limitRate({ windowMs: 60 * 60 * 1000, max: 100, message: 'Too many requests' }))


app.get('/', (req, res) => { res.send('Hello from express'); });


app.use('/ecommerce', AppRouter.getInstance());

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(catchErrors);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT} hit http://localhost:${PORT}`);
});