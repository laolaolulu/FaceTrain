import { ProFormSelect } from '@ant-design/pro-components';
import { Modal } from 'antd';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

//获取摄像头列表函数
const getVideoDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((device) => device.kind === 'videoinput')
    .map((m) => ({ label: m.label, value: m.deviceId, selected: true }));
};

let canvasctx: CanvasRenderingContext2D | null | undefined; //画人脸框以及人脸识别时显示名字
let vodeoctx: OffscreenCanvasRenderingContext2D; //从video获取图片使用
let width: number, height: number;

export default forwardRef(
  (
    props: {
      label: string;
      name: string;
      placeholder: string;
      rules: any;
      onLoad: (devid: string) => void;
    },
    ref: any,
  ) => {
    const { onLoad, ...par } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const currentStreamRef = useRef<MediaStream | null>(null); //释放关闭摄像头的时候需要
    const [devices, setDevices] =
      useState<{ value: string; label: string }[]>();

    const getImg = () => {
      const name = `${new Date().getTime()}_${currentStreamRef.current?.getTracks()[0]
        .label}`;
      vodeoctx.drawImage(videoRef.current!, 0, 0);
      return { name, img: vodeoctx.getImageData(0, 0, width, height) };
    };

    const strokeRect = (faces: any) => {};

    useImperativeHandle(ref, () => ({
      getImg,
      strokeRect,
    }));

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
          if (!deviceId) {
            onLoad(settings.deviceId!);
          }
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
      }
    };
    useEffect(() => {
      //  canvasctx = canvasRef.current?.getContext('2d');

      const devicesAsync = getVideoDevices();

      //首次加载摄像头
      switchCamera().then(async () => {
        //获取所有摄像头列表
        const devices = await devicesAsync;
        if (devices.length > 0) {
          setDevices(devices);
        }
      });

      return () => {
        currentStreamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }, []);

    return (
      <>
        <ProFormSelect
          {...par}
          fieldProps={{
            options: devices,
          }}
        />
        <video
          ref={videoRef}
          onCanPlay={() => {
            console.log('onCanPlay');
            //  sendmsg();
          }}
          autoPlay
          playsInline
          style={{
            maxWidth: '100%',
          }}
        />
      </>
    );
  },
);
