// import { Routes, Route } from "react-router-dom";
// import { Cog6ToothIcon } from "@heroicons/react/24/solid";
// import { IconButton } from "@material-tailwind/react";
// import {
//   Sidenav,
//   DashboardNavbar,
//   Configurator,
//   Footer,
// } from "@/widgets/layout";
// import routes from "@/routes";
// import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
// import { Groups, Profile } from "@/pages/Admin-dashboard";  // Make sure this import is correct based on your folder structure

// export function Dashboard() {
//   const [controller, dispatch] = useMaterialTailwindController();
//   const { sidenavType } = controller;

//   return (
//     <div className="min-h-screen bg-blue-gray-50/50">
//       {/* <Sidenav
//         routes={routes}
//         brandImg={
//           sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
//         }
//       /> */}
//       // Assuming you have fetched user data and set it in state somewhere in your parent component
//       <Sidenav brandImg={user.image} brandName={user.name} routes={routes} />

//       <div className="p-4 xl:ml-80">
//         <DashboardNavbar />
//         <Configurator />
//         <IconButton
//           size="lg"
//           color="white"
//           className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
//           ripple={false}
//           onClick={() => setOpenConfigurator(dispatch, true)}
//         >
//           <Cog6ToothIcon className="h-5 w-5" />
//         </IconButton>
//         <Routes>
//           {routes.map(
//             ({ layout, pages }) =>
//               layout === "dashboard" &&
//               pages.map(({ path, element }) => (
//                 <Route exact path={path} element={element} />
//               ))
//           )}
//           <Route path="profile" element={<Profile />} /> 
//         </Routes>
//         <div className="text-blue-gray-600">
//         </div>
//       </div>
//     </div>
//   );
// }

// Dashboard.displayName = "/src/layout/dashboard.jsx";

// export default Dashboard;


// import { Routes, Route } from "react-router-dom";
// import { Cog6ToothIcon } from "@heroicons/react/24/solid";
// import { IconButton } from "@material-tailwind/react";
// import {
//   Sidenav,
//   DashboardNavbar,
//   Configurator,
//   Footer,
// } from "@/widgets/layout";
// import routes from "@/routes";
// import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
// import { Groups, Profile } from "@/pages/Admin-dashboard"; // Check this import path based on your actual folder structure

// export function Dashboard() {
//   const [controller, dispatch] = useMaterialTailwindController();
//   const { sidenavType } = controller;

//   return (
//     <div className="min-h-screen bg-blue-gray-50/50">
//       <Sidenav brandImg={user.image} brandName={user.name} routes={routes} />

//       <div className="p-4 xl:ml-80">
//         <DashboardNavbar />
//         <Configurator />
//         <IconButton
//           size="lg"
//           color="white"
//           className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
//           ripple={false}
//           onClick={() => setOpenConfigurator(dispatch, true)}
//         >
//           <Cog6ToothIcon className="h-5 w-5" />
//         </IconButton>
//         <Routes>
//           {routes.map(({ layout, pages }) =>
//             layout === "dashboard" &&
//             pages.map(({ path, element }) => (
//               <Route key={path} exact path={path} element={element} />
//             ))
//           )}
//           <Route path="/profile" element={<Profile />} /> {/* Adjust path as needed */}
//         </Routes>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// Dashboard.displayName = "Dashboard";

// export default Dashboard;


// import { Routes, Route } from "react-router-dom";
// import { Cog6ToothIcon } from "@heroicons/react/24/solid";
// import { IconButton } from "@material-tailwind/react";
// import {
//   Sidenav,
//   DashboardNavbar,
//   Configurator,
//   Footer,
// } from "@/widgets/layout";
// import routes from "@/routes";
// import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
// import { Groups, Profile } from "@/pages/Admin-dashboard"; // Check this import path based on your actual folder structure
// import { useEffect, useState } from "react";
// import axios from "axios";

// export function Dashboard() {
//   const [controller, dispatch] = useMaterialTailwindController();
//   const { sidenavType } = controller;
//   const [user, setUser] = useState({
//     name: '',
//     image: ''
//   });
//   const [loading, setLoading] = useState(true); // Track loading state

//   console.log(user.name);
//   console.log(user.image);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const email = localStorage.getItem('userEmail');
//         if (email) {
//           const response = await axios.get(`http://localhost:5000/api/users?email=${email}`);
//           const usersArray = response.data;

//           console.log('Fetched user data:', usersArray);
          

//           const userData = usersArray.find(user => user.emailAddress === email);
//           console.log(userData);
//           if (userData) {
//             setUser({
//               name: `${userData.firstName} ${userData.lastName}`,
//               image: `http://localhost:5000/uploads/${userData.profileImage}`
//             });
//           } else {
//             console.error('User not found');
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//       } finally {
//         setLoading(false); // Set loading to false once done fetching
//       }
//     };
//     fetchUserDetails();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>; // Adjust loading indicator as needed
//   }

//   return (
//     <div className="min-h-screen bg-blue-gray-50/50">
//       <Sidenav brandImg={user.image} brandName={user.name} routes={routes} />

//       <div className="p-4 xl:ml-80">
//         <DashboardNavbar />
//         <Configurator />
//         <IconButton
//           size="lg"
//           color="white"
//           className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
//           ripple={false}
//           onClick={() => setOpenConfigurator(dispatch, true)}
//         >
//           <Cog6ToothIcon className="h-5 w-5" />
//         </IconButton>
//         <Routes>
//           {routes.map(({ layout, pages }) =>
//             layout === "dashboard" &&
//             pages.map(({ path, element }) => (
//               <Route key={path} exact path={path} element={element} />
//             ))
//           )}
//           <Route path="/profile" element={<Profile />} /> {/* Adjust path as needed */}
//         </Routes>
//         {/* <Footer /> */}
//       </div>
//     </div>
//   );
// }

// Dashboard.displayName = "Dashboard";

// export default Dashboard;


import { Routes, Route, Navigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { Groups, Profile } from "@/pages/Admin-dashboard"; // Check this import path based on your actual folder structure
import { useEffect, useState } from "react";
import axios from "axios";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [user, setUser] = useState({
    name: '',
    profileImage: '',
    role:'',
    designation:'',
    email:''
  });
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (email) {
          const response = await axios.get(`http://localhost:5000/api/users?email=${email}`);
          const usersArray = response.data;

          const userData = usersArray.find(user => user.emailAddress === email);
          console.log('userDataFrom dashboard:',userData)
          if (userData) {
            setUser({
              name: `${userData.firstName} ${userData.lastName}`,
              profileImage: `http://localhost:5000/uploads/${userData.profileImage}`,
              role:`${userData.role}`,
              designation:`${userData.designation}`,
              email:`${userData.emailAddress}`
            });
          } else {
            console.error('User not found');
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false); // Set loading to false once done fetching
      }
    };
    fetchUserDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Adjust loading indicator as needed
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Sidenav brandImg={user.image} brandName={user.name} routes={routes} />

      <div className="px-4 py-6 xl:ml-80">
        <DashboardNavbar />
        {/* <Configurator /> */}
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          <Route path="/" element={<Navigate to="home" replace />} />
          {routes.map(({ layout, pages }) =>
            layout === "dashboard" &&
            pages.map(({ path, element }) => (
              <Route key={path} exact path={path} element={element} />
            ))
          )}
          <Route path="/profile" element={<Profile />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

Dashboard.displayName = "Dashboard";

export default Dashboard;
