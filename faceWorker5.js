console.log('init faceWorker');
let classifier;
self.importScripts('./opencv.js');

const init = async () => {
    return await new Promise(resolve => {
        cv['onRuntimeInitialized'] = () => {
            const name = 'haarcascade_frontalface_alt2.xml';
            classifier = new cv.CascadeClassifier();
            cv.FS_createPreloadedFile(
                '/',
                name,
                name,
                true,
                false,
                () => {
                    classifier.load(name);
                    console.log('classifier load success');
                    resolve();
                },
                (err) => {
                    console.error(err);
                    resolve();
                },
            );
        };
    });

}
self.onmessage = async ({ data }) => {
    switch (data.action) {
        case 'detection':
            console.log('start ' + data.name + ' ' + new Date());

            // eslint-disable-next-line no-case-declarations
            const mat = new cv.matFromArray(
                data.height,
                data.width,
                cv.CV_8UC4,
                new Uint8Array(data.buffer),
            );

            // eslint-disable-next-line no-case-declarations
            const faces = new cv.RectVector();
            classifier.detectMultiScale(mat, faces, 1.1, 3, 0);
            // eslint-disable-next-line no-case-declarations
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
            faces.delete();
            mat.delete();
            console.log('end ' + data.name + ' ' + new Date());
            self.postMessage({ action: 'res', name: data.name, data: resdata });

            break;
        case 'init':
            await init();
            self.postMessage({ action: 'init' });
            break;
        default:
            break;
    }
};

