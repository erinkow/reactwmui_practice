import express from 'express';
import { check } from 'express-validator';
import {
  getPlacesByUserId,
  updatePlace,
  deletePlace,
} from '../controllers/place-controller.js';
import { createPlace, getPlaceById, getAllPlaces } from '../mongo.js';

export const router = express.Router();

router.get('/', getAllPlaces);
router.get('/:pid', getPlaceById);

router.get('/user/:uid', getPlacesByUserId);

router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  createPlace
);

router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5 }),
    ],
    updatePlace
);

router.delete('/:pid', deletePlace);
