import axios from 'axios';
import HttpError from '../models/http-error.js';

const API_KEY = 'AIzaSyBRz4Q5bMNE8VYYayReQoNSz_mrSHN24pg';

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;
  console.log(data)

  if (!data || data.status === 'ZERO_RESULT') {
    const error = new HttpError(
      'Could not find location for the specified address',
      422
    );
    throw error;
  }

  const coordinates = data.results[0]?.geometry?.location;
  return coordinates;

}

export default getCoordsForAddress;