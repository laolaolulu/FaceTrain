import { useEffect, useRef, useState } from 'react';
import { getFaceWorker } from '@/constants';
import { Modal, Select } from 'antd';

let faceWorker: Promise<Worker>;
let canvasctx: CanvasRenderingContext2D | null | undefined; //画人脸框以及人脸识别时显示名字
let vodeoctx: OffscreenCanvasRenderingContext2D; //从video获取图片使用
let timeout: NodeJS.Timeout;
let width: number, height: number;

export default (props: { onOk: (resface?: NameFaces) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentStreamRef = useRef<MediaStream | null>(null); //释放关闭摄像头的时候需要
  const [devices, setDevices] = useState<{ value: string; label: string }[]>();

  //当前使用的摄像头名称
  const cameraName = () => {
    const vs = currentStreamRef.current?.getVideoTracks();
    if (vs?.length === 1) {
      // return vs[0].getSettings().deviceId;
      return vs[0].label;
    }
    return 'cameraNameReturnUndefined';
  };

  //请求faceWorker识别人脸部分
  const sendmsg = async () => {
    if (videoRef.current && vodeoctx) {
      vodeoctx.drawImage(videoRef.current, 0, 0);
      let buffer = vodeoctx.getImageData(0, 0, width, height).data.buffer;
      await faceWorker.then((res) => {
        res.postMessage(
          {
            action: 'detection',
            name: cameraName(),
            buffer,
            width,
            height,
          },
          [buffer],
        );
      });
    }
    timeout = setTimeout(() => {
      sendmsg();
    }, 3000);
  };

  //启动或者切换摄像头
  const switchCamera = async (deviceId?: string) => {
    currentStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    const constraints: MediaStreamConstraints = {
      video: deviceId ? { deviceId: { exact: deviceId } } : true,
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      currentStreamRef.current = stream;
      //配置OffscreenCanvas用来读取处理图片
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        const settings = videoTracks[0].getSettings();
        width = settings.width!;
        height = settings.height!;
        vodeoctx = new OffscreenCanvas(width, height).getContext('2d', {
          willReadFrequently: true,
        })!;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // sendmsg();
    } catch (error: any) {
      Modal.error({
        title: error.message,
      });
      //   Modal.error({
      //     title: intl.formatMessage({ id: 'user.unauthorizedcamera' }),
      //     content: intl.formatMessage({
      //       id: 'user.unauthorizedcameramsg',
      //     }),
      //   });
      props.onOk(undefined);
    }
  };

  //识别到人脸部分回调函数
  const faceRes = async (res: any) => {
    if (res.data.action === 'res' && res.data.name === cameraName()) {
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
        const facecanvas = new OffscreenCanvas(face.width, face.height);
        const facectx = facecanvas.getContext('2d')!;
        facectx.putImageData(faceimg, 0, 0);

        return facecanvas.convertToBlob().then((blob) => ({
          file: new File([blob], `${i}_${cameraName()}`, {
            type: blob.type,
          }),
          x: face.x,
          y: face.y,
          i,
        }));
      });
      const faces = await Promise.all(filexy);

      if (canvasctx) {
        const widthScale = canvasctx.canvas.width / width;
        const heightScale = canvasctx.canvas.height / height;
        canvasctx.clearRect(
          0,
          0,
          canvasctx.canvas.width,
          canvasctx.canvas.height,
        );
        canvasctx.lineWidth = 3;
        canvasctx.strokeStyle = 'deepskyblue';
        data.forEach((face) => {
          canvasctx?.strokeRect(
            face.x * widthScale,
            face.y * heightScale,
            face.width * widthScale,
            face.height * heightScale,
          );
        });
      }
      props.onOk({ name: cameraName(), faces, ctx: canvasctx });
      timeout = setTimeout(() => {
        sendmsg();
      }, 500);
    }
  };

  //获取摄像头列表函数
  const getVideoDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((device) => device.kind === 'videoinput')
      .map((m) => ({ label: m.label, value: m.deviceId, selected: true }));
  };

  useEffect(() => {
    canvasctx = canvasRef.current?.getContext('2d');

    const devicesAsync = getVideoDevices();
    faceWorker = getFaceWorker().then((res) => {
      res.addEventListener('message', faceRes);
      return res;
    });
    //首次加载摄像头
    switchCamera().then(async () => {
      //获取所有摄像头列表
      const devices = await devicesAsync;
      if (devices.length > 0) {
        setDevices(devices);
      }
    });

    return () => {
      clearTimeout(timeout);
      faceWorker.then((res) => {
        res.removeEventListener('message', faceRes);
      });
      currentStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {devices ? (
        <Select
          defaultValue={cameraName()}
          style={{ width: 140, position: 'absolute', top: -37, right: 30 }}
          onChange={(value) => switchCamera(value)}
          options={devices}
        />
      ) : null}

      <video
        //  id="video"
        ref={videoRef}
        onCanPlay={() => {
          console.log('onCanPlay');
          sendmsg();
        }}
        autoPlay
        playsInline
        style={{
          maxWidth: '100%',
          height: '100%',
        }}
      ></video>
      {/* canvas用来画识别到的脸部框 */}
      <canvas
        ref={canvasRef}
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
