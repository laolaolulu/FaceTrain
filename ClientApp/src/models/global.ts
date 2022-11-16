// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useEffect, useState } from 'react';
import { createFileFromUrl, loadOpenCv } from '@/utils/opencv';
export let classifier: any;

const useUser = () => {
  const [name, setName] = useState<string>(DEFAULT_NAME);

  useEffect(() => {
    loadOpenCv('/opencv.js', () => {
      const faceCascadeFile = 'haarcascade_frontalface_default.xml';
      classifier = new cv.CascadeClassifier();
      createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
        classifier.load(faceCascadeFile);
      });
    });
  }, []);

  return {
    name,
    setName,
  };
};

export default useUser;
