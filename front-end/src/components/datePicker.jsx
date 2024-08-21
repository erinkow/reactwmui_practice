import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import { DateField } from '@mui/x-date-pickers/DateField'; 


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
                    <DateField label='From' minDate={today} maxDate={toVal} defaultValue={today} format='YYYY/MM' onChange={val => setFromVal(val)} />
                    <DateField label='To' value={toVal} format='YYYY/MM' minDate={fromVal} onChange={(val) => setToValue(val)}/>
                </DemoContainer>
            </LocalizationProvider>
        </div>
    )
}