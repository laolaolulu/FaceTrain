import { useEffect, useMemo, useRef } from 'react';
import { faceWorker } from '@/constants';

export default (props: { img: File; onOk: (resface: any) => void }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext('2d');
      createImageBitmap(props.img).then((imgbit) => {
        if (ref.current && ctx) {
          ref.current.width = imgbit.width;
          ref.current.height = imgbit.height;
          ctx.drawImage(imgbit, 0, 0);
          const buffer = ctx.getImageData(0, 0, imgbit.width, imgbit.height)
            .data.buffer;

          const faceRes = async (res: any) => {
            //识别完成
            if (res.data.action == 'res' && res.data.name == props.img.name) {
              clearTimeout(timeout);
              faceWorker.removeEventListener('message', faceRes);
              const data: {
                x: number;
                y: number;
                width: number;
                height: number;
              }[] = res.data.data;

              const blobs: Promise<File>[] = data.map((face) => {
                const faceimg = ctx.getImageData(
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
                return facecanvas.convertToBlob();
                // const facefile = new File([blob], `${index}_${file?.name}`, {
                //   type: blob.type,
                // });
              });
              const faces = await Promise.all(blobs);
              props.onOk({ name: props.img.name, faces });

              data.forEach((face) => {
                ctx.strokeRect(face.x, face.y, face.width, face.height);
              });
            }
          };
          const timeout = setTimeout(() => {
            faceWorker.removeEventListener('message', faceRes);
          }, 5000);
          faceWorker.addEventListener('message', faceRes);

          faceWorker.postMessage(
            {
              action: 'start',
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
  }, []);

  return <canvas ref={ref} style={{ maxWidth: '100%', maxHeight: '400px' }} />;
};
