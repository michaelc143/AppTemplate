import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {

  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn) {
    return (
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-4 dark:bg-neutral-900">
        <nav className="flex justify-end bg-white border-gray-200 dark:bg-gray-900 w-full">
          <Link to="/" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Home</Link>
          <Link to="/logout" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Logout</Link>
          <Link to="/chatrooms" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Chatrooms</Link>
        </nav>
      </header>
    );
  }

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-4 dark:bg-neutral-900">
      <nav className="flex justify-end bg-white border-gray-200 dark:bg-gray-900 w-full">
        <Link to="/" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Home</Link>
        <Link to="/login" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Login</Link>
        <Link to="/register" className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2">Register</Link>
      </nav>
    </header>
  );
}