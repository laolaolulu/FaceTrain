let classifier;
self.importScripts('./opencv.js');

cv['onRuntimeInitialized'] = () => {
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
      console.log('classifier load success');
    },
    (err) => {
      console.error(err);
    },
  );
};

self.onmessage = async ({ data }) => {
  switch (data.action) {
    case 'detection':
      const mat = new cv.matFromArray(
        data.height,
        data.width,
        cv.CV_8UC4,
        new Uint8Array(data.buffer),
      );

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
