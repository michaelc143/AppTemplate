import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import home from './components/Home';
import login from './components/Login';
import register from './components/Register';
import chatrooms from './components/Chatrooms';
import pagenotfound from './components/PageNotFound';
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
              <Route path='/' Component={home} />
              <Route path='/login' Component={login} />
              <Route path='/register' Component={register} />
              <Route path='/chatrooms' Component={chatrooms} />
              <Route path='*' Component={pagenotfound} />
            </Routes>
          </Router>
        </ToastProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
