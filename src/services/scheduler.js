import cron from 'node-cron';
import removeFiles from './scheduler/removeFiles.js'

const scheduleTasks = () => {
  // 定义一个定时任务
  cron.schedule(process.env.CRON_SCHEDULE, () => {
    removeFiles()
  });
};

export default scheduleTasks
