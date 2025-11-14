# Password Manager

A secure password manager web application with Multi-Factor Authentication (MFA) and client-side encryption.

## Features

- User registration and login with MFA (TOTP)
- Secure password storage with AES-GCM encryption
- Password generator with strength checking
- Client-side encryption (passwords never leave your device unencrypted)
- Material UI interface
- RESTful API backend

## Tech Stack

### Frontend
- React 18
- Material UI (MUI)
- React Router
- Axios for API calls
- Web Crypto API for encryption
- QR Code generation for MFA setup

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Argon2 for password hashing
- Speakeasy for TOTP MFA
- CORS support

## Security Features

- **Client-side encryption**: Passwords are encrypted before leaving the browser
- **Argon2 password hashing**: Secure password storage
- **TOTP MFA**: Time-based one-time passwords using authenticator apps
- **HTTPS ready**: Configured for secure connections

## Project Structure

```
password-manager/
├── server/                 # Backend Node.js/Express server
│   ├── index.js           # Main server file
│   ├── models/            # MongoDB models
│   │   └── User.js        # User schema
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   └── vault.js       # Vault CRUD routes
│   └── package.json       # Server dependencies
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   │   ├── Login.js   # Login page
│   │   │   ├── Register.js # Registration page
│   │   │   ├── Vault.js   # Password vault dashboard
│   │   │   └── Settings.js # Settings page
│   │   ├── utils/         # Utility functions
│   │   │   ├── crypto.js  # Encryption utilities
│   │   │   └── passwordGenerator.js # Password generation
│   │   ├── App.js         # Main app component
│   │   └── index.js       # App entry point
│   └── package.json       # Client dependencies
└── README.md             # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/passwordmanager
   # For production, use MongoDB Atlas URI
   ```

4. Start MongoDB service (if using local MongoDB)

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with credentials
- `POST /auth/mfa/verify` - Verify MFA code

### Vault
- `GET /vault` - Get encrypted vault data
- `PUT /vault` - Update vault data

## Usage

1. **Registration**: Create an account, scan the QR code with an authenticator app (Google Authenticator, Authy, etc.), and verify the MFA code.

2. **Login**: Enter email/password, then provide the MFA code from your authenticator app.

3. **Vault Management**: Add, edit, delete, and view your stored passwords. All data is encrypted client-side.

4. **Password Generation**: Use the built-in generator to create strong passwords.

## Security Considerations

- **Master Password**: Remember your master password - it's used for encryption and cannot be recovered
- **MFA Backup**: Save your MFA secret in a safe place in case you lose access to your authenticator app
- **HTTPS**: Always use HTTPS in production
- **Regular Backups**: Export your vault data regularly for backup

## Development

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

### Building for Production
```bash
# Build frontend
cd client && npm run build

# The build artifacts will be stored in the `build/` directory
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- WebAuthn/Passkeys support
- Password sharing functionality
- Password strength analysis
- Mobile app version
- Import/export functionality
- Browser extension