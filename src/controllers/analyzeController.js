import { main as ScriptMainFunc } from '../scripts/lighthouse-test.js';

let flag = false
let result = null

const running = (req, res) => {
    const userData = req.body;
    res.status(200).json({
        code: 201,
        success: true,
        data: {
            url: userData.url,
            runs: userData.runs,
            result: [],
            message: "正在执行，请稍后"
        },
        message: '响应成功'
    });
}

export const analyze = (req, res) => {
  const userData = req.body;
  console.log(userData);

  if (!flag) {
      flag = true
      ScriptMainFunc(userData.url, userData.runs).then(r => {
          result = {
              url: userData.url,
              runs: userData.runs,
              result: r.performanceScores,
              message: "执行完成"
          }
      })
      running(req, res)
  } else {
      if (result) {
          res.status(200).json({
              code: 200,
              success: true,
              data: result,
              message: '响应成功'
          });
          flag = false
          result = null
      } else {
          running(req, res)
      }
  }

  // ScriptMainFunc(userData.url, userData.runs)
  //   .then(r => {
  //     console.log('Performance Scores:' + r);
  //
  //     res.status(200).json({
  //       code: 200,
  //       success: true,
  //       data: {
  //         url: userData.url,
  //         runs: userData.runs,
  //         result: r.performanceScores
  //       },
  //       message: '响应成功'
  //     });
  //   })
};
