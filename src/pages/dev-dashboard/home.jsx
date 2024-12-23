import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Tooltip,
  Chip
} from "@material-tailwind/react";

import {
  BanknotesIcon,
  UserGroupIcon,
  DocumentTextIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";

import { StatisticsCard } from "@/widgets/cards"; // Assuming this import is correct
import { projectsTableData } from "@/data"; // Assuming projectsTableData is defined somewhere

export function Home() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [overflowingRows, setOverflowingRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups , setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]); // State to hold documents data

  const toggleExpand = (index) => {
    setExpandedRow((prevIndex) => (prevIndex === index ? null : index));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp); // Corrected timestamp usage
    return date.toLocaleString();
  };

  useEffect(() => {
    // Function to fetch users data
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data); // Update users state with fetched data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Function to fetch documents data
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/files');
        setDocuments(response.data); // Update documents state with fetched data
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    const fetchGroups = async () => {
      try{
        const response = await axios.get('http://localhost:5000/api/admin/groups');
        setGroups(response.data);
      }catch (error) {
        console.error('Error fetching Groups:', error)
      }
    }

    fetchGroups()
    fetchUsers(); // Call fetchUsers function on component mount
    fetchDocuments(); // Call fetchDocuments function on component mount
  }, []);


  useEffect(() => {
    const newOverflowingRows = [];

    projectsTableData.forEach((_, index) => {
      const textElement = document.getElementById(`query-text-${index}`);
      const containerElement = document.getElementById(`query-container-${index}`);
      if (textElement && containerElement) {
        if (textElement.scrollWidth > containerElement.clientWidth) {
          newOverflowingRows.push(index);
        }
      }
    });

    setOverflowingRows(newOverflowingRows);
  }, [projectsTableData]);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserAdded = () => {
    // Handle user added logic
  };

  const toggleAddUserPopup = () => {
    setIsAddUserOpen(prev => !prev);
  };
  

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard
          title="Total Documemts"
          icon={<BanknotesIcon className="w-6 h-6 text-white" />}
          value={documents.length} // Use users state to get the count of users
          color="gray"
        />
        <StatisticsCard
          title="Recently Uploaded"
          icon={<UserGroupIcon className="w-6 h-6 text-white" />}
          value={groups.length}
          color="gray"
        />
        <StatisticsCard
          title="Processing"
          icon={<DocumentTextIcon className="w-6 h-6 text-white" />}
          value={documents.length}
          color="gray"
        />
        <StatisticsCard
          title="Failed"
          icon={<FlagIcon className="w-6 h-6 text-white" />}
          value="53"
          color="gray"
        />
      </div>


      <div className="mb-4 mt-12 grid grid-cols-1 gap-5 xl:grid-cols-1">
        <Card className="overflow-hidden">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Documents
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto max-h-[400px] overflow-y-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr className="items-center">
                  {["name", "uploaded On", "access level","Status", "keyword"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents.map(
                  ({ name, level, createdAt }, key) => {
                    const className = `py-3 px-5 ${
                      key === documents.length - 1 ? "" : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {formatDate(createdAt)}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium ps-7 text-blue-gray-600"
                          >
                            {level}
                          </Typography>
                        </td>
                        <td className={className}>
                          {/* Empty cell for now */}
                        </td>
                        <td className={className}>
                          {/* Empty cell for now */}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

    </div>
  );
}

export default Home;
