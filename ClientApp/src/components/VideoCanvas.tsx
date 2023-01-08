import { useEffect, useRef } from 'react';

export default (props: { img: File; onOk: (resface: NameFaces) => void }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) {
      const faceWorker = new Worker('./faceWorker.js');
      const faceRes = async (res: any) => {
        //识别完成
        if (res.data.action == 'res' && res.data.name == props.img.name) {
          faceWorker.removeEventListener('message', faceRes);
          const data: {
            x: number;
            y: number;
            width: number;
            height: number;
          }[] = res.data.data;

          const filexy = data.map((face, i) => {
            const faceimg = ctx?.getImageData(
              face.x,
              face.y,
              face.width,
              face.height,
            );
            const facecanvas: any = new OffscreenCanvas(
              face.width,
              face.height,
            );
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
          if (ctx) {
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'deepskyblue';
          }

          data.forEach((face) => {
            ctx?.strokeRect(face.x, face.y, face.width, face.height);
          });
        } else if (res.data.action == 'initok') {
          const imgbit = await imgbitasy;
          if (ctx) {
            const buffer = ctx.getImageData(0, 0, imgbit.width, imgbit.height)
              .data.buffer;
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
        }
      };
      faceWorker.addEventListener('message', faceRes);

      const ctx = ref.current.getContext('2d');

      const imgbitasy = createImageBitmap(props.img).then((imgbit) => {
        if (ref.current && ctx) {
          ref.current.width = imgbit.width;
          ref.current.height = imgbit.height;
          ctx.drawImage(imgbit, 0, 0);
        }
        return imgbit;
      });

      return () => {
        faceWorker.terminate();
      };
    }
  }, []);

  return (
    <canvas
      ref={ref}
      id={props.img.name}
      style={{ maxWidth: '100%', maxHeight: '400px' }}
    />
  );
};
