/**
 * Скрипт для проверки правильного использования Prisma-клиента в тестах
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const testsDir = path.join(__dirname);
const integrationDir = path.join(__dirname, 'integration');

// Проверки, которые нужно выполнить
const checks = [
  {
    pattern: /require\(['"]@prisma\/client['"]\)/g,
    replacement: "require('../prisma/generated/test')",
    message: "Заменить импорт @prisma/client на тестовый клиент"
  },
  {
    pattern: /prisma\.companies\./g,
    replacement: "prisma.companiesT.",
    message: "Заменить обращение к prisma.companies на prisma.companiesT"
  },
  {
    pattern: /prisma\.users\./g,
    replacement: "prisma.usersT.",
    message: "Заменить обращение к prisma.users на prisma.usersT"
  },
  {
    pattern: /prisma\.clients\./g,
    replacement: "prisma.clientsT.",
    message: "Заменить обращение к prisma.clients на prisma.clientsT"
  }
];

// Функция для проверки файла
function checkFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let issues = [];
    
    checks.forEach(check => {
      if (check.pattern.test(content)) {
        issues.push(`${check.message} в файле ${filePath}`);
      }
    });
    
    return issues;
  } catch (error) {
    return [`Ошибка при проверке файла ${filePath}: ${error.message}`];
  }
}

// Функция для проверки директории
function checkDirectory(dir) {
  let allIssues = [];
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // Если это директория, проверяем ее рекурсивно
      const subDirIssues = checkDirectory(filePath);
      allIssues = [...allIssues, ...subDirIssues];
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      // Если это JS или TS файл, проверяем его
      const fileIssues = checkFile(filePath);
      allIssues = [...allIssues, ...fileIssues];
    }
  });
  
  return allIssues;
}

// Проверка всех тестовых файлов
console.log('Проверка использования Prisma-клиента в тестах...');

const issues = checkDirectory(testsDir);

if (issues.length === 0) {
  console.log('✅ Все проверки прошли успешно! Тесты используют правильный Prisma-клиент.');
} else {
  console.log('❌ Обнаружены проблемы:');
  issues.forEach(issue => {
    console.log(`- ${issue}`);
  });
  console.log('\nЭти проблемы нужно исправить для корректной работы тестов с тестовой базой данных.');
  process.exit(1);
}