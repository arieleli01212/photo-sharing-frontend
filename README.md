# 🎉 Ariel & Ya'ara Wedding Photo Sharing

A beautiful and interactive wedding photo sharing application that allows guests to upload, view, and share memories from Ariel & Ya'ara's special day.

## ✨ Features

### 🖼️ Photo Management
- **Upload Photos**: Guests can easily upload multiple photos from their devices
- **Image Gallery**: Browse all wedding photos in a responsive grid layout
- **Full-Screen Viewer**: View photos in a full-screen, swipe-enabled viewer
- **Real-time Updates**: New photos appear instantly for all users

### 🔐 Authentication
- **Google OAuth**: Secure login with Google accounts
- **JWT Token Management**: Persistent authentication with secure token storage
- **User Profiles**: Personalized experience for each guest

### 🌐 Real-time Features
- **Live Guest Counter**: See how many guests are currently viewing photos
- **WebSocket Integration**: Real-time updates without page refresh
- **Dynamic Status Updates**: Live connection status and guest count

### 📱 User Experience
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Progressive Web App**: Can be installed and used offline
- **Color-Dynamic UI**: Interface adapts to the dominant colors of profile images
- **Touch-Friendly**: Optimized for mobile touch interactions

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0
- **Authentication**: Google OAuth 2.0 with JWT
- **Real-time Communication**: WebSocket connections
- **Styling**: Custom CSS with responsive design
- **Testing**: Jest and React Testing Library
- **Build Tools**: Create React App
- **Containerization**: Docker support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server running (photo-sharing-backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arieleli01212/photo-sharing-frontend.git
   cd photo-sharing-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_WS_URL=localhost:8000
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
   REACT_APP_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Development
```bash
docker build -t wedding-photos-frontend .
docker run -p 3000:80 wedding-photos-frontend
```

### Production
The Dockerfile uses multi-stage builds for optimized production deployment:
```bash
docker build -t wedding-photos-frontend .
docker run -p 80:80 wedding-photos-frontend
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | Backend API base URL | ✅ | `http://localhost:8000` |
| `REACT_APP_WS_URL` | WebSocket server URL | ✅ | `localhost:8000` |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ | - |
| `REACT_APP_ENV` | Environment (development/production/docker) | ❌ | `development` |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy the Client ID to your `.env` file

## 📁 Project Structure

```
src/
├── components/
│   ├── Gallery/           # Photo grid and gallery logic
│   │   ├── Gallery.js
│   │   └── Gallery.css
│   ├── Login/            # Authentication components
│   │   ├── Login.js
│   │   └── Login.css
│   ├── Profile/          # User profile and upload
│   │   ├── Profile.js
│   │   └── Profile.css
│   ├── Register/         # User registration
│   │   ├── Register.js
│   │   └── Register.css
│   ├── Viewer/          # Full-screen photo viewer
│   │   ├── Viewer.js
│   │   └── Viewer.css
│   └── ViewerHeader/    # Viewer navigation header
│       ├── ViewerHeader.js
│       └── ViewerHeader.css
├── config/
│   └── api.js           # API configuration and helpers
├── assets/
│   └── images/          # Static images
├── App.js               # Main application component
├── App.css              # Global styles
└── index.js            # Application entry point
```

## 🧪 Available Scripts

### Development
```bash
npm start          # Start development server (http://localhost:3000)
npm test           # Run test suite in watch mode
npm run test:ci    # Run tests once for CI
```

### Production
```bash
npm run build      # Create production build
npm run preview    # Preview production build locally
```

### Code Quality
```bash
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues automatically
```

## 🔧 API Integration

The application integrates with a backend API for:

- **Authentication**: `/google-login`, `/verify-token`
- **Photo Management**: `/upload`, `/get-images`
- **Real-time Data**: `/guest`, `/ws` (WebSocket)

API configuration is centralized in `src/config/api.js`:

```javascript
import { getApiUrl, getWebSocketUrl } from './config/api';

// HTTP requests
const response = await fetch(getApiUrl('/upload'), options);

// WebSocket connection
const ws = new WebSocket(getWebSocketUrl('/ws'));
```

## 🎨 Customization

### Styling
- Modify `src/App.css` for global styles
- Component-specific styles in respective `.css` files
- CSS custom properties for easy theme customization

### Features
- Add new authentication providers in `src/components/Login/`
- Extend photo viewer functionality in `src/components/Viewer/`
- Customize upload interface in `src/components/Profile/`

## 🔒 Security Features

- **Environment Variable Protection**: Sensitive data in environment variables
- **JWT Token Management**: Secure authentication token handling
- **Input Validation**: Client-side validation for uploads
- **HTTPS Support**: SSL/TLS encryption support
- **XSS Protection**: React's built-in XSS protection

## 📱 Mobile Optimization

- **Touch Gestures**: Swipe navigation in photo viewer
- **Responsive Grid**: Adaptive photo grid for all screen sizes
- **Mobile Upload**: Optimized file upload for mobile devices
- **PWA Support**: Can be installed as a mobile app

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Traditional Hosting
```bash
npm run build
# Upload build/ folder to your web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and created for Ariel & Ya'ara's wedding. All rights reserved.

## 💝 Acknowledgments

- Created with love for Ariel & Ya'ara's special day
- Built with React and modern web technologies
- Designed for sharing beautiful wedding memories

---

**Made with ❤️ for a beautiful couple's special day**