# Task Manager

A training lite back-end for the Task Manager project (similar to Trello).

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/rubanik00/task-manager.git
```

2. **Install dependencies:**

```bash
yarn
```

OR

```bash
npm install
```

3. **Set up the `.env` file:**

Create a `.env` file in the project's root directory and specify your JWT secret key:

```bash
JWT_SECRET=your_secret_key
SALT_ROUNDS=your_salt_rounds
```

## Getting Started

To create the database, run the following command:

1. Run postgresql server on port `5433`.

2. Create a database:

```bash
npm run create-db
```

To start the server, run the following command:

```bash
npm start
```

The server will be running on port 3005.

## Routes

- `/`: Returns "Hello, world" to check the server's functionality.

- `/tasks`: Retrieves a list of tasks for authenticated users.

- `/register`: Registers a new user.

- `/login`: Authenticates a user.

- `/create`: Creates a new task.

- `/edit/:id`: Edits a task.

- `/delete/:taskId`: Deletes a task.
