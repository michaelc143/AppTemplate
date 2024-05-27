import { render, screen } from '@testing-library/react';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import UserInfo from '../UserInfo';

describe('UserInfo', () => {
  test('renders user info when logged in', () => {
    const mockUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      dateJoined: '2022-01-01',
    };

    render(
      <Router>
        <AuthContext.Provider value={{ isLoggedIn: true }}>
          <UserContext.Provider value={{ user: mockUser }}>
            <UserInfo />
          </UserContext.Provider>
        </AuthContext.Provider>
      </Router>
    );

    expect(screen.getByText('User Info')).toBeInTheDocument();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.dateJoined)).toBeInTheDocument();
  });

  test('renders not logged in redirect to /', () => {

    render(
      <Router>
        <AuthContext.Provider value={{ isLoggedIn: false }}>
          <UserContext.Provider value={{ user: {} }}>
            <UserInfo />
          </UserContext.Provider>
        </AuthContext.Provider>
      </Router>
    );
    // make sure it redirects to home page when not logged in
    expect(window.location.pathname).toBe('/');
    expect(window.location.pathname).not.toBe('/userinfo');
  });
});