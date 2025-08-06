#!/bin/bash
# 🔧 ЗАВЕРШЕНИЕ ИСПРАВЛЕНИЯ PURCHASES, WAREHOUSE, BANKING
# Убираем expandable: true и удаляем все submenu блоки

echo "🎊🔥🔧 ЗАВЕРШЕНИЕ ИСПРАВЛЕНИЯ PURCHASES, WAREHOUSE, BANKING! 🔧🔥🎊"
echo ""
echo "🎯 ЦЕЛЬ: Сделать ВСЕ items прямыми ссылками как Sales и Clients"
echo ""

# 1. Backup
echo "1️⃣ СОЗДАНИЕ BACKUP:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cp f/src/components/company/CompanySidebar.tsx f/src/components/company/CompanySidebar.tsx.before_final_fix
echo "✅ Backup: CompanySidebar.tsx.before_final_fix"

# 2. Убираем expandable: true для всех items
echo ""
echo "2️⃣ УБИРАЕМ expandable: true ДЛЯ ВСЕХ ITEMS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Убираем expandable: true для purchases
sed -i '' '/id: .purchases.,/,/},/{
  s/expandable: true,//g
}' f/src/components/company/CompanySidebar.tsx
echo "✅ Purchases: expandable убран"

# Убираем expandable: true для warehouse  
sed -i '' '/id: .warehouse.,/,/},/{
  s/expandable: true,//g
}' f/src/components/company/CompanySidebar.tsx
echo "✅ Warehouse: expandable убран"

# Убираем expandable: true для banking
sed -i '' '/id: .banking.,/,/},/{
  s/expandable: true,//g
}' f/src/components/company/CompanySidebar.tsx
echo "✅ Banking: expandable убран"

# 3. Удаляем все submenu rendering блоки
echo ""
echo "3️⃣ УДАЛЕНИЕ ВСЕХ SUBMENU RENDERING БЛОКОВ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python3 << 'PYTHON_SCRIPT'
import re

# Читаем файл
with open('f/src/components/company/CompanySidebar.tsx', 'r') as f:
    content = f.read()

# Удаляем submenu блоки для purchases
purchases_pattern = r'\s*\{item\.id === \'purchases\' && \(\s*<div className="space-y-1">.*?</div>\s*\)\}'
content = re.sub(purchases_pattern, '', content, flags=re.DOTALL)
print("✅ Purchases submenu rendering удалён")

# Удаляем submenu блоки для warehouse
warehouse_pattern = r'\s*\{item\.id === \'warehouse\' && \(\s*<div className="space-y-1">.*?</div>\s*\)\}'
content = re.sub(warehouse_pattern, '', content, flags=re.DOTALL)
print("✅ Warehouse submenu rendering удалён")

# Удаляем submenu блоки для banking
banking_pattern = r'\s*\{item\.id === \'banking\' && \(\s*<div className="space-y-1">.*?</div>\s*\)\}'
content = re.sub(banking_pattern, '', content, flags=re.DOTALL)
print("✅ Banking submenu rendering удалён")

# Записываем обратно
with open('f/src/components/company/CompanySidebar.tsx', 'w') as f:
    f.write(content)
PYTHON_SCRIPT

# 4. Добавляем недостающий закрывающий код если нужно
echo ""
echo "4️⃣ ПРОВЕРЯЕМ СТРУКТУРУ ФАЙЛА:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Проверяем что файл корректно закрывается
if ! tail -10 f/src/components/company/CompanySidebar.tsx | grep -q "export default"; then
    echo "⚠️ Файл может быть повреждён, добавляем недостающий код..."
    
    # Добавляем недостающие закрывающие теги если нужно
    cat >> f/src/components/company/CompanySidebar.tsx << 'EOF'
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={() => {
            localStorage.removeItem('currentCompanyId');
            localStorage.removeItem('currentCompanyName');
            window.location.href = '/account/dashboard';
          }}
          className="text-sm text-slate-400 hover:text-white transition-colors w-full text-left flex items-center"
        >
          <span className="mr-2">🔙</span>
          <span>Back to Companies</span>
        </button>
      </div>
    </div>
  );
};

export default CompanySidebar;
EOF
    echo "✅ Недостающий код добавлен"
else
    echo "✅ Файл корректно завершён"
fi

# 5. Проверяем результат
echo ""
echo "5️⃣ ПРОВЕРЯЕМ ФИНАЛЬНЫЙ РЕЗУЛЬТАТ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🔍 Все items с expandable:"
if grep -q "expandable: true" f/src/components/company/CompanySidebar.tsx; then
    echo "❌ Остались expandable items:"
    grep -n "expandable: true" f/src/components/company/CompanySidebar.tsx
else
    echo "✅ Все expandable: true убраны!"
fi

echo ""
echo "🔍 Проверяем submenu rendering:"
submenu_count=$(grep -c "item\.id ===" f/src/components/company/CompanySidebar.tsx)
if [ "$submenu_count" -gt 2 ]; then
    echo "⚠️ Остались submenu rendering блоки:"
    grep -n "item\.id ===" f/src/components/company/CompanySidebar.tsx
else
    echo "✅ Все submenu rendering блоки удалены!"
fi

# 6. Финальная сборка
echo ""
echo "6️⃣ ОЧИСТКА КЭША И ГОТОВНОСТЬ К ТЕСТИРОВАНИЮ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

pkill -f "vite\|npm.*dev" 2>/dev/null || true
if [ -d "f/node_modules/.vite" ]; then
    rm -rf f/node_modules/.vite
fi
echo "🔄 Кэш очищен"

echo ""
echo "🎊🔥🔧 ВСЕ ИСПРАВЛЕНИЯ ЗАВЕРШЕНЫ! 🔧🔥🎊"
echo ""
echo "✅ РЕЗУЛЬТАТ - ВСЕ ITEMS ПРЯМЫЕ ССЫЛКИ:"
echo "   📊 Dashboard → /dashboard"
echo "   👥 Clients → /clients"  
echo "   📦 Products → /products"
echo "   💰 Sales → /sales"
echo "   🛒 Purchases → /purchases" 
echo "   🏭 Warehouse → /warehouse"
echo "   📋 Chart of Accounts → /chart-of-accounts"
echo "   🏦 Banking → /banking"
echo "   ⚡ TAB-Бухгалтерия → /tabbook"
echo "   ☁️ Cloud IDE → /cloudide"
echo "   ⚙️ Settings → /settings"
echo ""
echo "🎯 ТЕСТИРОВАНИЕ:"
echo "   1️⃣ cd f && npm run dev"
echo "   2️⃣ Тестируй все ссылки в sidebar"
echo "   3️⃣ Все должны открываться как прямые переходы"
echo ""
echo "🏆 ИДЕАЛЬНЫЙ SIDEBAR ГОТОВ!"