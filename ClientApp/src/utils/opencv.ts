export const loadOpenCv = (OPENCV_URL: string, onloadCallback: () => void) => {
  let script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('type', 'text/javascript');
  script.addEventListener('load', () => {
    console.log('opencv加载成功');
    if (cv.getBuildInformation) {
      //  console.log(cv.getBuildInformation());
      onloadCallback();
    } else {
      // WASM
      cv['onRuntimeInitialized'] = () => {
        // console.log(cv.getBuildInformation());
        onloadCallback();
      };
    }
  });
  script.addEventListener('error', () => {
    console.error('Failed to load ' + OPENCV_URL);
  });
  script.src = OPENCV_URL;
  let node = document.getElementsByTagName('script')[0];
  node.parentNode?.insertBefore(script, node);
};

export const createFileFromUrl = (
  path: string,
  url: string,
  callback: () => void,
) => {
  let request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function (ev) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        let data = new Uint8Array(request.response);
        cv.FS_createDataFile('/', path, data, true, false, false);
        callback();
      } else {
        console.error('Failed to load ' + url + ' status: ' + request.status);
      }
    }
  };
  request.send();
};

export const urltoFile = (url: string, filename: string) => {
  const type = url.substring(url.indexOf('/') + 1, url.indexOf(';'));
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename + '.' + type, { type: 'image/' + type });
    });
};

export const loadImageToCanvas = (url: string, cavansId: string) => {
  let canvas: any = document.getElementById(cavansId);
  let ctx = canvas?.getContext('2d');
  let img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
  };
  img.src = url;
};
