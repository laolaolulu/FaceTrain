// 全局共享数据示例
import { useEffect, useState } from 'react';

export default () => {
  useEffect(() => {
    // navigator.mediaDevices.enumerateDevices().then((dev) => {
    //   if (
    //     dev.length == 0 ||
    //     !dev.find((f) => f.deviceId && f.kind == 'videoinput')
    //   ) {
    //     //可能没有授权摄像头
    //     navigator.mediaDevices
    //       .getUserMedia({
    //         video: true,
    //       })
    //       .then((res) => {
    //         res.getVideoTracks().forEach((element) => {
    //           element.stop();
    //         });
    //       });
    //   }
    // });
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
