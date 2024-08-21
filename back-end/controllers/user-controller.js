import { v4 as uuidv4 } from 'uuid' 
import HttpError from '../models/http-error.js'
import { validationResult } from 'express-validator'

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Max Schwarz',
        email: 'test@test.com',
        password: 'testers'
    }
]

export const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS})
}

export const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        throw new HttpError('Invalid value input. Please check the data', 422);
    }

    console.log('validation passed')

    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if (hasUser) {
        throw new HttpError('Could not create user, email already exists.', 422);
    }

    const createUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createUser);

    res.status(201).json({user: createUser})
}

export const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong', 401);
    }

    res.json({message: `${identifiedUser.name} logged in!` });
}

export const deleteUser = (req, res, next) => {
    const userId = req.params.uid;
    const userIndex = DUMMY_USERS.findIndex(u => u.id === userId);

    if(userIndex === -1) {
        return next(new HttpError('Could not find a user for the provided id', 404));
    }

    DUMMY_USERS.splite(userIndex, 1);

    res.status(200).json({ message: 'Delete user.' });
}