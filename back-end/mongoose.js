import mongoose from 'mongoose';
import Place from './models/place.js';
import { validationResult } from 'express-validator';
import HttpError from './models/http-error.js';
import getCoordsForAddress from './util/location.js';

mongoose.connect(
  'mongodb+srv://eriko034:AsQbIwkUPKgK5b49@cluster0.wpmw9.mongodb.net/mern_project?retryWrites=true&w=majority&appName=Cluster0'
).then(() => {
    console.log('Connected to database');
}).catch(() => {
    console.log('Connection failed');
});

export const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next(new HttpError('Invalid Input passed. Please check your data', 422));
  }

  const { title, description, address, creator } = req.body;
  
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch(err) {
    return next(err);
  }

  const location = {
    lat: coordinates.lat,
    lng: coordinates.lng
  }

  const createdPlace = new Place({
    title,
    description,
    location,
    address,
    creator,
  });

  const result = await createdPlace.save();
  res.json(result);
};

export const getAllPlaces = async (req, res, next) => {
    let places;
    try {
        places = await Place.find().exec();    
    } catch(err) {
        return next(new HttpError(err));
    };

    if(!places || places === 0) {
        return next(new HttpError('No places exist', 404));
    }

    res.json(places);
}

export const getPlaceById = async (req, res, next) => {
    console.log('request params:', req.params)
    const placeId = req.params.pid;
    console.log("Requested Place ID:", placeId); 

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Could not find a place for the provided id', 500));
    };

    if (!place) {
        return next(new HttpError('No place found for the provided id', 404));
    };

    res.json({place});
}
