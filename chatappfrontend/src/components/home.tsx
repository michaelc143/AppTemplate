import { Link } from "react-router-dom";

export default function home() {
  return (
	<div className="flex flex-col items-center justify-center min-h-screen">
		<h1 className="mb-8 font-bold text-4xl">Welcome to the chat app!</h1>
		<Link to='/login'>
			<button className="mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
		</Link>
		<Link to='/register'>
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</button>
		</Link>
	</div>
  )
}
