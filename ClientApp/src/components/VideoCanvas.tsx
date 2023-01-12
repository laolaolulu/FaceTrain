import { useEffect, useRef } from 'react';
import { faceWorker } from '@/constants';
export default (props: {
  camera: string;
  onOk: (resface: NameFaces) => void;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const refvideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (refvideo.current) {
      const stream = navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: props.camera,
          },
        })
        .then((stream) => {
          if (refvideo.current) {
            refvideo.current.srcObject = stream;
            refvideo.current.play();
          }

          return stream;
        })
        .catch((error) => {
          console.log(error);
        });

      refvideo.current.addEventListener('canplay', () => {
        if (refvideo.current) {
          height = refvideo.current.videoHeight;
          width = refvideo.current.videoWidth;
          refvideo.current.height = height;
          refvideo.current.width = width;
          if (ref.current) {
            ref.current.width = width;
            ref.current.height = height;
          }

          vodeoctx = new OffscreenCanvas(width, height).getContext('2d', {
            willReadFrequently: true,
          });
          sendmsg();
        }
      });

      let vodeoctx: any;
      let timeout: any;
      let width: number, height: number;
      const sendmsg = () => {
        timeout = setTimeout(() => {
          sendmsg();
        }, 3000);
        if (refvideo.current && vodeoctx) {
          vodeoctx.drawImage(refvideo.current, 0, 0);
          let buffer = vodeoctx.getImageData(0, 0, width, height).data.buffer;
          faceWorker.postMessage(
            {
              action: 'detection',
              name: props.camera,
              buffer,
              width,
              height,
            },
            [buffer],
          );
        }
      };

      const ctx = ref.current?.getContext('2d');
      const faceRes = async (res: any) => {
        //识别完成
        if (res.data.action == 'res' && res.data.name == props.camera) {
          clearTimeout(timeout);
          const data: {
            x: number;
            y: number;
            width: number;
            height: number;
          }[] = res.data.data;

          const filexy = data.map((face, i) => {
            const faceimg = vodeoctx.getImageData(
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
              file: new File([blob], `${i}_${props.camera}`, {
                type: blob.type,
              }),
              x: face.x,
              y: face.y,
              i,
            }));
          });
          const faces = await Promise.all(filexy);
          props.onOk({ name: props.camera, faces, ctx });
          if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'deepskyblue';
            data.forEach((face) => {
              ctx.strokeRect(face.x, face.y, face.width, face.height);
            });
          }
          setTimeout(() => {
            sendmsg();
          }, 200);
        }
      };

      faceWorker.addEventListener('message', faceRes);

      return () => {
        stream.then((res) => {
          res?.getVideoTracks().forEach((element) => {
            element.stop();
          });
          faceWorker.removeEventListener('message', faceRes);
        });
      };
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <video
        id="video"
        ref={refvideo}
        style={{
          maxWidth: '100%',
          height: '100%',
        }}
      ></video>
      <canvas
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          left: 0,
          position: 'absolute',
        }}
      ></canvas>
    </div>
  );
};
