const { spawn } = require('child_process');

function runAnalyze(data) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [__dirname+'\\main.py', JSON.stringify(data)]);

    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      reject(data.toString());
    });

    python.on('close', (code) => {
      resolve((result));
    });
  });
}

module.exports = runAnalyze