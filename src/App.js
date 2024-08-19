import './App.css';

import { DatePickerSample } from './components/datePicker';
import { AutoCompleteSample } from './components/autoComplete';

function App() {
  return (
    <div style={{margin: 10}}>
      <AutoCompleteSample/>
      <DatePickerSample/>
    </div>
  );
}

export default App;
