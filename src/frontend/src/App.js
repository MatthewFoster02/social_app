import { Routes, Route } from 'react-router-dom';

import Layout from "./components/Layout.js";
import HomePage from "./pages/HomePage.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Profile from "./pages/Profile.js";
import NotFound from "./pages/NotFound.js";
import UpdateProfile from './pages/UpdateProfile.js';


function App()
{
  return (
    <Routes>
			<Route path="/" element={<Layout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="profile/:id" element={<Profile />} />
				<Route path="profile/update" element={<UpdateProfile />} />
				<Route path="*" element={<NotFound/>} />
			</Route>
		</Routes>
  );
}
export default App;
