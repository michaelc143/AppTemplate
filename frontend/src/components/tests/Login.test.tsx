import { BrowserRouter as Router } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { AuthContext } from '../../contexts/AuthContext';
import { ToastContext } from '../../contexts/ToastContext';
import { UserContext } from '../../contexts/UserContext';
import Login from '../Login';

describe('Login', () => {

  test('renders Login form and allows typing', () => {
    render(
      <Router>
        <AuthContext.Provider value={{ isLoggedIn: false }}>
          <UserContext.Provider value={{ user: {} }}>
            <ToastContext.Provider value={{ showToast: jest.fn() }}>
              <Login />
            </ToastContext.Provider>
          </UserContext.Provider>
        </AuthContext.Provider>
      </Router>
    );

    expect(screen.getByLabelText(/Username/i) as HTMLInputElement).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i) as HTMLInputElement).toBeInTheDocument();
  });

  test('Login form allows typing', () => {
    render(
      <Router>
        <AuthContext.Provider value={{ isLoggedIn: false }}>
          <UserContext.Provider value={{ user: {} }}>
            <ToastContext.Provider value={{ showToast: jest.fn() }}>
              <Login />
            </ToastContext.Provider>
          </UserContext.Provider>
        </AuthContext.Provider>
      </Router>
    );

    const usernameInput = screen.getByLabelText(/Username/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
  });

  it('submits the form with username and password', async () => {
    // Mock the fetch API call
    global.fetch = jest.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ success: true }))
      )
    );

    render(
      <Router>
        <AuthContext.Provider value={{ isLoggedIn: false }}>
          <UserContext.Provider value={{ user: {} }}>
            <ToastContext.Provider value={{ showToast: jest.fn() }}>
              <Login />
            </ToastContext.Provider>
          </UserContext.Provider>
        </AuthContext.Provider>
      </Router>
    );

    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /Login/i }) as HTMLButtonElement;

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith("http://localhost:5000/api/login",
    {"body": "{\"username\":\"testuser\",\"password\":\"testpassword\"}", "headers": {"Content-Type": "application/json"}, "method": "POST"});

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
  });
});