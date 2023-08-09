/* eslint-disable no-case-declarations */
console.log('init faceWorker');
let classifier, classifier_alt2, classifier_alt, classifier_alt_tree, classifier_default;
self.importScripts('opencv_js.js');
self.importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");
const getclassifier = (data) => {
    return new Promise((resolve, reject) => {
        const outtime = setTimeout(() => {
            reject();
            console.error(`${data.mname} load timeout`);
        }, 5000);
        cv.FS_createPreloadedFile(
            '/',
            data.mname,
            `/detection/haarcascade/${data.mname}`,
            true,
            false,
            () => {
                const newclassifier = new cv.CascadeClassifier();
                newclassifier.load(data.mname);
                console.log(`${data.mname} load success`);
                resolve(newclassifier);
                clearTimeout(outtime);
            },
            (err) => {
                console.error(err);
                reject();
            },
        );
    })
}

self.onmessage = async ({ data }) => {
    if (cv instanceof Function) {
        self.cv = await cv();
    }

    switch (data.action) {
        case 'detection'://检测人脸
            // try {
            switch (data.mtype) {
                case 'haarcascade':
                    switch (data.mname) {
                        case 'haarcascade_frontalface_alt2.xml':
                            if (!classifier_alt2) {
                                classifier_alt2 = await getclassifier(data);
                            }
                            classifier = classifier_alt2;
                            break;
                        case 'haarcascade_frontalface_alt.xml':
                            if (!classifier_alt) {
                                classifier_alt = await getclassifier(data);
                            }
                            classifier = classifier_alt;
                            break;
                        case 'haarcascade_frontalface_alt_tree.xml':
                            if (!classifier_alt_tree) {
                                classifier_alt_tree = await getclassifier(data);
                            }
                            classifier = classifier_alt_tree;
                            break;
                        case 'haarcascade_frontalface_default.xml':
                            if (!classifier_default) {
                                classifier_default = await getclassifier(data);
                            }
                            classifier = classifier_default;
                            break;
                        default:
                            throw 'error data.mtype';
                    }
                    const resdatas = data.data.map(
                        async (m) => {

                            // const worker = new Worker("worker.js");
                            // WebWorkers use `postMessage` and therefore work with Comlink.

                            // const mat = new cv.matFromArray(
                            //     m.height,
                            //     m.width,
                            //     cv.CV_8UC4,
                            //     new Uint8Array(m.buffer),
                            // );
                            // const faces = new cv.RectVector();
                            // function callback(value) {
                            //     console.log(value)
                            //     console.time('executionTime');
                            //     console.log('Start');
                            //     classifier.detectMultiScale(mat, faces, 1.1, 3, 0);

                            //     const resdata = Array(faces.size())
                            //         .fill(0)
                            //         .map((_, index) => {
                            //             const face = faces.get(index);
                            //             return {
                            //                 x: face.x,
                            //                 y: face.y,
                            //                 width: face.width,
                            //                 height: face.height,
                            //             };
                            //         });
                            //     faces.delete();
                            //     mat.delete();
                            //     console.log('End');
                            //     console.timeEnd('executionTime');
                            // }
                            // const remoteFunction = Comlink.wrap(new Worker("worker.js"));
                            // await remoteFunction(Comlink.proxy(callback));

                            // const obj = Comlink.wrap(worker);
                            // //    console.log(`Counter: ${await obj.counter}`);
                            // console.log(classifier)
                            // await obj.inc(faces, mat, faces);
                            // console.log(`Counter: ${await obj.counter}`);

                            // console.time('executionTime');
                            // console.log('Start');

                            // classifier.detectMultiScale(mat, faces, 1.1, 3, 0);

                            // const resdata = Array(faces.size())
                            //     .fill(0)
                            //     .map((_, index) => {
                            //         const face = faces.get(index);
                            //         return {
                            //             x: face.x,
                            //             y: face.y,
                            //             width: face.width,
                            //             height: face.height,
                            //         };
                            //     });
                            // faces.delete();
                            // mat.delete();
                            // console.log('End');
                            // console.timeEnd('executionTime');
                            return { name: 'm.name' }

                        });
                    self.postMessage({ action: 'res', name: data.mname, data: Promise.all(resdatas), success: true });
                    break;

                default:
                    break;
            }

            // }
            // catch (error) {
            //     console.log(error)
            //     self.postMessage({ action: 'res', name: data.mname, success: false });
            // }
            break;
        case 'train'://训练识别模型
            const recognizer = new cv.face_LBPHFaceRecognizer();
            const matVector = new cv.MatVector();
            const intVector = new cv.IntVector();

            const intArray = data.faces.flatMap(m => {
                recognizer.setLabelInfo(m.label, 'xx' + m.label);
                return m.facedata.map(face => {
                    matVector.push_back(new cv.matFromArray(
                        face.height,
                        face.width,
                        cv.CV_8UC4,
                        new Uint8Array(face.buffer),
                    ));
                    return m.label;
                })
            });
            const mat2 = new cv.Mat(intArray.length, 1, cv.CV_32SC1);
            mat2.data.set(intArray);
            //  recognizer.predict(labimg.map(m => m.img)[0]);
            //   console.log(recognizer.getLabelInfo(5))

            // console.log(labimg.map(m => m.img)[0])
            // const matVector1 = new cv.MatVector();
            // matVector.push_back(labimg.map(m => m.img)[0]);
            //  matVector1.push_back(labimg.map(m => m.lab)[0]);
            //console.log(labimg.map(m => m.img)[0])
            try {
                recognizer.train(matVector, mat2);
            } catch (error) {
                console.log(error)
            }








            // 训练LBPH模型
            //  const imagePaths = ["path/to/image1.jpg", "path/to/image2.jpg"];
            // const labels = [0, 1];

            // 创建一个空的LBPHFaceRecognizer对象

            //  console.log(model)
            // // 读取图像并为每个图像创建对应的标签
            // const images = imagePaths.map((imagePath) => cv.imread(imagePath, cv.IMREAD_GRAYSCALE));

            // // 进行模型训练
            // model.train(images, labels);

            // // 保存训练好的模型
            // model.save("path/to/model.yml");
            break;
        default:
            break;
    }


};



