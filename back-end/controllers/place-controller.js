import HttpError from '../models/http-error.js';
import { validationResult } from 'express-validator';
import getCoordsForAddress from '../util/location.js';
import Place from '../models/place.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

export const getPlaceById = async (req, res, next) => {
  console.log('request params:', req.params);
  const placeId = req.params.pid;
  console.log('Requested Place ID:', placeId);

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError('Could not find a place for the provided id', 500)
    );
  }

  if (!place) {
    return next(new HttpError('No place found for the provided id', 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

export const getAllPlaces = async (req, res, next) => {
  let places;
  try {
    places = await Place.find().exec();
  } catch (err) {
    return next(new HttpError(err));
  }

  if (!places || places === 0) {
    return next(new HttpError('No places exist', 404));
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

export const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed. Please try again.',
      500
    );
    return next(error);
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

export const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid Input passed. Please check your data', 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    return next(err);
  }

  const location = {
    lat: coordinates.lat,
    lng: coordinates.lng,
  };

  const createdPlace = new Place({
    title,
    description,
    location,
    address,
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating place failed. Please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    return next(
      new HttpError(
        'Could not find the user for provided id. Please try again later',
        404
      )
    );
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    console.log(errors);
    throw new HttpError('Invalid value updated, please check your data', 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong. Could not update place.',
      500
    );
    return next(error);
  }

  //   const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  //   const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong. Could not update the place',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

export const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong. Could not delete the place',
      500
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError('Could not find the place for that id.', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Could not remove the place', 500);
    return next(error);
  }

  res.status(200).json({ message: `Deleted place ${place.id}` });
};
