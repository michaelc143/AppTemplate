import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Chatrooms from './components/Chatrooms';
import PageNotFound from './components/PageNotFound';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { UserProvider } from './contexts/UserContext';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ToastProvider>
          <ToastContainer />
          <Router>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/chatrooms' element={<Chatrooms />} />
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </Router>
        </ToastProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
