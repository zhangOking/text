import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 移除生成的文件
const removeFiles = () => {
  const directoryPath = path.join(__dirname, '../../../public/lighthouse-results');
  console.log(directoryPath)
  fs.readdir(directoryPath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directoryPath, file), err => {
        if (err) throw err;
      });
    }
  });
}
export default removeFiles
