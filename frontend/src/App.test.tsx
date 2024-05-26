import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
		render(<App />);
		const title = screen.getByText(/Welcome to the app!/i);
		expect(title).toBeInTheDocument();
});

test('renders login button', () => {
		render(<App />);
		const loginButton = screen.getByText(/Login/i);
		expect(loginButton).toBeInTheDocument();
});

test('renders register button', () => {
		render(<App />);
		const registerButton = screen.getByText(/Register/i);
		expect(registerButton).toBeInTheDocument();
});

test('renders home button', () => {
	render(<App />);
	const registerButton = screen.getByText(/Home/i);
	expect(registerButton).toBeInTheDocument();
});
