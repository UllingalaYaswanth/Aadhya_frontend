import React, { useState } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext'; // Adjust the import path as needed
import login from '/img/login.jpg'

export function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (event) => {
    event.preventDefault();
    
    // Mock validation (replace this with actual authentication logic)
    const userRole = getUserRole(email);

    if (!userRole) {
      setError('Invalid email or password.');
      return;
    }

    // Set authentication state
    login(userRole);
    localStorage.setItem('userEmail', email); // Store user email

    // Redirect based on user role
    switch (userRole) {
      case 'admin':
        navigate('/dashboard');
        break;
      case 'developer':
        navigate('/dev-dashboard');
        break;
      case 'user':
        navigate('/user');
        break;
      default:
        setError('Unknown role.');
    }
  };

  const getUserRole = (email) => {
    switch (email) {
      case 'admin@gmail.com':
        return 'admin';
      case 'dev@gmail.com':
        return 'developer';
      case 'user@gmail.com':
        return 'user';
      default:
        return null; // Invalid email
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-60">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSignIn}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <Typography variant="small" className="text-red-500">{error}</Typography>}
          <Button className="mt-10" fullWidth type="submit">
            Sign In
          </Button>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/login.jpg"
          alt="Pattern"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
