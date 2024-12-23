import React, { useState } from "react";
import {
  Typography,
  Input,
  Button,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
} from "@material-tailwind/react";
import { FaTimes } from "react-icons/fa";
import * as Dropbox from 'dropbox';
import localDriveImage from './img/localdrive.jpeg';
import AWSImage from './img/aws.webp';
import confluenceImage from './img/confluence.jpeg';
import GCPImage from './img/GCP.png';
import googledriveImage from './img/googledrive.png';
import jiraImage from './img/jira.jpeg';
import mediafireImage from './img/mediafire.png';
import slackImage from './img/slack.png';
import sourceforgImage from './img/sourceforg.png';
import onedriveImage from './img/onedrive.png';
import mega from './img/mega.png';
import azure from './img/azure.webp';
import mongo from './img/mongodb.png';
import facebook from './img/fb.webp';
import mysql from './img/mysql.png';
import Jumpshare from './img/jump.jpeg';
import iCloud from './img/icloud.png';
import Hightail from './img/hightail.jpeg';
import Sharefiles from './img/sharefiles.webp';
import box from './img/box.png';
import ss from './img/ss.png';
import GitHub from './img/git.jpg';
import MixCloud from './img/mix.png';
import zip from './img/zip.png';
import idrive from './img/idrive.png';
import copy from './img/copy.png';
import bitcasa from './img/bitcasa.webp';
import TeraBox from './img/terabox.png';
import icedrive from './img/icedrive.webp';
import gitlab from './img/git.jpg';

