# Open-Talk 💬

**Open-Talk** is a full-stack real-time communication platform designed to provide users with an interactive messaging experience. The project combines a modern frontend with a scalable backend to support communication, channel-based messaging, file attachments, and subscription-related functionality.

## 🚀 Project Overview

Open-Talk is built using modern JavaScript technologies and follows a client-server architecture.

The frontend provides the user interface and communicates with the backend through APIs and real-time connections. The backend manages authentication, data storage, messaging operations, and other application services.

## ✨ Key Features

- **Real-Time Communication:** Real-time messaging powered by Socket.IO.
- **Channel-Based Messaging:** Organize conversations into channels.
- **File Attachments:** Support for sending files and media through messages.
- **REST API:** Backend APIs for application functionality.
- **MongoDB Integration:** Persistent storage using MongoDB and Mongoose.
- **Redis Integration:** Redis support for applicable caching or coordination tasks.
- **Nitro Subscription Model:** Subscription-related functionality with status and expiration handling.
- **Modern User Interface:** Interactive frontend built with React and Vite.
- **Input Validation:** Request validation and error handling on the backend.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- Vite
- HTML5
- CSS3
- npm
- REST API integration
- Socket.IO Client, if enabled in the current frontend implementation

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- Redis
- Multer for multipart file uploads
- Express Validator
- Authentication middleware
- External file storage service, as configured

### Development Tools
- Git and GitHub
- npm
- Visual Studio Code
- Postman (for API testing)

## 📁 Project Structure

```text
OPEN-TALK/
├── Client/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── Server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

*Note: The exact backend folder names may differ depending on the current project structure.*

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB or a MongoDB connection string
- Redis, if required by the configured backend services
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/shiv930/OPEN-TALK.git
cd OPEN-TALK
```

### 2. Set Up the Backend

```bash
cd Server
npm install
```

Create a `.env` file in the backend directory and configure the environment variables required by your application.

Example placeholders:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional variables required for authentication, email delivery, file storage, and other integrations.

Start the backend using the script configured in `Server/package.json`. For example:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open a new terminal from the project root:

```bash
cd Client
npm install
```

Configure the frontend environment variables required by your application, including the backend API URL if applicable.

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

### Production deployment settings

- In Render, use `Server` as the service root directory and `npm start` as the start command.
- Set the Render `CLIENT_URL` environment variable to `https://open-talk-rose.vercel.app` (no trailing slash). The API also allows this production origin by default.
- In Vercel, set `VITE_API_URL` to `https://open-talk-9v3h.onrender.com`. Set `VITE_SOCKET_URL` to the same URL only if you want to override the default.
- Vite environment variables are embedded during the build, so redeploy the Vercel frontend after changing them. Redeploy the Render backend after changing its environment variables.

## 💎 Nitro Subscription Model

Open-Talk includes a Nitro subscription-related model for managing subscription information.

Depending on the implemented business logic, the subscription system can track:

- Subscription plan
- Subscription status, such as active, expired, or cancelled
- Subscription start and expiration dates
- User subscription information
- Active subscription checks

The backend can use this information to determine whether a user has access to subscription-based features.

## 🔄 How It Works

1. The user interacts with the React frontend.
2. The frontend sends HTTP requests to the Express backend.
3. The backend validates requests and applies application logic.
4. MongoDB stores application data.
5. Socket.IO supports real-time communication.
6. File uploads are processed through the backend and configured storage service.
7. Subscription information is used by the application wherever Nitro-related access rules are implemented.

## 🔐 Security Notes

- Keep database credentials, API keys, and JWT secrets in environment variables.
- Never commit `.env` files or sensitive credentials to GitHub.
- Validate user input on the backend.
- Protect private routes with appropriate authentication and authorization.
- Configure CORS and production environment settings appropriately.

## 🧪 Testing

Use Postman or another API testing tool to test backend endpoints. Test frontend workflows in the browser and verify real-time messaging, authentication, file uploads, and subscription behavior according to the features implemented.

## 🚧 Future Improvements

- Improve automated testing and API documentation.
- Add stronger monitoring and error logging.
- Improve deployment and production configuration.
- Expand subscription-based features.
- Optimize performance and scalability as needed.

## 👨‍💻 Author

**Shiv Kumar**

GitHub: [@shiv930](https://github.com/shiv930)

## 📄 License

Choose and add a suitable open-source license before distributing the project under specific license terms.
