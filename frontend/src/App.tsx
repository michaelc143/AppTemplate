import React from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserInfo from "./components/UserInfo";
import PageNotFound from "./components/PageNotFound";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import DeleteAccount from "./components/DeleteAccount";
import EditProfile from "./components/EditProfile";
import EditUsername from "./components/EditUsername";
import Dashboard from "./components/Dashboard Components/Dashboard";
import UserSearchResults from "./components/UserSearchResults";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { UserProvider } from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<ToastProvider>
					<ToastContainer />
					<Router>
						<Navbar />
						<AnimatePresence>
							<Routes>
								<Route path='/' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<Home />
									</motion.div>
								}/>
								<Route path='/login' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<Login />
									</motion.div>
								}/>
								<Route path='/logout' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<Logout />
									</motion.div>} />
								<Route path='/register' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<Register />
									</motion.div>} />
								<Route path='/userinfo' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<UserInfo />
									</motion.div>} />
								<Route path='/deleteaccount' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<DeleteAccount />
									</motion.div>} />
								<Route path='/editprofile' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<EditProfile />
									</motion.div>} />
								<Route path='/editusername' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<EditUsername />
									</motion.div>} />
								<Route path='/dashboard' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<Dashboard />
									</motion.div>} />
								<Route path='/search' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<UserSearchResults />
									</motion.div>} />
								<Route path='/*' element={
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3 }}
									>
										<PageNotFound />
									</motion.div>} />
							</Routes>
						</AnimatePresence>
					</Router>
				</ToastProvider>
			</UserProvider>
		</AuthProvider>
	);
}

export default App;
