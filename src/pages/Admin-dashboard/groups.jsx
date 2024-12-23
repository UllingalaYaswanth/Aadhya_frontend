import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
} from "@material-tailwind/react";
import axios from "axios";
import Select from "react-select";

// UserDisplay Component
const UserDisplay = ({ user }) => {
  return (
    <tr>
      <td className="py-3 px-5">
        <div className="flex items-center gap-4">
          <Avatar
            src={user.profileImage || "https://via.placeholder.com/150"}
            alt="User"
            size="sm"
            variant="rounded"
          />
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-semibold"
            >
              {user.firstName} {user.lastName}
            </Typography>
          </div>
        </div>
      </td>
      <td className="py-3 px-5">
        <Typography className="text-xs font-normal text-blue-gray-500">
          {user.emailAddress}
        </Typography>
      </td>
      <td className="py-3 px-5">
        <Typography className="text-xs font-semibold text-blue-gray-600">
          {user.role}
        </Typography>
      </td>
    </tr>
  );
};

// Groups Component
const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [newGroup, setNewGroup] = useState({
    name: '',
    selectedUsers: [],
    selectedDocuments: [],
    access_level: 'Private',
  });
  const [open, setOpen] = useState(false);
  const [documentsOptions, setDocumentsOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchUsers();
    fetchDocuments();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      const usersData = response.data.map(user => ({ value: user._id, label: `${user.firstName} ${user.lastName} (${user.emailAddress}) (${user.role}) (${user.profileImage})` }));
      setUsers(response.data);
      setUserOptions(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files');
      const documentsData = response.data.map(doc => ({ value: doc.name, label: doc.name }));
      setDocumentsOptions(documentsData);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleGroupClick = async (groupId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/groups/${groupId}`);
      setSelectedGroup(response.data);
    } catch (error) {
      console.error('Error fetching group details:', error);
    }
  };

  const handleBackClick = () => {
    setSelectedGroup(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  const handleUserSelectChange = (selectedOptions) => {
    setNewGroup({ ...newGroup, selectedUsers: selectedOptions.map((option) => option.value) });
  };

  const handleDocumentSelectChange = (selectedOptions) => {
    const selectedDocumentNames = selectedOptions.map((option) => option.label);
    setNewGroup({ ...newGroup, selectedDocuments: selectedDocumentNames });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { name, selectedUsers, selectedDocuments, access_level } = newGroup;

    try {
      const response = await axios.post('http://localhost:5000/api/admin/groups', {
        name,
        users: selectedUsers.map((id) => ({ _id: id })),
        documents: selectedDocuments,
        access_level,
      });
      setGroups([...groups, response.data]);
      setNewGroup({
        name: '',
        selectedUsers: [],
        selectedDocuments: [],
        access_level: 'Private',
      });
      setOpen(false);
    } catch (error) {
      console.error('Error creating group:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="mt-12">
      {selectedGroup && (
        <Button
          color="indigo"
          onClick={handleBackClick}
          className="mb-4"
        >
          Back
        </Button>
      )}

      {!selectedGroup && (
        <div className="mb-4 grid grid-cols-1 gap-5 xl:grid-cols-1">
          <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between p-6"
            >
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Groups
                </Typography>
              </div>
              <div>
                <Button color="indigo" onClick={handleOpen}>
                  Add Group
                </Button>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr className="items-center">
                    {["Name", "Created On", "No. of Users", "No. of Docs"].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left cursor-pointer"
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
                  {groups.map((group) => (
                    <tr
                      key={group._id}
                      onClick={() => handleGroupClick(group._id)}
                      className="cursor-pointer"
                    >
                      <td className="py-3 px-5">
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {group.name}
                        </Typography>
                      </td>
                      <td className="py-3 px-5">
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {new Date(group.createdAt).toLocaleString()}
                        </Typography>
                      </td>
                      <td className="py-3 px-5">
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {group.users ? group.users.length : 'Loading...'}
                        </Typography>
                      </td>
                      <td className="py-3 px-5">
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {group.documents ? group.documents.length : 'Loading...'}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      )}

      {selectedGroup && (
        <div>
          <div className="mb-4 grid grid-cols-1 gap-5 xl:grid-cols-1">
            <Card>
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 flex items-center justify-between p-6"
              >
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-1">
                    Users
                  </Typography>
                </div>
              </CardHeader>
              <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                    <tr>
                      {["Profile", "Email", "Role"].map((el) => (
                        <th
                          key={el}
                          className="border-b border-blue-gray-50 py-3 px-5 text-left"
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
                    {selectedGroup.users.map((user) => (
                      <UserDisplay key={user._id} user={user} />
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-5 xl:grid-cols-1">
            <Card>
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
              <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                    <tr>
                      {["Name"].map((el) => (
                        <th
                          key={el}
                          className="border-b border-blue-gray-50 py-3 px-5 text-left"
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
                  {selectedGroup.documents.map((document) => (
                    <tr key={document}>
                      <td className="py-3px-5 pl-10 py-2">
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {document}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={open} handler={handleOpen} size="lg">
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <Typography variant="h5" color="blue-gray">
              Add Group
            </Typography>
          </DialogHeader>
          <DialogBody divider className="grid grid-cols-2 gap-4">
            <Input
              label="Group Name"
              name="name"
              value={newGroup.name}
              onChange={handleInputChange}
            />
            <Select
              options={userOptions}
              isMulti
              placeholder="Select Users"
              onChange={handleUserSelectChange}
            />
            <Select
              options={documentsOptions}
              isMulti
              placeholder="Select Documents"
              onChange={handleDocumentSelectChange}
            />
            <div className="flex flex-col gap-4">
              <Typography variant="small" color="blue-gray">
                Access Level
              </Typography>
              <div className="flex gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="access_level"
                    value="Private"
                    checked={newGroup.access_level === 'Private'}
                    onChange={handleInputChange}
                  />
                  Private
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="access_level"
                    value="Public"
                    checked={newGroup.access_level === 'Public'}
                    onChange={handleInputChange}
                  />
                  Public
                </label>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" color="red" onClick={handleClose} className="mr-1">
              Cancel
            </Button>
            <Button type="submit" variant="gradient" color="indigo">
              Add Group
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default Groups;
