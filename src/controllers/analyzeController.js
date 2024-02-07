import { main as ScriptMainFunc } from '../scripts/lighthouse-test.js';

export const analyze = (req, res) => {
  const userData = req.body;
  console.log(userData)

  ScriptMainFunc(userData.url, userData.runs)
    .then(r => {
      console.log('Performance Scores:');
      res.status(200).json({
        code: 200,
        success: true,
        data: {
          url: userData.url,
          runs: userData.runs,
          result: r.performanceScores
        },
        message: '响应成功'
      });
      // 发送邮件
    })
};
