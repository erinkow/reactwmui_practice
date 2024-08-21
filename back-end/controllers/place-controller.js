import HttpError from '../models/http-error.js';
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator';
import getCoordsForAddress from '../util/location.js';

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famouse sky scrapers in the world',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    },
];

export const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    })
    if(!place) {
        throw new HttpError('Could not find a place for the provided id.', 404);
    }
    res.json({place});
}

export const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(u => {
        return u.creator === userId;
    })
    if(!places || places.length === 0) {
        return next(
            new HttpError('Could not find a place for the provided user id.', 404)
        );
    }
    res.json({places});
}

export const createPlace = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors)
        throw new HttpError('Invalid input passed, please check your data', 422);
    }
    const { title, description, address, creator} = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);


    } catch (error) {
        return next(error);
    }

    const createPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createPlace);

    res.status(201).json({place: createPlace});
}


export const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        console.log(errors);
        throw new HttpError('Invalid value updated, please check your data', 422);
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: updatePlace})
}

export const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError('Could not find the place for that id.', 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    res.status(200).json({message: `Deleted place ${placeId}`})
}