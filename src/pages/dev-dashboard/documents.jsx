import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import axios from 'axios';

export function Acc() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState([]);


  // Fetch documents from the backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/files');
        const fetchedDocuments = response.data.map(document => ({
          ...document,
          createdAt: new Date(document.createdAt).toLocaleString(), // Format createdAt date if needed
          accessLevel: document.level // Assign level data to accessLevel
        }));
        setDocuments(fetchedDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFiles([selectedFile]);
  };
  // Format timestamp function (optional if already formatted in backend)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Function to handle document click (download from Dropbox)
  const handleDocumentClick = async (documentPath) => {
    try {
      const response = await axios.post('http://localhost:5000/api/files/get_temp_link', {
        documentPath
      });

      const documentUrl = response.data.link;

      // Open the document in a new tab
      window.open(documentUrl, '_blank');
    } catch (error) {
      console.error('Error opening document:', error);
      // Optionally, show a user-friendly error message here
    }
  };

  // Filtered table data based on search term
  const filteredTableData = documents.filter((document) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-12">
      <div className="mb-4 grid grid-cols-1 gap-5 xl:grid-cols-1">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-1 mr-4">
              Documents
            </Typography>
            <div className="relative flex items-center">
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr className="items-center">
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-medium uppercase text-blue-gray-400"
                    >
                      Document Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-medium uppercase text-blue-gray-400"
                    >
                      Uploaded On
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <Typography
                      variant="small"
                      className="text-[11px] font-medium uppercase text-blue-gray-400"
                    >
                      Access Level
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTableData.map((document, index) => (
                  <tr key={index} className="border-b border-blue-gray-50 cursor-pointer" onClick={() => handleDocumentClick(document.path_lower)}>
                    <td className="py-3 px-5">
                      <Typography
                        variant="small"
                        className="text-xs font-medium text-blue-gray-600 cursor-pointer"
                      >
                        {document.name}
                      </Typography>
                    </td>
                    <td className="py-3 px-5">
                      <Typography
                        variant="small"
                        className="text-xs font-medium text-blue-gray-600"
                      >
                        {document.createdAt} {/* Display formatted createdAt date */}
                      </Typography>
                    </td>
                    <td className="py-3 px-5">
                      <Typography
                        variant="small"
                        className="text-xs font-medium text-blue-gray-600"
                      >
                        {document.accessLevel} {/* Display access level */}
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
  );
}

export default Acc;
