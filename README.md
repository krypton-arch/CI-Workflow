# Express.js Automated Testing Suite (Jest & Supertest)

A robust, production-grade Express.js REST API with comprehensive automated testing using **Jest** and **Supertest**, code quality checks via **ESLint**, and code formatting verification via **Prettier**, designed for CI/CD pipelines.

---

## 📁 Project Structure

```text
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow (Lint, Format, Test)
├── src/
│   ├── app.js                 # Express application & middleware configuration
│   ├── server.js              # Server entrypoint (listening on PORT)
│   ├── routes/
│   │   ├── health.js          # Health check endpoint (/api/health)
│   │   └── items.js           # CRUD REST endpoints (/api/items)
│   └── data/
│       └── itemsStore.js      # Data store layer with isolated reset capability
├── tests/
│   ├── app.test.js            # General root & 404/error handling tests
│   ├── health.test.js         # Health endpoint tests
│   └── items.test.js          # CRUD & input validation test suite
├── eslint.config.js           # Modern ESLint flat configuration (v10)
├── .prettierrc                # Prettier code formatting rules
├── .prettierignore            # Prettier ignore patterns
├── jest.config.js             # Jest test runner configuration
├── package.json               # NPM scripts & dependencies
└── .gitignore                 # Ignored files (node_modules, coverage)
```

---

## 🚀 Architectural Design

- **App / Server Decoupling**: Express configuration (`src/app.js`) is separated from the network listener (`src/server.js`). This allows Supertest to bind ephemeral ports and test the API without port conflicts or open handle leaks.
- **Test Isolation**: In-memory data store resets state between test cases to prevent test crosstalk.
- **Robust Error Handling**: Centralized error middleware captures malformed JSON payloads and unexpected exceptions.
- **Code Quality & Formatting Gates**: Configured ESLint for static analysis and Prettier for code style consistency.

---

## 🛠️ API Endpoints

| Method   | Endpoint         | Description                    | Status Codes        |
| -------- | ---------------- | ------------------------------ | ------------------- |
| `GET`    | `/`              | API welcome message            | `200`               |
| `GET`    | `/api/health`    | Service health status & uptime | `200`               |
| `GET`    | `/api/items`     | List all items                 | `200`               |
| `GET`    | `/api/items/:id` | Get item by ID                 | `200`, `400`, `404` |
| `POST`   | `/api/items`     | Create new item                | `201`, `400`        |
| `PUT`    | `/api/items/:id` | Update item                    | `200`, `400`, `404` |
| `DELETE` | `/api/items/:id` | Delete item                    | `200`, `400`, `404` |

---

## 📋 Quality, Formatting & Testing Scripts

| Script                  | Command                                                   | Purpose                                                            |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| `npm run lint`          | `eslint .`                                                | Runs ESLint for code quality and bug detection                     |
| `npm run lint:fix`      | `eslint . --fix`                                          | Automatically fixes fixable ESLint issues                          |
| `npm run format:check`  | `prettier --check .`                                      | Verifies consistent code formatting                                |
| `npm run format`        | `prettier --write .`                                      | Formats all files according to `.prettierrc`                       |
| `npm test`              | `jest --runInBand --detectOpenHandles`                    | Runs all tests sequentially with open handle detection             |
| `npm run test:watch`    | `jest --watch`                                            | Interactive test runner for TDD development                        |
| `npm run test:coverage` | `jest --coverage`                                         | Generates detailed statement, branch, and function coverage report |
| `npm run test:ci`       | `jest --ci --coverage --detectOpenHandles --forceExit`    | Headless, hardened test run designed for CI/CD runners             |
| `npm run check:all`     | `npm run lint && npm run format:check && npm run test:ci` | Complete pre-push validation suite                                 |

---

## 🏃 Running the Application

To start the server locally:

```bash
npm start
```

The server will start at `http://localhost:3000`.
