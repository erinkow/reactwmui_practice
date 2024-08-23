import { MongoClient } from 'mongodb';
import { validationResult } from 'express-validator';
import getCoordsForAddress from './util/location.js';
import HttpError from './models/http-error.js';

const url = 'mongodb+srv://eriko034:AsQbIwkUPKgK5b49@cluster0.wpmw9.mongodb.net/mern_project?retryWrites=true&w=majority&appName=Cluster0';

export const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors)
        throw new HttpError('Invalid input passed, please check your data', 422);
    }

    const { title, description, address, creator } = req.body;
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const place = {
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db();
        const result  = await db.collection('place').insertOne(place);
        place._id = result.insertedId;

    } catch(err) {
        return res.json({message: 'Could not store the data'}, err);

    } finally {
        client.close();
    }
    res.status(201).json({place});
}

export const getAllPlaces = async (req, res, next) => {
    const client = new MongoClient(url);

    let place;

    try {
        await client.connect();
        const db = client.db();
        place = await db.collection('place').find().toArray();

    } catch(err) {
        return next(new HttpError('Could not fetch the data', 404));
    } finally {
        client.close();
    };

    if (!place || place.length === 0) {
        return next(new HttpError('No places exit', 404));
    }

    res.status(201).json({place})
}

export const getPlaceById = async (req, res, next) => {
    const client = new MongoClient(url);

    let places;

    try {
        await client.connect();
        const db = client.db();
        places = await db.collection('place').find().toArray();
    } catch (err) {
        return res.json({message: 'Could not find such data.'}, err)
    } finally {
        client.close();
    };

    if (!place || place.length === 0) {
        return next(new HttpError('Node places found', 404));
    }
    res.status(201).json({places})
}
