import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadController = (req, res) => {

  // 获取文件名
  const filename = req.params.filename;

  console.log(filename)

  // 设置文件的具体路径（根据你的文件结构调整）
  const filePath = path.join(__dirname, '../../public/lighthouse-results', filename);

  console.log(filePath)

  // 触发文件下载
  res.download(filePath, filename, (err) => {
    if (err) {
      // 处理错误
      res.status(404).send("Sorry, we couldn't find that file.");
    }
  });
};
