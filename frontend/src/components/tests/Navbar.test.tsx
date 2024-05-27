import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Navbar from '../Navbar';

describe('Navbar', () => {
  test('renders login and register links when not logged in', () => {
    render(
      <Router>
        <AuthContext.Provider value={{ isLoggedIn: false }}>
          <Navbar />
        </AuthContext.Provider>
      </Router>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('renders logout and user info links when logged in', () => {
    render(
      <Router>
        <AuthContext.Provider value={{ isLoggedIn: true }}>
          <Navbar />
        </AuthContext.Provider>
      </Router>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('User Info')).toBeInTheDocument();
  });
});