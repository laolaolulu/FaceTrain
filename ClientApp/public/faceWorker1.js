let classifier;
//console.log('实例化' + new Date());
importScripts('./opencv.js');
if (cv.getBuildInformation) {
  onloadCallback();
} else {
  // WASM
  cv['onRuntimeInitialized'] = () => {
    onloadCallback();
  };
}
self.onmessage = async ({ data }) => {
  switch (data.action) {
    case 'detection':
      //   console.log('detection-start' + new Date());
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
      //  console.log('detection-end' + new Date());
      self.postMessage({ action: 'res', name: data.name, data: resdata });
      break;
    default:
      break;
  }
};
const onloadCallback = () => {
  // console.log('onloadCallback-start' + new Date());
  const name = 'haarcascade_frontalface_alt2.xml';
  classifier = new cv.CascadeClassifier();
  cv.FS_createPreloadedFile(
    '/',
    name,
    name,
    true,
    false,
    () => {
      classifier.load(name);
      //  console.log('onloadCallback-end' + new Date());
      self.postMessage({ action: 'initok' });
    },
    () => {
      console.log('false');
    },
  );
};
