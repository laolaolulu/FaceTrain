// 全局共享数据示例
import { useEffect, useState } from 'react';
import { createFileFromUrl } from '@/utils/opencv';
import { faceWorker } from '@/constants';

export default () => {
  useEffect(() => {
    // setTimeout(() => {
    //   faceWorker.postMessage({ action: 'init' });
    // }, 10000);
    // const onloadCallback = () => {
    //   const name = 'haarcascade_frontalface_alt2.xml';
    //   var classifier = new cv.CascadeClassifier();
    //   cv.FS_createPreloadedFile(
    //     '/',
    //     name,
    //     name,
    //     true,
    //     false,
    //     () => {
    //       classifier.load(name);
    //       //  console.log('onloadCallback-end' + new Date());
    //       self.postMessage({ action: 'initok' });
    //     },
    //     () => {
    //       console.log('false');
    //     },
    //   );
    // };
    // if (cv.getBuildInformation) {
    //   onloadCallback();
    // } else {
    //   // WASM
    //   cv['onRuntimeInitialized'] = () => {
    //     onloadCallback();
    //   };
    // }
  }, []);

  return {};
};
