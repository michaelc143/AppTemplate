import { render, screen, fireEvent } from '@testing-library/react';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import Logout from '../Logout';

describe('Logout', () => {
  test('renders logout button', () => {
    const setIsLoggedIn = jest.fn();
    const setUser = jest.fn();

    render(
      <Router>
        <AuthContext.Provider value={{ setIsLoggedIn }}>
          <UserContext.Provider value={{ setUser }}>
            <Logout />
          </UserContext.Provider>
        </AuthContext.Provider>
      </Router>
    );

    expect(screen.getByText('Are you sure you want to logout?')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls logout function on button click', () => {
    const setIsLoggedIn = jest.fn();
    const setUser = jest.fn();

    render(
      <Router>
        <AuthContext.Provider value={{ setIsLoggedIn }}>
          <UserContext.Provider value={{ setUser }}>
            <Logout />
          </UserContext.Provider>
        </AuthContext.Provider>
      </Router>
    );

    fireEvent.click(screen.getByText('Logout'));

    expect(setIsLoggedIn).toHaveBeenCalledWith(false);
    expect(setUser).toHaveBeenCalledWith({});
    expect(window.location.pathname).toBe('/');
  });
});