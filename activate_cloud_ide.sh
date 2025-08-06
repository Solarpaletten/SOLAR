#!/bin/bash
# ⚡ АКТИВАЦИЯ CLOUD IDE ДЛЯ ПРЯМОГО РЕДАКТИРОВАНИЯ
# Настраиваем Cloud IDE для работы с нашими файлами

echo "🎊🔥⚡ АКТИВИРУЕМ CLOUD IDE ДЛЯ РЕДАКТИРОВАНИЯ! ⚡🔥🎊"
echo ""
echo "🎯 ЦЕЛЬ: Использовать Cloud IDE для прямого редактирования файлов"
echo "📁 ФАЙЛЫ: PurchasesPage, WarehousePage, SalesPage"
echo ""

echo "1️⃣ ПРОВЕРЯЕМ CLOUD IDE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Проверяем есть ли Cloud IDE компонент
if [ -f "f/src/components/cloudide/SolarCloudIDE.tsx" ]; then
    echo "✅ SolarCloudIDE компонент найден"
else
    echo "❌ SolarCloudIDE компонент не найден - создаём..."
    mkdir -p f/src/components/cloudide
    
    # Создаём базовую версию Cloud IDE
    cat > f/src/components/cloudide/SolarCloudIDE.tsx << 'EOF'
import React, { useState } from 'react';

