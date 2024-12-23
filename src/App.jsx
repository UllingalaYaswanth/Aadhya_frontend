// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard, DevDashboard, Auth } from './layouts'; 
import { SignIn  } from './pages/auth'; 
import UserApp from './UserApp';
import { AuthProvider } from './AuthContext.jsx';
import PrivateRoute from './PrivateRoute.jsx'; // Adjust the import path as needed

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/auth/*" element={<Auth />} />

        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>
        
        <Route element={<PrivateRoute allowedRoles={['developer']} />}>
          <Route path="/dev-dashboard/*" element={<DevDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['user']} />}>
          <Route path="/user" element={<UserApp />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
