import { getSendImgData } from '@/utils';
import workerpool from 'workerpool';
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

obj['haarcascade'] = async (
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
