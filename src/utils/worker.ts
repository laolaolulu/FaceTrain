import { getFile, getSendImgData } from '@/utils';
import workerpool from 'workerpool';
const obj: any = {};
/**我的文件缓存 */
const myFiles: { name: string; file: Promise<ArrayBuffer> }[] = [];

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
      const modelfile = myFiles.find((f) => f.name === name);
      if (modelfile) {
        return modelfile.file;
      } else {
        const file = getFile(url);
        myFiles.push({ name, file });
        return file;
      }
    }),
  );
};
/**获取opencv.js字节码 */
const getCv = (): Promise<ArrayBuffer> => {
  const cvfile = myFiles.find((f) => f.name === 'cv');
  if (cvfile) {
    return cvfile.file;
  } else {
    const file = getFile('./opencv_js.js');
    myFiles.push({ name: 'cv', file });
    return file;
  }
};
// /**我的参数传递方法 */
// const myMethod: any = {
//   init_haarcascade: async (worker: Worker, mtype: string, mname: string) => {
//     const action = `init_${mtype}`;
//     const files = await Promise.all([
//       getCv(),
//       getModel('detection', mtype, mname),
//     ]);
//     const bool = await new Promise((resolve) => {
//       worker.addEventListener(action, (event: any) => {
//         resolve(event.detail.success);
//       });
//       worker.postMessage({ action, cvfile: files[0], mfile: files[1] });
//     });
//     return bool;
//   },
//   init_ssd: async (worker: Worker, mtype: string, mname: string) => {
//     const action = 'init_ssd';
//     const files = await Promise.all([
//       getCv(),
//       getModel('detection', mtype, mname),
//     ]);
//     const bool = await new Promise((resolve) => {
//       worker.addEventListener(action, (event: any) => {
//         resolve(event.detail.success);
//       });

//       worker.postMessage({ action, cvfile: files[0], mfile: files[1] });
//     });
//     return bool;
//   },
// };

export const initWorker = async (mtype: string, mname: string) => {
  const worker = new Worker('worker.js');

  const action = `init_${mtype}`;
  const init = new Promise<boolean>((resolve) => {
    const initWorker = (event: any) => {
      if (event.data.action === action) {
        worker.removeEventListener('message', initWorker);
        resolve(event.data.success);
      }
    };
    worker.addEventListener('message', initWorker);
  });
  const files = await Promise.all([
    getCv(),
    getModel('detection', mtype, mname),
  ]);

  worker.postMessage({ action, cvfile: files[0], mfile: files[1] });

  return {
    worker,
    exec: async (image: ImageData, imgID: number) => {
      if (await init) {
        const action = `exec_${mtype}_${imgID}`;
        const exec = new Promise<{ success: boolean; data: any }>((resolve) => {
          const execWorker = (event: any) => {
            if (event.data.action === action) {
              worker.removeEventListener('message', execWorker);
              resolve(event.data);
            }
          };
          worker.addEventListener('message', execWorker);
        });

        worker.postMessage({ action, image });
        return await exec;
      } else {
        console.error('worker init error');
      }
      return { success: false, data: undefined };
    },
  };
};

obj['haarcascade'] = async (
  mtype: string,
  mname: string,
  images: any,
  callback: (res: any) => void,
) => {
  const pool = workerpool.pool('myWorker.js');
  for (let index = 0; index < 10; index++) {
    getCv().then(() => {
      console.log('xxdds', Date());
    });
  }
  // const imgdatas = await Promise.all(images.map((m) => getSendImgData(m)));
  pool
    .exec(`detection_${mtype}`, [mname, images], {
      // transfer: imgdatas.map((m) => m.data.buffer),
      on: callback,
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
  return pool;
};

obj['ssd'] = async (
  mtype: string,
  mname: string,
  images: File[],
  callback: (res: any) => void,
) => {
  const pool = workerpool.pool('worker.js');
  const imgdatas = await Promise.all(images.map((m) => getSendImgData(m)));
  pool
    .exec(`detection_${mtype}`, [mname, imgdatas], {
      transfer: imgdatas.map((m) => m.data.buffer),
      on: callback,
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
  return pool;
};
//export const detection=()=>{}
export const detection = (
  mtype: string,
  mname: string,
  data: any,
  callback: (res: any) => void,
) => {
  if (typeof obj[mtype] === 'function') {
    return obj[mtype](mtype, mname, data, callback);
  } else {
    console.error(`函数 ${mtype} 没有找到`);
    return Promise.resolve();
  }
};
