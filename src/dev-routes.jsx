import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    UsersIcon,
    ServerStackIcon,
    RectangleStackIcon,
  } from "@heroicons/react/24/solid";
  import { Home, Acc, } from "@/pages/dev-dashboard";
  
  const icon = {
    className: "w-5 h-5 text-inherit",
  };
  
  export const routes = [
    {
      layout: "dev-dashboard",
      pages: [
        {
          icon: <HomeIcon {...icon} />,
          name: "dashboard",
          path: "/home",
          element: <Home />,
        },
        {
          icon: <UserCircleIcon {...icon} />,
          name: "Documents",
          path: "/documents",
          element: <Acc />,
        },
      ],
    },
   
    
  ];
  
  export default routes;
  