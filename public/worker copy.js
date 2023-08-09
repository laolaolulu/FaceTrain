importScripts("comlink.js");
importScripts('opencv_js.js');

let classifier, classifier_alt2, classifier_alt, classifier_alt_tree, classifier_default;


const getclassifier = (mname) => new Promise((resolve, reject) => {
    cv.FS_createPreloadedFile(
        '/',
        mname,
        `/detection/haarcascade/${mname}`,
        true,
        false,
        () => {
            const newclassifier = new cv.CascadeClassifier();
            newclassifier.load(mname);
            resolve(newclassifier);
        },
        (err) => {
            console.error(err);
            reject();
        },
    );
})

cv = cv();


Comlink.expose({
    detectMultiScale: async (imageData, mname) => {
        if (cv instanceof Promise) {
            cv = await cv;
        }


        switch (mname) {
            case 'haarcascade_frontalface_alt2.xml':
                if (!classifier_alt2) {
                    classifier_alt2 = getclassifier(mname);
                }
                classifier = classifier_alt2;
                break;
            case 'haarcascade_frontalface_alt.xml':
                if (!classifier_alt) {
                    classifier_alt = getclassifier(mname);
                }
                classifier = classifier_alt;
                break;
            case 'haarcascade_frontalface_alt_tree.xml':
                if (!classifier_alt_tree) {
                    classifier_alt_tree = getclassifier(mname);
                }
                classifier = classifier_alt_tree;
                break;
            case 'haarcascade_frontalface_default.xml':
                if (!classifier_default) {
                    classifier_default = getclassifier(mname);
                }
                classifier = classifier_default;
                break;
            default:
                throw 'error data.mtype';
        }
        const faces = new cv.RectVector();
        const mat = new cv.matFromImageData(imageData);
        const startTime = performance.now();
        (await classifier).detectMultiScale(mat, faces, 1.1, 3, 0);
        const endTime = performance.now();
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
        mat.delete();
        faces.delete();
        return { time: endTime - startTime, faces: resdata }
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