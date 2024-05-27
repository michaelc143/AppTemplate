import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';
import { ToastContext } from '../../contexts/ToastContext';
import Register from '../Register';

describe('Register', () => {
  test('renders Register form and allows typing', () => {

    render(
      <Router>
        <AuthContext.Provider value={{ isLoggedIn: false }}>
          <UserContext.Provider value={{ user: {} }}>
            <ToastContext.Provider value={{ showToast: jest.fn() }}>
              <Register />
            </ToastContext.Provider>
          </UserContext.Provider>
        </AuthContext.Provider>
      </Router>
    );

    const usernameInput = screen.getByLabelText(/Username/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    expect(usernameInput.value).toBe('testuser');
    expect(emailInput.value).toBe('testuser@example.com');
    expect(passwordInput.value).toBe('testpassword');

  });
});