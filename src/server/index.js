// Сервер для SPA «Конкурсный зал» — раздаёт статику из build/

console.log('🚀 Инициализация сервера...');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Is PKG:', typeof process.pkg !== 'undefined');

let express, cors, ServerSetup;

try {
  express = require('express');
  cors = require('cors');
  ServerSetup = require('./utils/serverSetup');
  console.log('✅ Модули загружены');
} catch (error) {
  console.error('❌ Ошибка загрузки модулей:', error.message);
  console.log('\n⚠️  Окно закроется через 30 секунд...');
  setTimeout(() => process.exit(1), 30000);
  while (true) {}
}

process.on('uncaughtException', (error) => {
  console.error('\n❌ Необработанная ошибка:', error.message);
  console.log('\n⚠️  Окно закроется через 30 секунд...');
  setTimeout(() => process.exit(1), 30000);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n❌ Необработанное отклонение:', reason);
  console.log('\n⚠️  Окно закроется через 30 секунд...');
  setTimeout(() => process.exit(1), 30000);
});

const app = express();
let serverSetup;

try {
  serverSetup = new ServerSetup();
} catch (error) {
  console.error('❌ Ошибка ServerSetup:', error.message);
  setTimeout(() => process.exit(1), 30000);
  while (true) {}
}

app.use(cors());
app.use(express.json());

serverSetup.setupStaticFiles(app, express);

async function startServer() {
  try {
    await serverSetup.startServer(app, async () => {
      console.log('✅ Сервер готов');
    });
  } catch (error) {
    console.error('❌ Ошибка запуска:', error.message);
    console.log('\n⚠️  Окно закроется через 30 секунд...');
    if (process.stdin.isTTY) {
      try {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once('data', () => process.exit(1));
      } catch (e) {}
    }
    setTimeout(() => process.exit(1), 30000);
  }
}

startServer().catch((error) => {
  console.error('❌ Ошибка:', error.message);
  console.log('\n⚠️  Окно закроется через 30 секунд...');
  if (process.stdin.isTTY) {
    try {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.once('data', () => process.exit(1));
    } catch (e) {}
  }
  setTimeout(() => process.exit(1), 30000);
});
