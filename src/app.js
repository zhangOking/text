import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import scheduleTasks from './services/scheduler.js'
import path from "path";
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import homeRoute from './routes/homeRoute.js'
import analyzeRoute from './routes/analyzeRoute.js'
import downloadRoute from './routes/downloadRoute.js'

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/analyze', analyzeRoute);
app.use('/download', downloadRoute);

// 打开静态资源
app.use(express.static(path.join(__dirname, '../web/static')));

// 启动定时任务
scheduleTasks()

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.timeout = 300000
