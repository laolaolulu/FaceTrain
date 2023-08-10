export const downfile = (url: string) => {
  let request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'blob';
  console.log(url);
  request.onload = function (e: any) {
    console.log(e);
    const anchor = document.createElement('a');
    anchor.href = e.target.response;
    anchor.setAttribute('download', url.split('/').at(-1) || 'download');
    //  anchor.className = 'download-js-link';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    setTimeout(function () {
      anchor.click();
      document.body.removeChild(anchor);
    }, 66);
  };
  request.send();
};

export const sleep = (time: number) => {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, time));
};

//定义全局faceWorker对象
// let faceWorker: any;
// export const getWorker = () => {
//   if (!faceWorker) {
//     faceWorker = wrap(new Worker('./worker.js'));
//   }
//   return faceWorker;
// };

/**通过图片file获取 imageData*/
export const getSendImgData = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const outtime = setTimeout(() => {
      reject();
    }, 3000);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const ctx = new OffscreenCanvas(img.width, img.height).getContext(
          '2d',
          {
            willReadFrequently: true,
          },
        )!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
        clearTimeout(outtime);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**显示大小 kb/mb */
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
