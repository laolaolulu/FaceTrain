importScripts("../comlink.js");
importScripts('../opencv_js.js');
let classifier, classifier_alt2, classifier_alt, classifier_alt_tree, classifier_default;



const getclassifier = (mname) => new Promise((resolve, reject) => {
    const outtime = setTimeout(() => {
        reject();
        console.error(`${mname} load timeout`);
    }, 5000);
    cv.FS_createPreloadedFile(
        '../',
        mname,
        `/detection/haarcascade/${mname}`,
        true,
        false,
        () => {
            const newclassifier = new cv.CascadeClassifier();
            newclassifier.load(mname);
            resolve(newclassifier);
            clearTimeout(outtime);
        },
        (err) => {
            console.error(err);
            reject();
        },
    );
})

// cv().then(res => {
//     self.cv = res;
//     const mname = 'haarcascade_frontalface_alt_tree.xml';
//     cv.FS_createPreloadedFile(
//         '../',
//         mname,
//         `/detection/haarcascade/${mname}`,
//         true,
//         false,
//         () => {
//             classifier = new cv.CascadeClassifier();
//             classifier.load(mname);

//             console.log(`${mname} load success`);
//             // resolve(newclassifier);
//             // clearTimeout(outtime);
//         },
//         (err) => {
//             console.error(err);
//             reject();
//         },
//     );


// });


// const test = async (mname) => {
//     await ss;
//     const newclassifier = new self.cv.CascadeClassifier();
//     // const mname = 'haarcascade_frontalface_alt_tree.xml';
//     self.cv.FS_createPreloadedFile(
//         '../',
//         mname,
//         `/detection/haarcascade/${mname}`,
//         true,
//         false,
//         () => {

//             newclassifier.load(mname);

//             console.log(`${mname} load success`);
//             // resolve(newclassifier);
//             // clearTimeout(outtime);
//         },
//         (err) => {
//             console.error(err);
//             reject();
//         },
//     );
// }

// 解析图像的头部信息以获取宽度
function readImageWidth(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    const offset = 16; // 偏移量，图像宽度信息在字节 16-19 处
    const width = view.getUint32(offset, false);
    console.log('width', width)
    return width;
}

// 解析图像的头部信息以获取高度
function readImageHeight(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    const offset = 20; // 偏移量，图像高度信息在字节 20-23 处
    const height = view.getUint32(offset, false);
    console.log('height', height)
    return height
}

const getSendImgData = (file) => {
    console.log(file)
    return new Promise((resolve, reject) => {
        const outtime = setTimeout(() => {
            reject();
        }, 3000);
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            console.log(new Uint8ClampedArray(arrayBuffer))
            const imageBitmap = new ImageData(new Uint8ClampedArray(arrayBuffer), 100, 100);
            console.log(imageBitmap)
            const mat = cv.matFromArray(readImageHeight(arrayBuffer), readImageWidth(arrayBuffer), cv.CV_8UC4, new Uint8Array(arrayBuffer));
            console.log(mat)
            // const img = new Image();
            // img.onload = () => {
            //     const ctx = new OffscreenCanvas(img.width, img.height).getContext(
            //         '2d',
            //         {
            //             willReadFrequently: true,
            //         },
            //     );
            //     ctx.drawImage(img, 0, 0);
            //     const imageData = ctx.getImageData(0, 0, img.width, img.height);
            //     const mat = cv.matFromImageData(imageData);
            //     resolve(mat);
            //     clearTimeout(outtime);
            // };
            // img.src = e.target.result;
            resolve(mat);
            clearTimeout(outtime);
        };
        reader.readAsArrayBuffer(file);
    });
};

const faces = new cv.RectVector();


