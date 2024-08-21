import express from 'express';
import bodyParser from 'body-parser';
import { router as placeRoutes } from './routes/place-routes.js';
import { router as userRoutes } from './routes/user-routes.js';
import HttpError from './models/http-error.js';


const app = express();

app.use(bodyParser.json());

// app.use((req, res, next) => {
//     const error = new HttpError('could not find this route', 404);
//     throw error
// })

app.use('/api/place', placeRoutes);
app.use('/api/user', userRoutes);

app.listen(5001, () => {
    console.log('Listening to local port 5001');
})