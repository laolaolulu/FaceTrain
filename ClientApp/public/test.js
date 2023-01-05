console.log('test.js load');
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
    case 'start':
      //   const bitimg = await self.createImageBitmap(data.file);
      //   const canvas = new OffscreenCanvas(bitimg.width, bitimg.height);
      //   const ctx = canvas.getContext('2d');
      //   ctx.drawImage(bitimg, 0, 0);
      //   const imgdata = ctx.getImageData(0, 0, bitimg.width, bitimg.height);
      //   var mat = cv.matFromImageData(imgdata);
      console.log(new Date());
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

      if (data.name == 'video-lp-img') {
        if (resdata.length > 0) {
          self.postMessage(
            {
              action: 'res',
              name: data.name,
              data: resdata,
              buffer: data.buffer,
            },
            [data.buffer],
          );
        }
      } else {
        self.postMessage({ action: 'res', name: data.name, data: resdata });
      }

      break;

    default:
      break;
  }
};
const onloadCallback = () => {
  const faceCascadeFile = 'haarcascade_frontalface_alt2.xml';
  const url = './' + faceCascadeFile;
  classifier = new cv.CascadeClassifier();
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const data = new Uint8Array(request.response);
        cv.FS_createDataFile('/', url, data, true, false, false);
        classifier.load(faceCascadeFile);
      } else {
        console.error('Failed to load ' + url + ' status: ' + request.status);
      }
    }
  };
  request.send();
};
