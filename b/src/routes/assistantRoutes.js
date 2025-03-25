// routes/assistantRoutes.js
const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');
const auth = require('../middleware/auth');
const { logger } = require('../config/logger');
const multer = require('multer');
const path = require('path');

// Настройка хранилища для аудиофайлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/audio'));
  },
  filename: function (req, file, cb) {
    cb(null, `audio_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Добавим отладку
logger.info('Assistant routes initialized');

// Маршруты для сессий
router.post('/session', auth, assistantController.startConversation);
router.put('/session/:sessionId', auth, assistantController.endConversation);
router.get('/sessions', auth, assistantController.getUserSessions);
router.get('/session/:sessionId/messages', auth, assistantController.getConversationHistory);

// Маршруты для сообщений
router.post('/message/text', auth, assistantController.processTextMessage);
router.post('/message/audio', auth, upload.single('audio'), assistantController.processAudioMessage);

// Маршруты для предпочтений пользователя
router.get('/preferences', auth, assistantController.getUserPreferences);
router.put('/preferences', auth, assistantController.updateUserPreferences);

module.exports = router;