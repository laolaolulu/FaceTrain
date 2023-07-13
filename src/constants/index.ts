let faceWorker: any;
export const getFaceWorker = async () => {
  if (!faceWorker) {
    const faceWorker1 = new Worker('./faceWorker5.js');
    faceWorker = new Promise((resolve) => {
      const initres = (res: any) => {
        if (res.data.action === 'init') {
          faceWorker1.removeEventListener('message', initres);
          resolve(faceWorker1);
        }
      };
      faceWorker1.addEventListener('message', initres);
      faceWorker1.postMessage({
        action: 'init',
      });
    });
  }
  return await faceWorker;
};

// let isonloadopencv = true;
// export const getCv = async () => {
//   if (isonloadopencv) {
//     isonloadopencv = await new Promise<boolean>((resolve) => {
//       const script = document.createElement('script');
//       script.src = './opencv.js';
//       script.async = true;
//       script.onload = () => {
//         resolve(false);
//       };
//       script.onerror = () => {
//         console.error('opencv.js加载失败');
//         resolve(true);
//       };
//       document.body.appendChild(script);
//     });
//   }
//   return isonloadopencv;
// };

// let classifier: any = undefined;
// export const getClassifier = async () => {
//   if (!classifier) {
//     if (await getCv()) {
//       classifier = undefined;
//     } else {
//       classifier = await new Promise<any>((resolve) => {
//         cv['onRuntimeInitialized'] = () => {
//           const name = 'haarcascade_frontalface_alt2.xml';
//           classifier = new cv.CascadeClassifier();
//           cv.FS_createPreloadedFile(
//             '/',
//             name,
//             name,
//             true,
//             false,
//             () => {
//               classifier.load(name);
//               resolve(classifier);
//             },
//             () => {
//               resolve(undefined);
//             },
//           );
//         };
//       });
//     }
//   }
//   return classifier;
// };
