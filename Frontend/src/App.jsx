import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import AboutUs from './components/AboutUs';
import MedicationDashboard from './components/Dashboard';
import EditMedicine from './components/EditPage';
import AddMedicine from './components/AddMedicine';
import Profile from './components/Profile';
import MedicineLog from './components/MedicineLog';
import MedicalChatbot from './components/Chatbot';

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
        <Route path="/chatbot" element={<MedicalChatbot/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;