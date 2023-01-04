// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useEffect, useState } from 'react';
import { createFileFromUrl, loadOpenCv } from '@/utils/opencv';
import { faceWorker } from '@/constants';
export let classifier: any;

const useUser = () => {
  const [name, setName] = useState<string>(DEFAULT_NAME);

  useEffect(() => {
    faceWorker.postMessage({ action: 'init' });

    // loadOpenCv('/opencv.js', () => {
    //   const faceCascadeFile = 'haarcascade_frontalface_alt2.xml';
    //   classifier = new cv.CascadeClassifier();
    //   createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
    //     classifier.load(faceCascadeFile);
    //   });
    // });
  }, []);

  return {
    name,
    setName,
  };
};

export default useUser;
