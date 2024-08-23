import { Autocomplete, TextField } from "@mui/material"
import { useState } from 'react';
import { selectAddress } from "../data";
import axios from 'axios';

export const AutoCompleteSample = () => {
  const [selectedPref, setSelectedPref] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([])

  const handlePrefChange = (e, val) => {
    setSelectedPref(val);

    if(val) {
      const selectedCities = selectAddress
        .filter(address => address.prefId === val.prefId)
        .map(address => address.city)
        .flat();

      setCityOptions(selectedCities)
      setSelectedCity(null);

    } else {
      setCityOptions([]);
      setSelectedCity(null);
    }
  };

  const handleCityChange = (e, val) => {
    setSelectedCity(val);
  }

  const handleSubmit = async () => {
    let data;
    if (selectedPref && selectedCity) {
      data = {
        prefecture: selectedPref.prefName,
        city: selectedCity.cityName
      }
    };

    try {
      const response = await axios.post('http://localhost:5001/api/place', data);
      console.log('Data successfully sent to the backend', response.data)
    } catch (err) {
      console.error('Error sending data to the backend', err)
    }
  }

    return(
        <>
            <p style={{fontWeight: 'bold'}}>目的地を選択してください</p>
            <div className='App' style={{marginBottom: 5}}>
                <Autocomplete
                disablePortal
                id='pref-select'
                options={selectAddress}
                getOptionLabel={(option) => option.prefName}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label='Prefecture' />}
                onChange={handlePrefChange}
                value={selectedPref}
                />
            </div>
            <div>
                <Autocomplete
                disablePortal
                id='city-select'
                options={cityOptions}
                getOptionLabel={(option) => option.cityName}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label='city' />}
                disabled={cityOptions.length === 0}
                onChange={handleCityChange}
                value={selectedCity}
                />
            </div>
            <div>
                {selectedCity ? (
                <p>選択した都市：{selectedCity.cityName}</p> 
                ) : (
                <p>選択された都市はありません</p>
                )}
            </div>
        </>
    )
}