Comlink.expose({
    detectMultiScale: async (imageData, mname) => {
        // console.time('executionTime');
        console.log('Start', new Date());
        if (cv instanceof Function) {
            self.cv = await cv();
        }

        switch (mname) {
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


        const mat = new cv.matFromImageData(imageData);
        classifier.detectMultiScale(mat, faces, 1.1, 3, 0);
        mat.delete();
        const resdata = Array(faces.size())
            .fill(0)
            .map((_, index) => {
                const face = faces.get(index);
                return {
                    x: face.x,
                    y: face.y,
                    width: face.width,
                    height: face.height,
                };
            });

        console.log('End', new Date());
        return resdata
    }
    // try {
    // switch (mname) {
    //     case 'haarcascade_frontalface_alt2.xml':
    //         if (!classifier_alt2) {
    //             classifier_alt2 = await getclassifier(data);
    //         }
    //         classifier = classifier_alt2;
    //         break;
    //     case 'haarcascade_frontalface_alt.xml':
    //         if (!classifier_alt) {
    //             classifier_alt = await getclassifier(data);
    //         }
    //         classifier = classifier_alt;
    //         break;
    //     case 'haarcascade_frontalface_alt_tree.xml':
    //         if (!classifier_alt_tree) {
    //             classifier_alt_tree = await getclassifier(data);
    //         }
    //         classifier = classifier_alt_tree;
    //         break;
    //     case 'haarcascade_frontalface_default.xml':
    //         if (!classifier_default) {
    //             classifier_default = await getclassifier(data);
    //         }
    //         classifier = classifier_default;
    //         break;
    //     default:
    //         throw 'error data.mtype';
    // }


    // switch(mtype) {
    //     case 'haarcascade':

    // const resdatas = data.map(
    //     async (m) => {

    //         // const worker = new Worker("worker.js");
    //         // WebWorkers use `postMessage` and therefore work with Comlink.

    //         // const mat = new cv.matFromArray(
    //         //     m.height,
    //         //     m.width,
    //         //     cv.CV_8UC4,
    //         //     new Uint8Array(m.buffer),
    //         // );
    //         // const faces = new cv.RectVector();
    //         // function callback(value) {
    //         //     console.log(value)
    //         //     console.time('executionTime');
    //         //     console.log('Start');
    //         //     classifier.detectMultiScale(mat, faces, 1.1, 3, 0);

    //         //     const resdata = Array(faces.size())
    //         //         .fill(0)
    //         //         .map((_, index) => {
    //         //             const face = faces.get(index);
    //         //             return {
    //         //                 x: face.x,
    //         //                 y: face.y,
    //         //                 width: face.width,
    //         //                 height: face.height,
    //         //             };
    //         //         });
    //         //     faces.delete();
    //         //     mat.delete();
    //         //     console.log('End');
    //         //     console.timeEnd('executionTime');
    //         // }
    //         // const remoteFunction = Comlink.wrap(new Worker("worker.js"));
    //         // await remoteFunction(Comlink.proxy(callback));

    //         // const obj = Comlink.wrap(worker);
    //         // //    console.log(`Counter: ${await obj.counter}`);
    //         // console.log(classifier)
    //         // await obj.inc(faces, mat, faces);
    //         // console.log(`Counter: ${await obj.counter}`);

    //         // console.time('executionTime');
    //         // console.log('Start');

    //         // classifier.detectMultiScale(mat, faces, 1.1, 3, 0);

    //         // const resdata = Array(faces.size())
    //         //     .fill(0)
    //         //     .map((_, index) => {
    //         //         const face = faces.get(index);
    //         //         return {
    //         //             x: face.x,
    //         //             y: face.y,
    //         //             width: face.width,
    //         //             height: face.height,
    //         //         };
    //         //     });
    //         // faces.delete();
    //         // mat.delete();
    //         // console.log('End');
    //         // console.timeEnd('executionTime');
    //         return { name: 'm.name' }

    //     });
    // self.postMessage({ action: 'res', name: data.mname, data: Promise.all(resdatas), success: true });
    // break;

    // default:
    //             break;
    // }

    // }
    // catch (error) {
    //     console.log(error)
    //     self.postMessage({ action: 'res', name: data.mname, success: false });
    // }
    // }
});