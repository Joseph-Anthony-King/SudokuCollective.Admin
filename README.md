# Sudoku Collective Admin Console

Sudoku Collective Admin Console is the administrative app for the [Sudoku Collective API](https://github.com/Joseph-Anthony-King/SudokuCollective).  This app is used to create and manage app licenses thus granting client apps access to the [Sudoku Collective API](https://github.com/Joseph-Anthony-King/SudokuCollective).

## Requirements

- A local running instance of the [Sudoku Collective API](https://github.com/Joseph-Anthony-King/SudokuCollective)

## Development Tools

- [Node.js version 20.12.2](https://nodejs.org/en)
- [NPM version 10.5.2](https://www.npmjs.com/)

## Installation

In the app directory you will find dummy implementations of the **.env** configuration files: **.dummy**, **.dummy.development**, **.dummy.iisexpress**, **.dummy.production**, **.dummy.staging**.  In the files rename **.dummy** to **.env** and place your value in where it states **[Your value here]**.  The **VITE_APP_LICENSE** will be the license you set for the **DefaultAdminApp** in your local instance of the [Sudoku Collective API](https://github.com/Joseph-Anthony-King/SudokuCollective).  **VITE_APP_API_URL** refers to the url the [Sudoku Collective API](https://github.com/Joseph-Anthony-King/SudokuCollective) is running on for that particular environment.  So if you're running this locally on the Kestrel development server the url will be [https://localhost:5001/](https://localhost:5001/).

As note above in requirements you will need a local running instance of the [Sudoku Collective API](https://github.com/Joseph-Anthony-King/SudokuCollective).  Installation instructions for the API can be found in the [README](https://github.com/Joseph-Anthony-King/SudokuCollective/blob/master/README.md) file.  The [Sudoku Collective API](https://github.com/Joseph-Anthony-King/SudokuCollective) has dependencies on [PostgreSQL 14](https://www.postgresql.org/download/) and [Redis Server - version 6.2.7](https://redis.io/download).

This project was also developed using [Node.js version 20.12.2](https://nodejs.org/en) and [NPM version 10.5.2](https://www.npmjs.com/).  Installation of these tools will depend based on your platform.

Once this project and the api are installed this project can be started within the **app** directory with the following command:

```
npm run serve
```
