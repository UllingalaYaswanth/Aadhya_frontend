import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuHandler, MenuList, MenuItem, Button, Typography } from '@material-tailwind/react';
import { XMarkIcon, PowerIcon, SquaresPlusIcon } from "@heroicons/react/24/outline"; // Importing SquaresPlusIcon here
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import profileImage from '../../../public/img/profile.png';


const Sidebar = ({ history, user, loadChat, handleNewChat, handleRename, handleDelete, handleArchive }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // const response = await axios.post('http://localhost:5000/api/users/logout');
      if (response.status === 200) {
        // Clear any necessary data from local storage
        localStorage.removeItem("userEmail");
        logout();
        // Navigate to the login page
        navigate("/");  // Ensure you navigate to the login route
      } else {
        console.error('Failed to log out:', response.data.error);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className=" w-80 h-full flex flex-col p-4 bg-gray-900" >
      <div className="flex mt-3  items-center space-x-4 justify-between">
        {/* <img src={user.image} alt="Logo" className="w-12 h-12 mb-3 ps-1 rounded" />
        <h2 className="text-xl font-semibold text-white">Hello! {`${user.name}`}</h2> */}
<div className="flex items-center justify-center">
  <img
    src={profileImage}
    alt="Profile"
    className="w-14 h-13 mb-3 ps-1 rounded-full"
  />
  <h2 className="text-xl font-semibold text-white ml-3">
    Sruthi {`${user.name}`}
  </h2>
</div>


        <button onClick={handleNewChat} className="focus:outline-none">
          <SquaresPlusIcon className="h-6 w-6 text-gray-600 text-hover-white" />
        </button>
      </div>

      <div className="flex justify-center items-center h-24">
        <h3 className="text-xl font-semibold text-white">History</h3>
      </div>

      <div className="flex-1 overflow-y-auto mt-2">
        {history.map((chatHistory, index) => (
          <div key={index} className="flex items-center justify-between p-2 text-gray-300 hover:bg-gray-800" onClick={() => loadChat(chatHistory)}>
            <span>{chatHistory.name || `Chat ${index + 1}`}</span>
            <Menu>
              <MenuHandler>
                <Button className="bg-transparent shadow-none px-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-5 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={(event) => { event.stopPropagation(); handleRename(index); }}>Rename</MenuItem>
                <MenuItem onClick={(event) => { event.stopPropagation(); handleDelete(index); }}>Delete</MenuItem>
                <MenuItem onClick={(event) => { event.stopPropagation(); handleArchive(index); }}>Archive</MenuItem>
              </MenuList>
            </Menu>
          </div>
        ))}
      </div>
      <div className="m-2 ">
        <Button
       
          className="flex items-center gap-4 px-10 capitalize bg-gradient-to-r from-red-500 to-orange-500  opacity-80"
          fullWidth
          onClick={handleLogout}
        >
          <PowerIcon className="h-5 w-5" />
          <Typography
            color="inherit"
            className="font-medium text-center capitalize "
          >
            Logout
          </Typography>
        </Button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  history: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  loadChat: PropTypes.func.isRequired,
  handleNewChat: PropTypes.func.isRequired,
  handleRename: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleArchive: PropTypes.func.isRequired
};

export default Sidebar;
