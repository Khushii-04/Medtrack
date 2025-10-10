import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from './Signin';
import Signup from './Signup';
import Homepage from './Homepage';
import AboutUs from './AboutUs';
import MedicationDashboard from './Dashboard';
import EditMedicine from './EditPage';
import AddMedicine from './AddMedicine';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<MedicationDashboard />} />
        <Route path="/edit-medicine" element={<EditMedicine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;