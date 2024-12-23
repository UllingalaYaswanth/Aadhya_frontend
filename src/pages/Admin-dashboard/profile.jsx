import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useLocation } from "react-router-dom";
import { ProfileInfoCard } from "@/widgets/cards";
import { useState } from "react";

export function Profile() {
  const location = useLocation();
  const userData = location.state?.userData;
  console.log('userData from profile:', userData);

  const [imageError, setImageError] = useState(false);

  if (!userData) {
    return <div>User data not found</div>;
  }

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={imageError ? userData.profileImage : `http://localhost:5000/uploads/${userData.profileImage}`}
                alt="User Avatar"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                onError={handleImageError}
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {userData.firstName} {userData.lastName}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {userData.role} / {userData.designation}
                </Typography>
              </div>
            </div>
          </div>
          <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
            <ProfileInfoCard
              title="Profile Information"
              description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
              details={{
                mobile: "(44) 123 1234 123",
                email: userData.email || userData.emailAddress,
                location: "USA",
                social: (
                  <div className="flex items-center gap-4">
                    <i className="fa-brands fa-facebook text-blue-700" />
                    <i className="fa-brands fa-twitter text-blue-400" />
                    <i className="fa-brands fa-instagram text-purple-500" />
                  </div>
                ),
              }}
              action={
                <Tooltip content="Edit Profile">
                  <Button variant="text" color="blue-gray">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </Tooltip>
              }
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
