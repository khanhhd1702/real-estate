# RealEstate API

API for websites to post real estate for sale and rent.

## User Operations

### 1. Sign Up

- Endpoint: `/api/v1/user/signup`
- Method: `POST`
- Request Body:
  ```json
  {
    "email": String,
    "password": String,
    "name": String,
    "phone": {
      "country": String,
      "number": String
    },
    "birthday": Date,
  }
  ```
- Password: between 6 and 100 characters
- Name: max 250 characters
- Country Enum: ["vietnam", "laos", "cambodia"]
- Birthday: YYYY-MM-DD

### 2. Log in

- Endpoint: `/api/v1/user/login`
- Method: `POST`
- Request Body:
  ```json
  {
    "email": String,
    "password": String,
  }
  ```

### 3. Get user by email:

- Endpoint: `/api/v1/user?email=<email>`
- Method: GET

### 4. Get loged in user's information:

- Endpoint: `/api/v1/user/info`
- Method: GET
- Header: `Authorization: Bearer ${your_token}`

### 5. Update loged in user's information:

- Endpoint: `/api/v1/user/info`
- Method: POST
- Header: `Authorization: Bearer ${your_token}`
- Request Body:
  ```json
  {
    "name": String,
    "phone": {
      "country": String,
      "number": String
    },
    "address": String,
    "birthday": Date,
  }
  ```
- Name: max 250 characters
- Country Enum: ["vietnam", "laos", "cambodia"]
- Birthday: YYYY-MM-DD
- Address: max 250 characters
