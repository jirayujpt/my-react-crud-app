import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const App = () => {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    id: null,
    firstname: "",
    lastname: "",
    nickname: "",
    birthdate: "",
    gender: "ชาย",
  });

  const [statusMessage, setStatusMessage] = useState(""); // สถานะข้อความ

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/profiles");
      setProfiles(data);
    } catch (err) {
      setStatusMessage("Error fetching profiles: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`http://localhost:5000/profiles/${form.id}`, form);
        setStatusMessage("Profile updated successfully");
      } else {
        await axios.post("http://localhost:5000/profiles", form);
        setStatusMessage("Profile added successfully");
      }
  
      setForm({
        id: null,
        firstname: "",
        lastname: "",
        nickname: "",
        birthdate: "",
        gender: "ชาย",
      });
  
      fetchProfiles();
    } catch (err) {
      console.error("Error:", err);  // ตรวจสอบข้อผิดพลาดใน console
      setStatusMessage("Error: " + (err.response?.data?.message || err.message));
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/profiles/${id}`);
      setStatusMessage("Profile deleted successfully");
      fetchProfiles();
    } catch (err) {
      setStatusMessage("Error deleting profile: " + err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (profile) => {
    setForm(profile);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profiles</h1>
      <h1>เพื่องาน</h1>

      {statusMessage && <p>{statusMessage}</p>} {/* แสดงข้อความสถานะ */}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Firstname"
          value={form.firstname}
          onChange={(e) => setForm({ ...form, firstname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Lastname"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nickname"
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        />
        <input
          type="date"
          value={form.birthdate}
          onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
        />
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="ชาย">ชาย</option>
          <option value="หญิง">หญิง</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
        <button type="submit">
          {form.id ? "Update Profile" : "Add Profile"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Nickname</th>
            <th>Birthdate</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td>{profile.firstname}</td>
              <td>{profile.lastname}</td>
              <td>{profile.nickname}</td>
              <td>{profile.birthdate}</td>
              <td>{profile.gender}</td>
              <td>
                <button onClick={() => handleEdit(profile)}>Edit</button>
                <button onClick={() => handleDelete(profile.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
