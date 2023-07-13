import { useEffect, useRef } from 'react';
import { getFaceWorker } from '@/constants';
let faceWorker: any;

export default (props: { img: File; onOk: (resface: NameFaces) => void }) => {
  let ctx: any;
  const ref = useRef<HTMLCanvasElement>(null);
  /**人脸检测到回调函数 */
  const faceRes = async (res: any) => {
    if (ref.current) {
      //识别完成
      if (
        res.data.action === 'res' &&
        res.data.name === props.img.name &&
        ctx
      ) {
        faceWorker.removeEventListener('message', faceRes);
        const data: {
          x: number;
          y: number;
          width: number;
          height: number;
        }[] = res.data.data;

        const filexy = data.map((face, i) => {
          const faceimg = ctx.getImageData(
            face.x,
            face.y,
            face.width,
            face.height,
          );
          const facecanvas: any = new OffscreenCanvas(face.width, face.height);
          const facectx = facecanvas.getContext('2d');
          facectx.putImageData(faceimg, 0, 0);
          return facecanvas.convertToBlob().then((blob: any) => ({
            file: new File([blob], `${i}_${props.img.name}`, {
              type: blob.type,
            }),
            x: face.x,
            y: face.y,
            i,
          }));
        });
        const faces = await Promise.all(filexy);
        props.onOk({ name: props.img.name, faces });

        ctx.lineWidth = 5;
        ctx.strokeStyle = 'deepskyblue';

        data.forEach((face) => {
          ctx.strokeRect(face.x, face.y, face.width, face.height);
        });
      }
    }
  };

  useEffect(() => {
    console.log('imgcanvas.load');

    getFaceWorker().then((res) => {
      faceWorker = res;
      if (ref.current) {
        ctx = ref.current.getContext('2d', {
          willReadFrequently: true,
        });
        createImageBitmap(props.img).then((imgbit) => {
          if (ref.current && ctx) {
            ref.current.width = imgbit.width;
            ref.current.height = imgbit.height;
            ctx.drawImage(imgbit, 0, 0);

            const buffer = ctx.getImageData(0, 0, imgbit.width, imgbit.height)
              .data.buffer;
            faceWorker.addEventListener('message', faceRes);
            faceWorker.postMessage(
              {
                action: 'detection',
                name: props.img.name,
                buffer,
                width: imgbit.width,
                height: imgbit.height,
              },
              [buffer],
            );
          }
        });
      }
    });
    return () => {
      faceWorker?.removeEventListener('message', faceRes);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      id={props.img.name}
      style={{ maxWidth: '100%', maxHeight: '400px' }}
    />
  );
};
