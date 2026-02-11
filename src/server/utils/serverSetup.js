const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

/**
 * Конфигурация сервера — проект «Конкурсный зал» (architects-office-conference-hall)
 * React + Vite SPA, статические данные: public/data/ → build/data/
 */
const CONFIG = {
  port: 3001,
  kioskMode: false,
  openBrowser: true,
  browserDelay: 1500,
  indexHtmlPath: 'index.html',
};

class ServerSetup {
  constructor() {
    this.isPkg = typeof process.pkg !== 'undefined';
    this.baseDir = this.isPkg
      ? path.dirname(process.execPath)
      : path.join(__dirname, '..', '..', '..');
    this.config = { ...CONFIG };
    this.buildDir = this.isPkg ? this.baseDir : path.join(this.baseDir, 'build');
  }

  getBaseDir() {
    return this.baseDir;
  }

  getBuildDir() {
    return this.buildDir;
  }

  isPkgMode() {
    return this.isPkg;
  }

  getAppUrl() {
    return `http://localhost:${this.config.port}`;
  }

  async checkIndexHtml() {
    const indexPath = path.join(this.buildDir, this.config.indexHtmlPath);
    const exists = await fs.pathExists(indexPath);
    if (!exists) {
      console.error(`\n❌ ${this.config.indexHtmlPath} не найден: ${indexPath}`);
      console.log('   Выполните: npm run build');
    }
    return exists;
  }

  async openBrowser() {
    if (!this.config.openBrowser) return;

    if (os.platform() !== 'win32') {
      console.log(`🌐 Откройте: ${this.getAppUrl()}`);
      return;
    }

    const url = this.getAppUrl();
    const chromePath = path.join(
      process.env.PROGRAMFILES || 'C:\\Program Files',
      'Google\\Chrome\\Application\\chrome.exe'
    );
    const edgePath = path.join(
      process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)',
      'Microsoft\\Edge\\Application\\msedge.exe'
    );

    let browserPath = null;
    if (await fs.pathExists(chromePath)) {
      browserPath = chromePath;
    } else if (await fs.pathExists(edgePath)) {
      browserPath = edgePath;
    }

    if (browserPath) {
      const flags = this.config.kioskMode
        ? `--kiosk "${url}" --start-fullscreen`
        : `--new-window "${url}"`;
      exec(`"${browserPath}" ${flags}`, (err) => {
        if (err) console.log(`🌐 Откройте вручную: ${url}`);
      });
    } else {
      console.log(`🌐 Откройте вручную: ${url}`);
    }
  }

  logServerInfo() {
    console.log(`🚀 Сервер: ${this.getAppUrl()}`);
    console.log(`📂 Статика: ${this.buildDir}`);
    console.log(`🔧 Kiosk: ${this.config.kioskMode ? 'да' : 'нет'}`);
  }

  setupStaticFiles(app, express) {
    app.use(express.static(this.buildDir));
    app.get('*', (req, res) => {
      res.sendFile(path.join(this.buildDir, this.config.indexHtmlPath), (err) => {
        if (err) res.status(500).send(err);
      });
    });
  }

  async startServer(app, onReady) {
    const indexExists = await this.checkIndexHtml();
    if (!indexExists) {
      throw new Error('Сборка не найдена. Выполните: npm run build');
    }

    app.listen(this.config.port, async () => {
      this.logServerInfo();
      if (onReady) await onReady();
      if (this.config.openBrowser) {
        setTimeout(() => this.openBrowser(), this.config.browserDelay);
      }
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Порт ${this.config.port} занят`);
      } else {
        console.error('\n❌ Ошибка:', err.message);
      }
      process.exit(1);
    });
  }
}

module.exports = ServerSetup;
