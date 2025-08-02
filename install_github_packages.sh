# 🚀 СОЛАР CLOUD IDE - УСТАНОВКА ПАКЕТОВ
# "Fixing the Missing Dependencies"

echo "🔧 Installing GitHub integration packages..."

# ===============================================
# 1️⃣ ПЕРЕЙТИ В BACKEND ПАПКУ
# ===============================================

cd b

# ===============================================
# 2️⃣ УСТАНОВИТЬ GITHUB ПАКЕТЫ
# ===============================================

echo "📦 Installing @octokit/rest..."
npm install @octokit/rest

echo "📦 Installing simple-git..."
npm install simple-git

echo "📦 Installing additional packages..."
npm install chokidar

# ===============================================
# 3️⃣ ПРОВЕРИТЬ УСТАНОВКУ
# ===============================================

echo "🔍 Checking installed packages..."

# Проверяем что пакеты установлены
if npm list @octokit/rest &>/dev/null; then
    echo "✅ @octokit/rest installed successfully"
else
    echo "❌ @octokit/rest installation failed"
fi

if npm list simple-git &>/dev/null; then
    echo "✅ simple-git installed successfully"  
else
    echo "❌ simple-git installation failed"
fi

if npm list chokidar &>/dev/null; then
    echo "✅ chokidar installed successfully"
else
    echo "❌ chokidar installation failed"
fi

# ===============================================
# 4️⃣ ПОКАЗАТЬ УСТАНОВЛЕННЫЕ ВЕРСИИ
# ===============================================

echo ""
echo "📋 Installed versions:"
npm list @octokit/rest simple-git chokidar --depth=0

# ===============================================
# 5️⃣ ТЕСТ ИМПОРТА
# ===============================================

echo ""
echo "🧪 Testing imports..."

# Создаем тестовый файл для проверки импортов
cat > test_imports.js << 'EOF'
// Test GitHub service imports
try {
  const { Octokit } = require('@octokit/rest');
  console.log('✅ @octokit/rest imported successfully');
  
  const simpleGit = require('simple-git');
  console.log('✅ simple-git imported successfully');
  
  const chokidar = require('chokidar');
  console.log('✅ chokidar imported successfully');
  
  console.log('🎊 All imports working!');
} catch (error) {
  console.error('❌ Import error:', error.message);
}
EOF

# Запускаем тест
node test_imports.js

# Удаляем тестовый файл
rm test_imports.js

# ===============================================
# 6️⃣ ПЕРЕЗАПУСК СЕРВЕРА
# ===============================================

echo ""
echo "🔄 Restarting backend server..."
echo ""
echo "📝 Run these commands:"
echo "1. Press Ctrl+C to stop current server"
echo "2. Run: npm run dev"
echo ""
echo "🎯 Expected result:"
echo "✅ Solar Cloud IDE routes loaded"
echo ""

# ===============================================
# 7️⃣ ГОТОВНОСТЬ К ТЕСТИРОВАНИЮ
# ===============================================

echo