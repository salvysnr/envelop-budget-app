# Envelope Budget API

An Express.js-based RESTful API for managing **budget envelopes**, each representing a spending category with an associated budget. Users can create, retrieve, update, transfer between, and delete envelopes.

---

## Features

- Create new budget envelopes
- Retrieve all or individual envelopes
- Withdraw from an envelope
- Transfer funds between envelopes (even create a new one in the process)
- Delete envelopes
- Validation for duplicate categories and insufficient funds

---

## Folder Structure

All logic is contained in a single file: `envelopBudget.js`  
(You can later modularise this into `routes/`, `controllers/`, etc.)

---

## Technologies Used

- [Express.js](https://expressjs.com/) (Web framework for Node.js)
- Native JavaScript methods (`Array.prototype.find`, `findIndex`, etc.)

---

## How to Use

### 1. Clone and install dependencies
```bash
git clone <your-repo-url>
cd envelope-budget-api
npm install
```

### 2. Run the app
```bash
node envelopBudget.js
```

Server will start on port `3000` or `process.env.PORT`.

---

## API Endpoints

> Base URL: `http://localhost:3000/envelop`

---

### Create Envelope

**POST** `/create`

```json
{
  "category": "groceries",
  "budget": 200
}
```

Automatically checks for duplicate categories and ensures budget is a number.

---

### Retrieve All Envelopes

**GET** `/retrieve`

Returns an array of all envelopes.

---

### Retrieve Envelope by Category

**GET** `/retrieve/:category`

Returns a single envelope object if it exists.

---

### Withdraw from an Envelope

**PUT** `/withdraw/:category`

```json
{
  "expense": 50
}
```

Subtracts `expense` from the envelope’s budget.

---

### Transfer Funds Between Envelopes

**PUT** `/transfer`

```json
{
  "source": { "category": "vacation" },
  "destination": { "category": "rent" },
  "amount": 100
}
```

- Transfers budget from `source` to `destination`.
- If `destination` doesn't exist, it will be created.

---

### Delete an Envelope

**DELETE** `/remove/:category`

Deletes the specified envelope by category name.

---

## Validation & Error Handling

- Duplicate category names are not allowed.
- Cannot withdraw or transfer more than the available balance.
- Requests missing required fields will return 400 status.
- Global error handler for all exceptions.

---

## Sample JSON for Transfers

```json
{
  "source": { "category": "vacation" },
  "destination": { "category": "rent" },
  "amount": 50
}
```

---

## Future Improvements

- Modularize into `routes/` and `controllers/`
- Add persistent storage (currently in-memory only)
- Add unit tests
- Add authentication & user management

---

## Author

Built by Salvation Otubu (@salvysnr on Github)
