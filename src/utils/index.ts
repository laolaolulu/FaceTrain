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

export const getFace = (file: File, rect: FaceRect) =>
  new Promise<string>((resolve) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      image.src = e.target!.result as string;
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        const context = canvas.getContext('2d')!;
        context.drawImage(
          image,
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          0,
          0,
          rect.width,
          rect.height,
        );
        resolve(canvas.toDataURL());
      };
    };

    reader.readAsDataURL(file);
  });

/**获取文件字节码 */
export const getFile = async (url: string): Promise<ArrayBuffer> => {
  //message.loading({ content: `${url} downloading...`, key: url });
  const response = await fetch(url);
  // message.destroy(url);
  return await response.arrayBuffer();
};
/**从imageData生成image对象 */
export const imageDataToImage = (imageData: ImageData) => {
  // 创建一个新的空的 <canvas> 元素

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  // 设置 <canvas> 的宽度和高度与 ImageData 相同
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  // 在 <canvas> 上绘制 ImageData
  context.putImageData(imageData, 0, 0);

  // 从 <canvas> 创建一个新的 Image 对象
  const image = new Image();
  image.src = canvas.toDataURL(); // 您可以指定图片格式

  return image;
};
