import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import home from './components/home';
import login from './components/login';
import register from './components/register';
import chatrooms from './components/chatrooms';
import pagenotfound from './components/pagenotfound';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
