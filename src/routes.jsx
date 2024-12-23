import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  UsersIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Acc, Docs, Groups, DataSource,} from "@/pages/Admin-dashboard";
import { Navigate } from "react-router-dom";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "accounts",
        path: "/acc",
        element: <Acc />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "docs",
        path: "/Docs",
        element: <Docs />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "groups",
        path: "/groups",
        element: <Groups />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Resources",
        path: "/DataSource",
        element: <DataSource />,
      },
      
    ],
  },
  

  
];

export default routes;
