# Chat Application API Documentation

This API provides endpoints for user authentication and registration in a chat application.

## Endpoints

### `GET /api/users/<int:user_id>`

Get a user by ID.

**Response**

- `200 OK` on success, with the following JSON data:

```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2023-05-21T12:34:56.789Z"
}
```

- `400 Not found` if the user is not found

### `Post /api/login`

Log in a user.

**Request Body**

```json
{
    "username": "john_doe",
    "password": "mypassword"
}
```

**Response**

- `200 OK` on successful login, with the following JSON data:

```json
{
    "message": "Logged in successfully"
}
```

- `401 Unauthorized` if the username or password is invalid.

### `Post /api/register`

Register a new user.

**Request Body**

```json
{
    "username": "john_doe",
    "password": "mypassword",
    "email": "john@example.com"
}
```

**Response**

- `200 OK` on successful registration, with the following JSON data:

```json
{
    "message": "Registered successfully"
}
```

- `401 Unauthorized` if the username or email is already taken.

### `GET /api`

Test endpoint to ensure the API is working.

**Response**

- `200 OK` on success, with the following JSON data:

```json
{
    "message": "Hello, World!"
}
```

- `404 Not Found` If an endpoint is not found, a JSON response with a 404 status code and an error message is returned.

```json
{
    "message": "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again."
}
```
