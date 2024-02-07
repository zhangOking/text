import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from "path";
import archiver from 'archiver';
import cliProgress from 'cli-progress';

async function runLighthouse(url, opts, config = null) {
  const chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });
  opts.port = chrome.port;
  const results = await lighthouse(url, opts, config);
  await chrome.kill();
  return results;
}

// function deleteOldArchives() {
//   const files = fs.readdirSync('.');
//   const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
//
//   files.forEach(file => {
//     if (file.startsWith('lighthouse-results-') && file.endsWith('.zip')) {
//       const stats = fs.statSync(file);
//       if (stats.mtimeMs < oneDayAgo) {
//         fs.unlinkSync(file);
//         console.log(`Deleted old archive: ${file}`);
//       }
//     }
//   });
// }

/*
* 执行lighthouse，并将结果导出到文件中
* @params url String 执行的url
* @params runs Number 执行次数 默认 10
* @params resultsFolder String 导出的文件名称，默认 lighthouse-results
* */
async function main(url, runs = 10, resultsFolder = 'lighthouse-results') {

  const resultsFolderPath = path.join('public', resultsFolder);
  if (!fs.existsSync(resultsFolderPath)) {
    fs.mkdirSync(resultsFolderPath, { recursive: true });
  }

  const opts = {
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    output: 'html',
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
      disabled: false
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1
    },
  };

  let performanceScores = [];
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(runs, 0);

  for (let i = 0; i < runs; i++) {
    const results = await runLighthouse(url, opts);
    const reportHtml = results.report;
    const fileName = `result-${i+1}-${new Date().getTime()}.html`
    const resultsFolderPath = path.join(`public/${resultsFolder}`, fileName);
    fs.writeFileSync(resultsFolderPath, reportHtml);

    const scores = {
      performance: results.lhr.categories.performance.score * 100,
      link: fileName
    };
    performanceScores.push(scores);
    progressBar.update(i + 1);
  }

  progressBar.stop();

  // const timestamp = Date.now();
  // const fileName = `${resultsFolder}-${timestamp}.zip`
  //
  // const outputFilePath = path.join('public', fileName);
  // const output = fs.createWriteStream(outputFilePath);
  // const archive = archiver('zip', {
  //   zlib: { level: 9 }
  // });
  //
  // archive.pipe(output);
  // archive.directory(resultsFolder, false);
  // archive.finalize();
  //
  // deleteOldArchives();

  return { performanceScores }
}

export { main }
