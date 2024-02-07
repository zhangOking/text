import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isYarnAvailable() {
  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function installAndBuild() {
  const webPath = path.join(__dirname, '../../web/lighthouse_fe');
  const commandInstall = isYarnAvailable() ? 'yarn install' : 'npm install';
  const commandBuild = isYarnAvailable() ? 'yarn build' : 'npm run build';

  // 安装依赖
  execSync(commandInstall, { stdio: 'inherit', cwd: webPath });

  // 构建项目
  execSync(commandBuild, { stdio: 'inherit', cwd: webPath });
}

function copyDirectory(src, dest) {
  // 确保目标目录存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录中的所有文件和文件夹
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // 如果是目录，则递归复制
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      // 如果是文件，则直接复制
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyBuildToWeb() {
  const sourcePath = path.join(__dirname, '../../web/lighthouse_fe/build');
  const destPath = path.join(__dirname, '../../web/static');


  // 复制文件
  copyDirectory(sourcePath, destPath);
}

try {
  installAndBuild();
  copyBuildToWeb();
  console.log('Frontend built and files copied successfully.');
} catch (error) {
  console.error('Error occurred:', error);
}
