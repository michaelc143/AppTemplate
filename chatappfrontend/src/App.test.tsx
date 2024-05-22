import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
		render(<App />);
		const title = screen.getByText(/Welcome to the chat app!/i);
		expect(title).toBeInTheDocument();
});

test('renders login button', () => {
		render(<App />);
		const loginButton = screen.getByText(/Login/i);
		expect(loginButton).toBeInTheDocument();
});

test('navigates to /login when login button is clicked', () => {
		render(<App />);
		const loginButton = screen.getByText(/Login/i);
		fireEvent.click(loginButton);
		expect(window.location.pathname).toBe('/login');
});

test('renders register button', () => {
		render(<App />);
		const registerButton = screen.getByText(/Register/i);
		expect(registerButton).toBeInTheDocument();
});

test('navigates to /register when register button is clicked', () => {
		render(<App />);
		const registerButton = screen.getByText(/Register/i);
		fireEvent.click(registerButton);
		expect(window.location.pathname).toBe('/register');
});
