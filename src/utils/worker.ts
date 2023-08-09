import workerpool from 'workerpool';
import { getSendImgData } from '@/utils';
const obj: any = {};

/**获取文件字节码 */
async function getFile(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  return await response.arrayBuffer();
}
/**获取模型字节码 */
const getModel = (path: string, mtype: string, mname: string) => {
  const getfiles = [mname];
  const caffemodel = '.caffemodel';
  if (mname.endsWith(caffemodel)) {
    getfiles.push(
      mname.substring(0, mname.length - caffemodel.length) + '.prototxt',
    );
  }
  return Promise.all<Promise<ArrayBuffer>>(
    getfiles.map((name) => {
      const url = `${path}/${mtype}/${name}`;
      //将模型名称定义为变量来接受模型文件字节码
      const varname = name.replace(/^\d+|[^a-zA-Z0-9_]/g, '');
      if (!obj[varname]) {
        obj[varname] = getFile(url);
      }
      return obj[varname];
    }),
  );
};
/**获取opencv.js字节码 */
const getCv = (): Promise<ArrayBuffer> => {
  if (!obj['cv']) {
    obj['cv'] = getFile('./opencv_js.js');
  }
  return obj['cv'];
};
const pool = workerpool.pool();
obj['haarcascade'] = async (mtype: string, mname: string, images: File[]) => {
  const flies = await Promise.all([
    getModel('detection', mtype, mname),
    getCv(),
    Promise.all(images.map((m) => getSendImgData(m))),
  ]);

  return pool
    .exec(
      (mflie: ArrayBuffer, cvfile: ArrayBuffer, images: ImageData[]) => {
        const blob = new Blob([cvfile], {
          type: 'application/javascript',
        });
        // 创建 Blob 对象的 URL
        const blobUrl = URL.createObjectURL(blob);
        importScripts(blobUrl);

        return new Promise(function (resolve) {
          cv().then(function (res: any) {
            cv = res;

            const name = 'classifiermodelname';
            cv.FS_createDataFile('/', name, new Uint8Array(mflie), true, false);
            const classifier = new cv.CascadeClassifier();
            classifier.load(name);

            const faces = new cv.RectVector();
            const resdata = images.map((image) => {
              const mat = new cv.matFromImageData(image);
              const startTime = performance.now();
              classifier.detectMultiScale(mat, faces, 1.1, 3, 0);
              const endTime = performance.now();
              mat.delete();
              return {
                time: endTime - startTime,
                faces: Array(faces.size())
                  .fill(0)
                  .map((_, index) => {
                    const face = faces.get(index);
                    return {
                      x: face.x,
                      y: face.y,
                      width: face.width,
                      height: face.height,
                    };
                  }),
              };
            });
            faces.delete();
            resolve(resdata);
          });
        });
      },
      [flies[0][0], flies[1], flies[2]],
      {
        transfer: [
          flies[0][0],
          flies[1],
          ...flies[2].map((m) => m.data.buffer),
        ],
      },
    )
    .then(function (result) {
      console.log(pool.stats());
      //  pool.terminate();
      return result;
    });
};
obj['ssd'] = async (mtype: string, mname: string, images: File[]) => {
  console.log('xxoo');
  //   const flies = await Promise.all([getModel('ssd', mtype, mname), getCv()]);
  //   console.log(flies);
  const poolq = workerpool.pool('worker.js');
  poolq
    .exec('detection', [10])
    .then(function (result) {
      console.log('Result: ' + result); // outputs 55
    })
    .catch(function (err) {
      console.error(err);
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
};

export const detection = (
  mtype: string,
  mname: string,
  par: any,
  callback: (res: any) => void,
) => {
  if (typeof obj[mtype] === 'function') {
    return obj[mtype](mtype, mname, par);
  } else {
    console.error(`函数 ${mtype} 没有找到`);
    return Promise.resolve();
  }
};
