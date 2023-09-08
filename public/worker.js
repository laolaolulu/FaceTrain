let classifier, netDet;
self.onmessage = function (event) {
    const data = event.data;
    if (data.action === 'init_haarcascade') {
        const cvblob = new Blob([data.cvfile], {
            type: 'application/javascript',
        });
        // 创建 Blob 对象的 URL
        const cvblobUrl = URL.createObjectURL(cvblob);
        importScripts(cvblobUrl);
        cv().then(function (res) {
            cv = res;
            const name = 'classifiermodelname';
            cv.FS_createDataFile('/', name, new Uint8Array(data.mfile[0]), true, false);
            classifier = new cv.CascadeClassifier();
            classifier.load(name);
            self.postMessage({ action: data.action, success: true });
        });
    } else if (data.action === 'init_ssd') {
        const cvblob = new Blob([data.cvfile], {
            type: 'application/javascript',
        });
        // 创建 Blob 对象的 URL
        const cvblobUrl = URL.createObjectURL(cvblob);
        importScripts(cvblobUrl);
        cv().then(async (res) => {
            cv = res;
            const names = ['ssd.caffemodel', 'ssd.prototxt']
            names.forEach((name, index) => {
                cv.FS_createDataFile('/', name, new Uint8Array(data.mfile[index]), true, false);
            });

            netDet = cv.readNetFromCaffe(names[1], names[0]);
            self.postMessage({ action: data.action, success: true });

        });
    } else if (data.action.startsWith('exec_haarcascade_')) {
        const faces = new cv.RectVector();
        const mat = new cv.matFromImageData(data.image);
        const startTime = performance.now();
        classifier.detectMultiScale(mat, faces, 1.1, 3, 0);
        const endTime = performance.now();
        self.postMessage({
            action: data.action, success: true, data: {
                time: endTime - startTime, faces: Array(faces.size())
                    .fill(0)
                    .map((_, index) => {
                        const face = faces.get(index);
                        return {
                            x: face.x,
                            y: face.y,
                            width: face.width,
                            height: face.height,
                        };
                    })
            }
        });
        mat.delete();
        faces.delete();
    } else if (data.action.startsWith('exec_ssd_')) {
        const img = new cv.matFromImageData(data.image);
        cv.cvtColor(img, img, cv.COLOR_RGBA2BGR);
        const blob = cv.blobFromImage(img, 1, { width: 300, height: 300 });
        netDet.setInput(blob);
        const startTime = performance.now();
        const out = netDet.forward();
        const endTime = performance.now();
        const faces = [];

        for (let i = 0, n = out.data32F.length; i < n; i += 7) {
            const confidence = out.data32F[i + 2];
            let left = out.data32F[i + 3] * img.cols;
            let top = out.data32F[i + 4] * img.rows;
            let right = out.data32F[i + 5] * img.cols;
            let bottom = out.data32F[i + 6] * img.rows;
            left = Math.min(Math.max(0, left), img.cols - 1);
            right = Math.min(Math.max(0, right), img.cols - 1);
            bottom = Math.min(Math.max(0, bottom), img.rows - 1);
            top = Math.min(Math.max(0, top), img.rows - 1);

            if (confidence > 0.5 && left < right && top < bottom) {
                faces.push({ x: left, y: top, width: right - left, height: bottom - top })
            }
        }

        self.postMessage({
            action: data.action, success: true, data: {
                time: endTime - startTime, faces
            }
        });

        blob.delete();
        out.delete();
    }
}

// }
//
// };


// importScripts("workerpool.min.js");
// importScripts('opencv_js.js');

// const detection_haarcascade = async (mname, images) => {
//     console.log(images)
//     // images.forEach(async element => {
//     //     console.log(await element.getimg());
//     // });

//     console.log('xxoo');
//     // cv = await cv();
//     // await new Promise((resolve) => {
//     //     cv.FS_createPreloadedFile(
//     //         '/', mname, `/detection/haarcascade/${mname}`, true, false,
//     //         () => {
//     //             resolve();
//     //         },
//     //         (err) => {
//     //             console.error(err);
//     //             reject();
//     //         },
//     //     );
//     // });
//     // const classifier = new cv.CascadeClassifier();
//     // classifier.load(mname);

//     // const faces = new cv.RectVector();
//     // images.forEach((image, index) => {
//     //     const mat = new cv.matFromImageData(image);
//     //     const startTime = performance.now();
//     //     classifier.detectMultiScale(mat, faces, 1.1, 3, 0);
//     //     const endTime = performance.now();
//     //     workerpool.workerEmit({
//     //         index, time: endTime - startTime, faces: Array(faces.size())
//     //             .fill(0)
//     //             .map((_, index) => {
//     //                 const face = faces.get(index);
//     //                 return {
//     //                     x: face.x,
//     //                     y: face.y,
//     //                     width: face.width,
//     //                     height: face.height,
//     //                 };
//     //             })
//     //     })
//     //     mat.delete();
//     // });
//     // faces.delete();

// }

// const detection_ssd = async (mname, images) => {

//     const getfiles = [mname];
//     const caffemodel = '.caffemodel';
//     if (mname.endsWith(caffemodel)) {
//         getfiles.push(
//             mname.substring(0, mname.length - caffemodel.length) + '.prototxt',
//         );
//     }
//     cv = await cv();
//     await Promise.all(getfiles.map(m => new Promise((resolve) => {
//         cv.FS_createPreloadedFile(
//             '/', m, `/detection/ssd/${m}`, true, false,
//             () => {
//                 resolve();
//             },
//             (err) => {
//                 console.error(err);
//                 reject();
//             },
//         );
//     })));
//     if (mname.endsWith(caffemodel)) {
//         const netDet = cv.readNetFromCaffe(getfiles[1], getfiles[0]);
//         images.forEach((image, index) => {
//             const img = new cv.matFromImageData(image);
//             cv.cvtColor(img, img, cv.COLOR_RGBA2BGR);
//             const blob = cv.blobFromImage(img, 1, { width: 300, height: 300 });
//             netDet.setInput(blob);
//             const startTime = performance.now();
//             const out = netDet.forward();
//             const endTime = performance.now();
//             const faces = [];

//             for (let i = 0, n = out.data32F.length; i < n; i += 7) {
//                 const confidence = out.data32F[i + 2];
//                 let left = out.data32F[i + 3] * img.cols;
//                 let top = out.data32F[i + 4] * img.rows;
//                 let right = out.data32F[i + 5] * img.cols;
//                 let bottom = out.data32F[i + 6] * img.rows;
//                 left = Math.min(Math.max(0, left), img.cols - 1);
//                 right = Math.min(Math.max(0, right), img.cols - 1);
//                 bottom = Math.min(Math.max(0, bottom), img.rows - 1);
//                 top = Math.min(Math.max(0, top), img.rows - 1);

//                 if (confidence > 0.5 && left < right && top < bottom) {
//                     faces.push({ x: left, y: top, width: right - left, height: bottom - top })
//                 }
//             }
//             workerpool.workerEmit({ index, time: endTime - startTime, faces })
//             blob.delete();
//             out.delete();
//         });
//         netDet.delete();
//     }
// }

// workerpool.worker({
//     detection_ssd: detection_ssd,
//     detection_haarcascade: detection_haarcascade
// });