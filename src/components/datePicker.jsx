import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';


export const DatePickerSample = () => {
    const today = dayjs();
    const oneMonthLater = today.add(1, 'year');
    const [fromVal, setFromVal] = useState(today)
    const [toVal, setToValue] = useState(oneMonthLater);

    return(
        <div>
            <p style={{fontWeight: 'bold'}}>滞在期間を選択してください</p>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker', 'DatePicker']} >
                    <DatePicker label='From' minDate={today} defaultValue={today} onChange={val => setFromVal(val)}/>
                    <DatePicker label='To' value={toVal} onChange={(val) => setToValue(val)} minDate={fromVal}/>
                </DemoContainer>
            </LocalizationProvider>
        </div>
    )
}