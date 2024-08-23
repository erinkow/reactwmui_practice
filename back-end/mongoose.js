import mongoose from 'mongoose';
import Place from './models/place.js';
import { validationResult } from 'express-validator';
import HttpError from './models/http-error.js';
import getCoordsForAddress from './util/location.js';

// mongoose.connect(
//   'mongodb+srv://eriko034:AsQbIwkUPKgK5b49@cluster0.wpmw9.mongodb.net/mern_project?retryWrites=true&w=majority&appName=Cluster0'
// ).then(() => {
//     console.log('Connected to database');
// }).catch(() => {
//     console.log('Connection failed');
// });






