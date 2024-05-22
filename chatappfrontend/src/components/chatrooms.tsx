import { useContext } from 'react';
import { AuthContext } from '../contexts/authcontext';
import { Navigate } from 'react-router-dom';

export default function Chatrooms() {

  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div>chatrooms</div>
  )
}
