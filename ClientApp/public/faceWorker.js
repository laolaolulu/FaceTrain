let classifier;
self.importScripts('./opencv.js');

self.onmessage = async ({ data }) => {
  switch (data.action) {
    case 'init':
      if (cv.getBuildInformation) {
        onloadCallback();
      } else {
        // WASM
        cv['onRuntimeInitialized'] = () => {
          onloadCallback();
        };
      }
      break;
    case 'detection':
      const mat = new cv.Mat(data.height, data.width, cv.CV_8UC4);
      mat.data.set(new Uint8Array(data.buffer));
      const faces = new cv.RectVector();
      classifier.detectMultiScale(mat, faces, 1.1, 3, 0);
      const resdata = Array(faces.size())
        .fill(0)
        .map((_, index) => {
          const face = faces.get(index);
          return {
            x: face.x,
            y: face.y,
            width: face.width,
            height: face.height,
          };
        });
      faces.delete();
      mat.delete();
      self.postMessage({ action: 'res', name: data.name, data: resdata });
      break;
    default:
      break;
  }
};
const onloadCallback = () => {
  const url = 'haarcascade_frontalface_alt2.xml';
  classifier = new cv.CascadeClassifier();
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const data = new Uint8Array(request.response);
        cv.FS_createDataFile('/', url, data, true, false, false);
        classifier.load(url);
      } else {
        console.error('Failed to load ' + url + ' status: ' + request.status);
      }
    }
  };
  request.send();
};
