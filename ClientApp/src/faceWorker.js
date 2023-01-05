self.importScripts(['../opencv.js']);
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
    case 'start':
      let img = await self.createImageBitmap(data.src);

      //   const img = new Image();
      //   img.src = data.src;
      //   img.onload = () => {
      console.log(img);
      //     const mat = cv.imread(img);
      //     console.log(mat);
      //     const faces = new cv.RectVector();
      //     classifier.detectMultiScale(mat, faces, 1.1, 3, 0); //人脸检测
      //     // self.postMessage(JSON.stringify(faces));
      //     console.log(JSON.stringify(faces));
      //     faces.delete();
      //     mat.delete();
      //   };
      break;

    default:
      break;
  }
};
let classifier;
const onloadCallback = () => {
  const faceCascadeFile = '../haarcascade_frontalface_alt2.xml';
  classifier = new cv.CascadeClassifier();
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const data = new Uint8Array(request.response);
        cv.FS_createDataFile('/', path, data, true, false, false);
        classifier.load(faceCascadeFile);
      } else {
        console.error('Failed to load ' + url + ' status: ' + request.status);
      }
    }
  };
  request.send();
};