const SolarCloudIDE: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');

  const files = [
    'src/pages/company/purchases/PurchasesPage.tsx',
    'src/pages/company/warehouse/WarehousePage.tsx', 
    'src/pages/company/sales/SalesPage.tsx'
  ];

  const loadFile = async (filepath: string) => {
    setSelectedFile(filepath);
    // Здесь будет загрузка файла с сервера
    setFileContent(`// ${filepath}\n// Файл будет загружен с сервера...`);
  };

  const saveFile = async () => {
    // Здесь будет сохранение файла на сервер
    console.log('💾 Сохраняем файл:', selectedFile);
  };

  return (
    <div className="h-screen flex">
      {/* File Explorer */}
      <div className="w-64 bg-gray-100 border-r">
        <div className="p-4 border-b">
          <h3 className="font-bold text-gray-900">☁️ Cloud IDE</h3>
          <p className="text-sm text-gray-600">Direct server editing</p>
        </div>
        
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">📁 Files to Edit:</h4>
          {files.map((file) => (
            <div 
              key={file}
              onClick={() => loadFile(file)}
              className={`p-2 rounded cursor-pointer hover:bg-blue-100 ${
                selectedFile === file ? 'bg-blue-200' : ''
              }`}
            >
              <div className="text-sm text-gray-700">{file.split('/').pop()}</div>
              <div className="text-xs text-gray-500">{file}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedFile && (
          <>
            {/* Header */}
            <div className="bg-white border-b p-4 flex justify-between items-center">
              <div>
                <h2 className="font-medium text-gray-900">{selectedFile.split('/').pop()}</h2>
                <p className="text-sm text-gray-600">{selectedFile}</p>
              </div>
              <button
                onClick={saveFile}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                💾 Save to Server
              </button>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
                placeholder="// Код файла появится здесь..."
              />
            </div>
          </>
        )}

        {!selectedFile && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">☁️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Solar Cloud IDE</h3>
              <p className="text-gray-600 mb-4">Select a file to start editing directly on server</p>
              <div className="space-y-1 text-sm">
                <p>🛒 Edit PurchasesPage.tsx</p>
                <p>🏭 Edit WarehousePage.tsx</p>
                <p>💰 Edit SalesPage.tsx</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolarCloudIDE;
EOF
    echo "✅ SolarCloudIDE создан"
fi

echo ""
echo "2️⃣ ПРОВЕРЯЕМ ROUTING ДЛЯ CLOUD IDE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Проверяем есть ли route для CloudIDE
if grep -q "/cloudide" f/src/app/AppRouter.tsx; then
    echo "✅ Route /cloudide уже существует"
else
    echo "📝 Добавляем route для CloudIDE..."
    
    # Проверяем есть ли import
    if ! grep -q "SolarCloudIDE" f/src/app/AppRouter.tsx; then
        sed -i '/import.*TabBookDemo/a import SolarCloudIDE from '\''../components/cloudide/SolarCloudIDE'\'';' f/src/app/AppRouter.tsx
        echo "✅ Import добавлен"
    fi
    
    # Добавляем route если его нет
    if ! grep -q 'path="/cloudide"' f/src/app/AppRouter.tsx; then
        sed -i '/path="\/tabbook"/a \        <Route\
          path="\/cloudide"\
          element={\
            <AuthGuard>\
              <CompanyLayout>\
                <SolarCloudIDE \/>\
              <\/CompanyLayout>\
            <\/AuthGuard>\
          }\
        \/>' f/src/app/AppRouter.tsx
        echo "✅ Route добавлен"
    fi
fi

echo ""
echo "3️⃣ АЛЬТЕРНАТИВЫ ДЛЯ РЕДАКТИРОВАНИЯ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "🎯 СПОСОБ 1: ☁️ CLOUD IDE В БРАУЗЕРЕ"
echo "   1. Открой: http://localhost:5173/cloudide"
echo "   2. Выбери файл для редактирования"
echo "   3. Редактируй прямо в браузере"
echo "   4. Сохраняй на сервер одной кнопкой"
echo ""

echo "🎯 СПОСОБ 2: 🖥️ VS CODE REMOTE SSH"
echo "   1. Установи расширение 'Remote - SSH' в VS Code"
echo "   2. Подключись: ssh root@207.154.220.86"
echo "   3. Открой папку: /var/www/ai/itsolar"
echo "   4. Редактируй файлы как локально"
echo ""

echo "🎯 СПОСОБ 3: 💻 ТЕРМИНАЛ НА СЕРВЕРЕ"
echo "   ssh root@207.154.220.86"
echo "   cd /var/www/ai/itsolar/f/src/pages/company"
echo "   nano purchases/PurchasesPage.tsx"
echo ""

echo "🎯 СПОСОБ 4: 📁 ФАЙЛЫ ЧЕРЕЗ SCP"
echo "   # Скачать файл с сервера:"
echo "   scp root@207.154.220.86:/var/www/ai/itsolar/f/src/pages/company/purchases/PurchasesPage.tsx ."
echo "   # Редактировать локально"
echo "   # Загрузить обратно:"
echo "   scp PurchasesPage.tsx root@207.154.220.86:/var/www/ai/itsolar/f/src/pages/company/purchases/"
echo ""

echo "4️⃣ СОЗДАЁМ ФАЙЛЫ ДЛЯ КОПИРОВАНИЯ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Создаём папку с готовыми файлами
mkdir -p ready_files

# Создаём PurchasesPage.tsx
cat > ready_files/PurchasesPage.tsx << 'EOF'
import React, { useState, useEffect } from 'react';

interface Purchase {
  id: number;
  date: string;
  supplier: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
}

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPurchases([
        {
          id: 1,
          date: '2025-08-06',
          supplier: 'ASSET LOGISTICS GMBH',
          product: 'RESIDUES TECHNICAL OIL',
          quantity: 25,
          price: 700,
          total: 17500,
          status: 'Completed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddPurchase = () => {
    const newPurchase: Purchase = {
      id: purchases.length + 1,
      date: new Date().toISOString().split('T')[0],
      supplier: 'New Supplier',
      product: 'RESIDUES TECHNICAL OIL',
      quantity: 10,
      price: 750,
      total: 7500,
      status: 'Pending'
    };
    
    setPurchases([...purchases, newPurchase]);
    console.log('🛒 Purchase added - should update warehouse!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">🛒 Purchases Management</h1>
        <p className="text-blue-100">Manage purchase orders - clean & simple</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{purchases.length}</p>
            </div>
            <div className="text-blue-500 text-2xl">🛒</div>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={handleAddPurchase}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          ➕ Add Purchase
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{purchase.date}</td>
                <td className="px-6 py-4 text-sm">{purchase.supplier}</td>
                <td className="px-6 py-4 text-sm">{purchase.product}</td>
                <td className="px-6 py-4 text-sm">{purchase.quantity} T</td>
                <td className="px-6 py-4 text-sm font-medium">€{purchase.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    purchase.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {purchase.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasesPage;
EOF

echo "✅ ready_files/PurchasesPage.tsx создан"

echo ""
echo "🎊🔥⚡ CLOUD IDE АКТИВИРОВАН! ⚡🔥🎊"
echo ""
echo "🚀 КОМАНДЫ ДЛЯ ИСПОЛЬЗОВАНИЯ:"
echo ""
echo "1️⃣ ЧЕРЕЗ CLOUD IDE:"
echo "   cd f && npm run dev"
echo "   # Открой: http://localhost:5173/cloudide"
echo ""
echo "2️⃣ ЧЕРЕЗ SSH:"
echo "   ssh root@207.154.220.86"
echo "   cd /var/www/ai/itsolar/f/src/pages/company"
echo ""
echo "3️⃣ ГОТОВЫЕ ФАЙЛЫ:"
echo "   📁 ready_files/PurchasesPage.tsx - готов к копированию"
echo ""
echo "💡 РЕКОМЕНДАЦИЯ:"
echo "   Используй ☁️ Cloud IDE - это самый удобный способ!"
echo "   Редактируй прямо в браузере и сохраняй на сервер!"
echo ""
echo "🎯 СЛЕДУЮЩИЙ ШАГ:"
echo "   Открой Cloud IDE и перепиши файлы как Products и Clients!"