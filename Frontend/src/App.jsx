import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from './Signin';
import Signup from './Signup';
import Homepage from './Homepage';
import AboutUs from './AboutUs';
import MedicationDashboard from './Dashboard';
import EditMedicine from './EditPage';
import AddMedicine from './AddMedicine';
import Profile from './Profile';
import MedicineLog from './MedicineLog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/add" element={<AddMedicine />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/log" element={<MedicineLog />} />
        <Route path="/dashboard" element={<MedicationDashboard />} />
        <Route path="/edit-medicine" element={<EditMedicine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;