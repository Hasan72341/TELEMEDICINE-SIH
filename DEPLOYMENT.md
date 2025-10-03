# 🏥 Gramin Swasthya - AI-Powered Telemedicine Platform

A comprehensive telemedicine platform with AI symptom checker supporting English, Hindi, and Punjabi languages.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.9+ (for AI backend)
- **Ollama** with Qwen3:4b model (for AI features)

### 🎯 Development Setup

#### 1. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Runs on: `http://localhost:5173`
- Network access: `http://172.16.8.115:5173`

#### 2. Backend (FastAPI + Ollama)
```bash
cd AIs
pip install -r requirements.txt
./start-dev.sh
```
- Runs on: `http://0.0.0.0:8006`
- API docs: `http://localhost:8006/docs`

### 🏭 Production Deployment

#### Frontend
```bash
cd frontend
npm run build
npm run serve
```

#### Backend
```bash
cd AIs
./start-prod.sh
```

## ⚙️ Configuration

### Frontend Environment Variables
Create `.env.local` in `frontend/` directory:
```env
VITE_API_BASE_URL=http://your-domain.com:8006
VITE_DEV_MODE=false
```

### Backend Environment Variables
Create `.env.local` in `AIs/` directory:
```env
HOST=0.0.0.0
PORT=8006
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen3:4b
CORS_ORIGINS=["http://your-frontend-domain.com"]
DEBUG=false
```

## 🌐 Network Access

### For Local Network Testing:
1. **Frontend**: `http://172.16.8.115:5173`
2. **Backend**: `http://172.16.8.115:8006`
3. **API Health**: `http://172.16.8.115:8006/health`

### Environment Detection:
- **Local development**: Uses `localhost:8006`
- **Network access**: Uses `172.16.8.115:8006`
- **Production**: Uses environment variable `VITE_API_BASE_URL`

## 📱 Features

### 🤖 AI Symptom Checker
- **Multi-language support**: English, Hindi, Punjabi
- **Voice input**: Speech recognition in all languages
- **Real-time analysis**: Powered by Qwen3:4b via Ollama
- **Home remedies**: Traditional Indian medicine suggestions

### 🏥 Telemedicine Platform
- **Doctor consultations**: Video call integration
- **Appointment booking**: Multilingual interface
- **Medicine shop**: Online pharmacy with delivery
- **Health records**: Patient data management

## 🔧 API Endpoints

### AI Backend (`http://localhost:8006`)
- `POST /remedy` - Symptom analysis with home remedies
- `GET /health` - Health check for monitoring
- `GET /docs` - Interactive API documentation

### Request Format:
```bash
curl -X POST "http://localhost:8006/remedy?symptom=headache&lang=en" \
  -H "accept: application/json"
```

### Response Format:
```json
{
  "symptom": "headache",
  "remedy": "Apply cold compress to forehead",
  "description": "Headache: Pain in head area",
  "language": {
    "name": "English",
    "code": "en",
    "confidence": 0.95
  }
}
```

## 🛠️ Development Scripts

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview:network` - Preview with network access
- `npm run serve` - Serve production build

### Backend
- `./start-dev.sh` - Development server with auto-reload
- `./start-prod.sh` - Production server with Gunicorn
- `python main.py` - Direct server start

## 🔒 Security

### CORS Configuration
- **Development**: Allows all origins for testing
- **Production**: Restricted to specific domains
- **Environment-based**: Configurable via `.env` files

### Environment Files
- `.env` - Default configuration (committed)
- `.env.development` - Development overrides (committed)
- `.env.production` - Production overrides (committed)
- `.env.local` - Local overrides (ignored by git)

## 📊 Monitoring

### Health Checks
- **Backend**: `GET /health` - Returns server status and model info
- **Frontend**: Built-in error boundaries and fallback UI

### Logging
- **Backend**: Environment-based debug logging
- **Frontend**: Console logging in development mode

## 🚀 Deployment Checklist

- [ ] Set up Ollama with Qwen3:4b model
- [ ] Configure environment variables
- [ ] Update CORS origins for production
- [ ] Set up reverse proxy (nginx/Apache)
- [ ] Configure SSL/HTTPS certificates
- [ ] Set up monitoring and logging
- [ ] Test all language combinations
- [ ] Verify mobile responsiveness

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - See LICENSE file for details.

---

**Built with ❤️ for rural healthcare accessibility**