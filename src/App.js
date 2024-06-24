import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UploadAndRecommend from './components/UploadAndRecommend';
import { getCsrfToken } from './csrf';
import './App.css';
import CustomModal from './components/CustomModal';
import MainPageFa from './components/MainPageFa';

const App = () => {
  useEffect(() => {
    getCsrfToken();
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/en" element={<UploadAndRecommend />} />
          <Route path='/' element={<MainPageFa />} />

          {/* <Route path='/modal' element={<CustomModal />} /> */}

        </Routes>
      </div>
    </Router>
  );
};

export default App;

