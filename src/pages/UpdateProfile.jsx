import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UpdateProfile.css'; 

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    vehiclePlate: '',
    vehicleModel: '',
    licenseNumber: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/taxidriver/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/taxidriver/update', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Profile updated!');
      navigate('/driver-dashboard');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('❌ Update failed');
    }
  };

  return (
    <div className="update-profile-container">
      <h2>📝 Update Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
        <input name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange} placeholder="Vehicle Plate" />
        <input name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="Vehicle Model" />
        <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="License Number" />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
