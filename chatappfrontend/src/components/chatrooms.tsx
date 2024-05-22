import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function Chatrooms() {

  const { isLoggedIn } = useContext(AuthContext);
  const { user } = useContext(UserContext);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div>chatrooms</div>
      <div>{user.username}</div>
      <div>{user.email}</div>
      <div>{user.dateJoined}</div>
    </>
  )
}
