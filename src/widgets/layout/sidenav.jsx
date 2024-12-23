import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { XMarkIcon, PowerIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from '../../AuthContext';
import profileImage from "../../../public/img/profile.png"

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const { logout } = useAuth();
  const [user, setUser] = useState({
    firstName: 'Sruthi',
    lastName: '',
    profileImage: profileImage, // Set directly to the imported image
    role: '',
    designation: '',
    email: ''
  });
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-gray-600 shadow-sm",
    transparent: "bg-transparent",
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (email) {
          const response = await axios.get(`http://localhost:5000/api/users?email=${email}`);
          const usersArray = response.data;
    
          const userData = usersArray.find(user => user.emailAddress === email);
          if (userData) {
            setUser({
              firstName: userData.firstName || 'Sruthi',
              lastName: userData.lastName || 'B',
              profileImage: userData.profileImage || profileImage, // Use the imported image
              role: userData.role,
              designation: userData.designation,
              email: userData.emailAddress
            });
          } else {
            console.error('User not found');
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('sessionId');
    try {
      // await axios.post('http://localhost:5000/api/users/logout', { sessionId });
  
      // Clear localStorage and redirect to login page
      localStorage.removeItem('userEmail');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);

    }
  };

  
  const navigateToProfile = (user) => {
    if (user.role === 'admin') {
      navigate(`/dashboard/profile`, { state: { userData: user } });
    } else if (user.role === 'developer') {
      navigate(`/dev-dashboard/profile`, { state: { userData: user } });
    } else {
      // Handle other roles or conditions as needed
    }
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 flex flex-col justify-between`}
    >
      <div className="relative text-white">
        <div 
          onClick={() => navigateToProfile(user)}
          className="block py-6 px-8 text-center cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <Avatar
              src={user.profileImage}
              alt="User Image"
              size="large"
              color={sidenavType === "white"}
              className="mb-2"
            />
            <Typography
              variant="h6"
              color={sidenavType === "white"}
              className="text-center"
            >
              {user.firstName} {user.lastName}
            </Typography>
          </div>
        </div>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>



      <div className="m-4 flex-1 overflow-y-auto">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "white"
                      }
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="m-4">
        <Button
          variant="gradient"
          color="white"
          className="flex items-center gap-4 px-20 capitalize"
          fullWidth
          onClick={handleLogout}
        >
          <PowerIcon className="h-5 w-5" />
          <Typography
            color="inherit"
            className="font-medium text-center capitalize"
          >
            Logout
          </Typography>
        </Button>
      </div>
    </aside>
  );
}

Sidenav.propTypes = {
  brandImg: PropTypes.string.isRequired,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "Sidenav";

export default Sidenav;
