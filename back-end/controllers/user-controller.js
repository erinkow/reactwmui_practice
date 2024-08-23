import HttpError from '../models/http-error.js';
import { validationResult } from 'express-validator';
import User from '../models/user.js';

export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, { password: 0 });
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed. Please try again later',
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid value input. Please check the data', 422)
    );
  }

  console.log('validation passed');

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Siging up error! Please try again later', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User aleady exists. Please login instead',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    places: [], //Array.isArray(places) ? places : [places]
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Creating user failed. Please try again', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed. Please try again later',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError(
        'Could not identify user, credentials seem to be wrong',
        401
      )
    );
  }

  res.json({ message: `${existingUser.name} logged in!` });
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;
  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Could not find the user for that id', 500);
    return next(error);
  }

  try {
    await user.deleteOne();
  } catch (err) {
    const error = new HttpError('Could not remove the user', 500)
    return next(error);
  }

  res.status(200).json({ message: 'User deleted.' });
};
