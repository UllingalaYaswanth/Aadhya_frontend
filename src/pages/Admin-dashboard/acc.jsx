import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

function AddUserForm({ isOpen, onClose, onUserAdded }) {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [designation, setDesignation] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('firstName', firstname);
      formData.append('lastName', lastname);
      formData.append('emailAddress', email);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('level', level);
      formData.append('profileImage', profileImage);
      formData.append('designation', designation);

      const response = await axios.post('http://localhost:5000/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onUserAdded(response.data.user);
      setSuccessMessage('User added successfully!');
      onClose();
    } catch (error) {
      setError('Error adding user: ' + error.message);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" id="firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 lg:text-lg" required />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" id="lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 lg:text-lg" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 lg:text-lg" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 lg:text-lg" required />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 lg:text-lg" required>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
            <input type="text" id="level" value={level} onChange={(e) => setLevel(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 lg:text-lg" required />
          </div>
          <div className="mb-4">
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input type="file" id="profileImage" onChange={handleProfileImageChange} className="mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 lg:text-lg" accept="image/*" />
          </div>
          <div className="mb-4">
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
            <input type="text" id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 lg:text-lg" required />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300">Cancel</button>
            <button type="submit" onClick={clearMessages} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Acc() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const toggleAddUserPopup = () => {
    setIsAddUserOpen(!isAddUserOpen);
  };

  const navigateToProfile = (user) => {
    navigate(`/dashboard/profile`, { state: { userData: user } });

};

  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
          <div className="flex items-center gap-4">
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Accounts
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-4"
            />
      <button onClick={toggleAddUserPopup} className="px-4 py-1 bg-indigo-500 text-white rounded-md focus:outline-none">
  Create
</button>

          </div>
        </CardHeader>
        <CardBody className="max-h-[735px] overflow-y-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["author", "function", "status", "employed", ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(
                ({ firstName, lastName, emailAddress, role, profileImage, online, createdAt, _id, designation }, key) => {
                  const className = `py-3 px-5 ${
                    key === users.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={`http://localhost:5000/uploads/${profileImage}`} alt={firstName} size="sm" variant="rounded" />
                          <div>
                          <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold cursor-pointer"
                              onClick={() => navigateToProfile({         
                                firstName,
                                lastName,
                                emailAddress,
                                role,
                                profileImage,
                                online,
                                createdAt,
                                _id,
                                designation
                              })}
                            >
                              {firstName} {lastName}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {emailAddress}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold cursor-pointer"

                        >
                          {designation}
                        </Typography>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {role}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={online ? "green" : "blue-gray"}
                          value={online ? "online" : "offline"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(createdAt).toLocaleDateString()}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <AddUserForm isOpen={isAddUserOpen} onClose={toggleAddUserPopup} onUserAdded={handleUserAdded} />
    </div>
  );
}

export default Acc;


