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
          title="Accounts"
          icon={<BanknotesIcon className="w-6 h-6 text-white" />}
          value={users.length} // Use users state to get the count of users
          color="gray"
        />
        <StatisticsCard
          title="Groups"
          icon={<UserGroupIcon className="w-6 h-6 text-white" />}
          value={groups.length}
          color="gray"
        />
        <StatisticsCard
          title="Docs"
          icon={<DocumentTextIcon className="w-6 h-6 text-white" />}
          value={documents.length}
          color="gray"
        />
        <StatisticsCard
          title="Flags"
          icon={<FlagIcon className="w-6 h-6 text-white" />}
          value="53"
          color="gray"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-5 xl:grid-cols-1 ">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Flags
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr className="items-center">
                  {["Name", "Document", "Timestamp", "Query"].map((el, index) => (
                    <th
                      key={index}
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
                {projectsTableData.map(({ img, name, timestamp, document, query }, key) => {
                  const className = `py-3 px-5 ${
                    key === projectsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;
                  const isExpanded = expandedRow === key;
                  const isOverflowing = overflowingRows.includes(key);

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-3">
                          <Avatar src={img} alt={name} size="sm" />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {document}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {formatDate(timestamp)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div
                          className="flex items-center w-full max-w-[300px]"
                          id={`query-container-${key}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleExpand(key)}
                        >
                          <Typography
                            variant="small"
                            className={`text-xs font-medium text-blue-gray-600 ${isExpanded ? "" : "truncate"}`}
                            id={`query-text-${key}`}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: isExpanded ? "normal" : "nowrap",
                            }}
                          >
                            {query}
                          </Typography>
                          {isOverflowing && !isExpanded && (
                            <Tooltip content="Show more">
                              <span className="text-blue-gray-400 ml-1">...</span>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

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
          </CardHeader>
          <CardBody className="max-h-[500px] overflow-y-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Name", "Designation", "Status", "Employed", ""].map((el, index) => (
                    <th
                      key={index}
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
                {filteredUsers.map(({ firstName, lastName, emailAddress, role, profileImage, online, createdAt, _id, designation }, key) => {
                  const className = `py-3 px-5 ${
                    key === filteredUsers.length - 1
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
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
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
                  {["name", "uploaded On", "access level", "keyword"].map((el) => (
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
                            className="text-xs ps-7 font-medium text-blue-gray-600"
                          >
                            {level}
                          </Typography>
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
