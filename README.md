# Speak English Together Backend

Welcome to the Speak English Together project backend repository! This backend is built using the Nest framework.

## Installation

To get started, follow these steps:

### 1. Install Dependencies

Make sure to install the required dependencies by running:

```bash
$ yarn install
```

### 2. Set Environment Variables

Create a .env file by copying the example:

```bash
Copy code
$ touch .env
$ cp .env.example .env
```

Fill in the necessary environment variables in the .env file.

### 3. Run with Docker

To run the app with Docker, use:

```bash
$ docker-compose up
```

### 4. Run Migrations

If you need to run migrations, use the following command:

```bash
$ npm run migrate --name=${your_migration_create}
```

## Usage

```bash
$ yarn start
```

## API Documentation

Once the app is running, you can access the API documentation at:

http://localhost:3000/api/docs

Thanks
