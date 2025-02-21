**MERN Learning**
[ShopIt]
#### **About**
#### **Software**
✅ Expressjs  
✅ Dotenv  
✅ Mongose  
✅ Nodemon
---

#### **Command in packagejson**
- **For Linux:**  
    ```bash NODE_ENV=PRODUCTION nodemon backend/server ```
- **For Window:**  
  ```bash SET NODE_ENV=PRODUCTION& nodemon backend/server ```

# Authentication and Authorization in Node.js

This project uses various npm packages to implement authentication and authorization in a Node.js application.

## Packages Used

### 1. `nodemailer` → Sending Emails
**Purpose:**
- Used to send emails from a Node.js application (e.g., account verification, password reset).

**Example Usage:**
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password',
  },
});

const mailOptions = {
  from: 'your-email@gmail.com',
  to: 'user@example.com',
  subject: 'Account Verification',
  text: 'Click the link to verify your account.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) console.log(error);
  else console.log('Email sent: ' + info.response);
});
```

### 2. `validator` → Validating Input Data
**Purpose:**
- Ensures user input (email, password, etc.) is in the correct format to prevent invalid data storage and security issues.

**Example Usage:**
```javascript
const validator = require('validator');

console.log(validator.isEmail('test@example.com')); // true
console.log(validator.isStrongPassword('Pass@1234')); // true
console.log(validator.isMobilePhone('1234567890', 'en-US')); // false
```

### 3. `jsonwebtoken` → Generating Web Tokens
**Purpose:**
- Creates JSON Web Tokens (JWT) for authentication.

**Example Usage:**
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign({ userId: 123 }, 'your-secret-key', { expiresIn: '1h' });
console.log(token); // Encrypted token

const decoded = jwt.verify(token, 'your-secret-key');
console.log(decoded); // { userId: 123, iat: ..., exp: ... }
```

### 4. `bcryptjs` → Hashing Passwords
**Purpose:**
- Encrypts passwords before storing them in the database.

**Example Usage:**
```javascript
const bcrypt = require('bcryptjs');

const password = 'mypassword';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log(hashedPassword); // $2a$10$...

const isMatch = bcrypt.compareSync(password, hashedPassword);
console.log(isMatch); // true
```

### 5. `cookie-parser` → Storing Data in Cookies
**Purpose:**
- Parses cookies in incoming HTTP requests.
- Can be used to store tokens (JWT) or session information.

**Example Usage:**
```javascript
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
  res.cookie('token', 'jwt-token-here', { httpOnly: true });
  res.send('Cookie set!');
});

app.get('/read-cookie', (req, res) => {
  console.log(req.cookies.token); // Read stored token
  res.send('Cookie read!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### 6. `body-parser` → Parsing Request Body
**Purpose:**
- Extracts JSON or form data from `req.body`.

**Example Usage:**
```javascript
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Parses JSON request body
app.use(bodyParser.urlencoded({ extended: true })); // Parses form data

app.post('/login', (req, res) => {
  console.log(req.body); // { username: 'user', password: 'pass' }
  res.send('Login request received!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## How These Packages Work Together

1. **User Registers/Login:**
    - `body-parser` extracts user input.
    - `validator` checks input validity.
    - `bcryptjs` hashes the password.
    - `jsonwebtoken` generates a JWT token.

2. **Token is Stored:**
    - `cookie-parser` can store JWT in cookies.

3. **User Authentication:**
    - JWT is validated using `jsonwebtoken`.

4. **Forgot Password:**
    - `nodemailer` sends password reset emails.

These are essential tools for secure authentication in Node.js apps. 🚀
