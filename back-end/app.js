import express from 'express';
import bodyParser from 'body-parser';
import { router as placeRoutes } from './routes/place-routes.js';
import { router as userRoutes } from './routes/user-routes.js';
import mongoose from 'mongoose';

const app = express();

app.use(bodyParser.json());

// app.use((req, res, next) => {
//     const error = new HttpError('could not find this route', 404);
//     throw error
// })

app.use('/api/place', placeRoutes);
app.use('/api/user', userRoutes);

mongoose
  .connect(
    'mongodb+srv://eriko034:AsQbIwkUPKgK5b49@cluster0.wpmw9.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(
    app.listen(5001, () => {
      console.log('Listening to local port 5001');
    })
  )
  .catch((err) => {
    console.log(err);
  });
