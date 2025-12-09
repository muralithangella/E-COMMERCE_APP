const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const cloudinary = require('../config/cloudinary');

if (!isMainThread) {
  const { action, data } = workerData;
  
  (async () => {
    try {
      if (action === 'upload') {
        const result = await cloudinary.uploader.upload(data.buffer, {
          folder: 'products',
          resource_type: 'auto'
        });
        parentPort.postMessage({ success: true, result });
      } else if (action === 'delete') {
        await cloudinary.uploader.destroy(data.publicId);
        parentPort.postMessage({ success: true });
      }
    } catch (error) {
      parentPort.postMessage({ success: false, error: error.message });
    }
  })();
}

function processImage(action, data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, { workerData: { action, data } });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

module.exports = { processImage };