export function DataSource() {
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState("");
  const [level, setLevel] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState("");

  const handleOpen = (field) => {
    setSelectedField(field);

    if (field === "Local Drive") {
      setOpen(true);
    } else {
      const urls = {
        Jira: "https://www.atlassian.com/software/jira",
        Slack: "https://slack.com/",
        AWS: "https://aws.amazon.com/",
        GCP: "https://cloud.google.com/",
        OneDrive: "",
        Confluence: "https://www.atlassian.com/software/confluence",
        "Google Drive": "https://drive.google.com/",
        "Source Forge": "https://sourceforge.net/",
        "Media Fire": "https://www.mediafire.com/",
        Mega: "https://mega.nz/",
        Azure: "https://azure.microsoft.com/",
        MongoDB: "https://www.mongodb.com/",
        Facebook: "https://www.facebook.com/",
        MySQL: "https://www.mysql.com/",
        Jumpshare: "https://jumpshare.com/",
        iCloud: "https://www.icloud.com/",
        Hightail: "https://www.hightail.com/",
        Sharefiles: "https://www.sharefile.com/",
        Box: "https://www.box.com/",
        Scribd: "https://www.scribd.com/",
        GitHub: "https://github.com/",
        MixCloud: "https://www.mixcloud.com/",
        Zip: "https://www.winzip.com/",
        iDrive: "https://www.idrive.com/",
        Copy: "https://www.copy.com/",
        Bitcasa: "https://www.bitcasa.com/",
        TeraBox: "https://www.terabox.com/",
        Icedrive: "https://www.icedrive.net/",
        GitLab: "https://gitlab.com/",
      };

      if (urls[field]) {
        window.open(urls[field], "_blank");
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFiles([selectedFile]);
  };
  const handleRemoveFile = () => {
    setFiles([]);
  };

    const handleDropboxUpload = async (file, filePath) => {
    const accessToken = 'sl.B5EQVBMQx2r6n6E5BdIH6FQ5LqnWZFcYEUFCRZZK6NR2y46DEVamKzxocjMgke15OI_3yy1Olj6lJjzpLzKqfUkqqa2OhI0GU5ChHfPhC5eeH-K7F-os3iCNLBTz6xKLvgmBbnE6TD9WmCSqzJEFVdo'; // Replace with your Dropbox access token
    const dbx = new Dropbox.Dropbox({ accessToken });

    try {
      const fileContents = await readFileContents(file);

      const response = await dbx.filesUpload({
        path: filePath,
        contents: fileContents,
      });

      console.log('File uploaded to Dropbox:', response);
      return response;
    } catch (error) {
      console.error('Error uploading file to Dropbox:', error);
      throw error;
    }
  };

  const readFileContents = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = files[0];
    const fileName = file.name;
    const selectedLevel = level;

    let path = '/localgpt/';

    switch (selectedLevel) {
      case 'A':
        path += 'levelA/';
        break;
      case 'B':
        path += 'levelB/';
        break;
      case 'C':
        path += 'levelC/';
        break;
      default:
        path += 'unknown/';
    }

    path += fileName;

    try {
      // Upload file to Dropbox
      await handleDropboxUpload(file, path);

      // Send file details to backend to store in DB
      const response = await fetch('http://localhost:5000/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fileName,
          path_lower: path,
          location: tags,
          level: selectedLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save file details to the database');
      }

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error during file upload and save process:', error);
    }
  };



  const cardData = [
    { name: "Local Drive", img: localDriveImage },
    { name: "Jira", img: jiraImage },
    { name: "Slack", img: slackImage },
    { name: "AWS", img: AWSImage },
    { name: "GCP", img: GCPImage },
    { name: "OneDrive", img: onedriveImage },
    { name: "Confluence", img: confluenceImage },
    { name: "Google Drive", img: googledriveImage },
    { name: "Source Forge", img: sourceforgImage },
    { name: "Media Fire", img: mediafireImage },
    { name: "Mega", img: mega },
    { name: "Azure", img: azure },
    { name: "MongoDB", img: mongo },
    { name: "Facebook", img: facebook },
    { name: "MySQL", img: mysql },
    { name: "Jumpshare", img: Jumpshare },
    { name: "iCloud", img: iCloud },
    { name: "Hightail", img: Hightail },
    { name: "Sharefiles", img: Sharefiles },
    { name: "Box", img: box },
    { name: "Scribd", img: ss },
    { name: "GitHub", img: GitHub },
    { name: "MixCloud", img: MixCloud },
    { name: "Zip", img: zip },
    { name: "iDrive", img: idrive },
    { name: "Copy", img: copy },
    { name: "Bitcasa", img: bitcasa },
    { name: "TeraBox", img: TeraBox },
    { name: "Icedrive", img: icedrive },
    { name: "GitLab", img: gitlab }
  ];

  return (
    <div className="my-20 mx-10 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-5">
      {cardData.map((card) => (
        <Card key={card.name} className="cursor-pointer">
          <Card.Body className="flex items-center" onClick={() => handleOpen(card.name)}>
            <img src={card.img} alt={`${card.name} Image`} className="w-8 h-8 mr-2 rounded-full" />
            <Typography variant="h6" color="blue-gray">
              {card.name}
            </Typography>
          </Card.Body>
        </Card>
      ))}

       <Dialog open={open} handler={handleOpen}>
         <DialogHeader>
           <Typography variant="h5" color="blue-gray">
             Add Document
           </Typography>
         </DialogHeader>
         <DialogBody divider>
           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
             <Input
              type="file"
              color="blue"
              label="Document"
              onChange={handleFileChange}
              className="p-3"
              required
            />

            {files.length > 0 && (
              <div className="mb-4">
                <Typography variant="subtitle1" color="blue-gray">
                  Selected File:
                </Typography>
                <div className="flex items-center gap-2">
                  <Typography>{files[0].name}</Typography>
                  <Button
                    color="red"
                    size="sm"
                    onClick={handleRemoveFile}
                    iconOnly
                  >
                    <FaTimes />
                  </Button>
                </div>
              </div>
            )}

            <Input
              type="text"
              color="blue"
              label="Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
            />
            <Select
              color="blue"
              label="Level"
              value={level}
              onChange={(value) => setLevel(value)} 
              required
            >
              <Option value="">Select level</Option>
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
            </Select>
            <Button type="submit" color="blue">
              Upload
            </Button>

            {uploadSuccess && (
              <Typography className="mt-4" color="green">
                Files uploaded successfully!
              </Typography>
            )}
          </form>
        </DialogBody>
        <DialogFooter>
        <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-1">
          Cancel
        </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default DataSource;
