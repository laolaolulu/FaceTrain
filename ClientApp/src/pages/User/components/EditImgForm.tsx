import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  LoadingOutlined,
  PlusOutlined,
  ScanOutlined,
  UploadOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import { Divider, Modal, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { PropsWithChildren, useEffect } from 'react';
import { faceWorker } from '@/constants';
import { upurls } from '../index';
import styles from '../index.less';
import { useIntl, getIntl } from 'umi';
import { sleep } from '@/utils';

let readVideo = false;

export default (props: {
  upImg?: UpImg;
  setUpImg: React.Dispatch<React.SetStateAction<UpImg | undefined>>;
  onOk: () => void;
}) => {
  const intl = useIntl();
  const { upImg, setUpImg, onOk } = props;
  useEffect(() => {}, []);
  return (
    <Modal
      maskClosable={false}
      open={upImg ? true : false}
      onOk={onOk}
      title={intl.formatMessage(
        { id: 'user.faceTitle' },
        { msg: `${upImg?.ID}-${upImg?.name}` },
      )}
      onCancel={() => {
        const add = upImg?.urls.filter((f) => f.uid.startsWith('rc-upload'));
        var del = upurls.filter(
          (item) => upImg?.urls.map((m) => m.uid).indexOf(item.uid) == -1,
        );
        if ((add && add.length > 0) || (del && del.length > 0)) {
          Modal.confirm({
            title: intl.formatMessage({ id: 'user.facePrompt' }),
            onOk: () => {
              setUpImg(undefined);
            },
          });
        } else {
          setUpImg(undefined);
        }
      }}
    >
      <Upload
        // multiple={true}
        listType="picture-card"
        fileList={upImg?.urls}
        onPreview={async (file) => {
          if (!file.url) {
            file.url = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file.originFileObj as File);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (error) => reject(error);
            });
          }

          Modal.info({
            title: `${upImg?.ID}-${file.name}`,
            closable: true,
            maskClosable: true,
            okButtonProps: { style: { display: 'none' } },
            content: <img width={300} src={file.url} />,
          });
        }}
        // onChange={({ fileList: newFileList }) => {
        //   console.log(newFileList);
        //   //  setUpImg(upImg ? { ...upImg, urls: newFileList } : undefined);
        // }}
        beforeUpload={async (file) => {
          const modal = Modal.info({
            title: intl.formatMessage({ id: 'user.Testing' }),
            icon: <LoadingOutlined />,
            closable: true,
            width: 500,
            centered: true,
            okButtonProps: { loading: true },
            content: (
              <canvas
                id="canface"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            ),
            onOk: async () => {
              console.log(facefiles);
              //   const facemsg = await Promise.all(facemsgasync);
              //   //获取人脸文件
              //   const facefiles = facemsg
              //     .flatMap((f) => f.msg)
              //     .map((m) => m.faceFile)
              //     .filter(Boolean) as File[];
              if (upImg && facefiles.length > 0) {
                const fileList = [...upImg.urls];
                facefiles.forEach((facef) => {
                  //  const es: UploadFile = undefined;

                  fileList.push({
                    uid: `rc-upload-${Date.now().toString()}`,
                    name: facef.name,
                    originFileObj: facef as RcFile,
                  });
                });
                setUpImg({ ...upImg, urls: fileList });
                console.log(fileList);
              }
            },
          });

          const img = new Image();
          img.onload = async () => {
            const matimg = cv.imread(img);
            cv.imshow('canface', matimg);
            matimg.delete();
          };
          img.src = URL.createObjectURL(file);

          //   const bitimg = createImageBitmap(file);
          //   createImageBitmap(file).then((res) => {
          //     // const imgcanvas: any = document.getElementById('canface');
          //     // // console.log(imgcanvas);
          //     // const ctx: CanvasRenderingContext2D = imgcanvas.getContext('2d');
          //     // imgcanvas.width = res.width;
          //     // imgcanvas.height = res.height;
          //     // var test = new OffscreenCanvas(res.width, res.height);

          //     var tes: any = new OffscreenCanvas(res.width, res.height);
          //     var s: any = tes.getContext('2d');

          //     s.drawImage(res, 0, 0);

          //     const se = s.getImageData(0, 0, res.width, res.height);
          //     var mat = cv.matFromImageData(se);
          //     cv.imshow('canface', mat);
          //     // ctx.drawImage(
          //     //   s.getImageData(0, 0, res.width, res.height),
          //     //   0,
          //     //   0,
          //     //   res.width,
          //     //   res.height,
          //     // );

          //     // tes.convertToBlob().then(async (blob: any) => {
          //     //   console.log(await blob.arrayBuffer());

          //     // });

          //     // console.log(imgcanvas);
          //     // console.log(s);
          //     // console.log(ctx);
          //     // console.log(s.getImageData(0, 0, res.width, res.height));
          //     // // ctx?.drawImage(res, 0, 0, res.width, res.height);
          //     // // console.log(ctx.getImageData(0, 0, res.width, res.height));
          //     // const matimg = cv.imread(
          //     //   s.getImageData(0, 0, res.width, res.height),
          //     // );
          //     // cv.imshow('canface', matimg);
          //   });

          const faceRes = async (res: any) => {
            //识别完成
            if (res.data.action == 'res') {
              clearTimeout(timeout);
              faceWorker.removeEventListener('message', faceRes);
              const data: {
                x: number;
                y: number;
                width: number;
                height: number;
              }[] = res.data.data;

              const imgcanvas: any = document.getElementById('canface');
              const ctx: CanvasRenderingContext2D = imgcanvas.getContext('2d');

              for (let index = 0; index < data.length; index++) {
                const face = data[index];
                const faceimg = ctx.getImageData(
                  face.x,
                  face.y,
                  face.width,
                  face.height,
                );

                const facecanvas = document.createElement('canvas');
                facecanvas.width = face.width;
                facecanvas.height = face.height;
                const facectx = facecanvas.getContext('2d');
                facectx?.createImageData(faceimg);
                await new Promise((resolve) => {
                  facecanvas.toBlob((blob) => {
                    if (blob) {
                      const facefile = new File(
                        [blob],
                        `${index}_${file?.name}`,
                        {
                          type: blob.type,
                        },
                      );
                      facefiles.push(facefile);
                    }
                    resolve(undefined);
                  });
                });
              }
              data.forEach((face) => {
                ctx.strokeRect(face.x, face.y, face.width, face.height);
              });

              if (facefiles.length > 0) {
                modal.update((prevConfig) => ({
                  ...prevConfig,
                  title: getIntl().formatMessage(
                    { id: 'user.testResult' },
                    { count: facefiles.length },
                  ),
                  icon: <CheckCircleOutlined />,
                  okButtonProps: { loading: false },
                }));
              } else {
                modal.update((prevConfig) => ({
                  ...prevConfig,
                  title: getIntl().formatMessage({ id: 'user.notTest' }),
                  icon: <CloseCircleOutlined />,
                  okButtonProps: { loading: false },
                }));
              }
            }
          };
          const timeout = setTimeout(() => {
            faceWorker.removeEventListener('message', faceRes);
            //识别超时
            modal.update((prevConfig) => ({
              ...prevConfig,
              title: getIntl().formatMessage({ id: 'user.facetimeout' }),
              icon: <FieldTimeOutlined />,
              okButtonProps: { loading: false },
            }));
          }, 10000);
          faceWorker.addEventListener('message', faceRes);
          faceWorker.postMessage({ action: 'start', file });
          //   };
          //   img.src = URL.createObjectURL(file);

          //   const bitimg = await self.createImageBitmap(file);
          //   const mat = new cv.Mat(bitimg.height, bitimg.width, cv.CV_8UC4);

          //   const reader = new FileReader();
          //   reader.onload = (res) => {
          //     console.log(reader.result);
          //     console.log(new Uint8Array(reader.result as ArrayBuffer));
          //     mat.data.set(new Uint8ClampedArray(reader.result as ArrayBuffer));
          //     cv.imshow('canface', mat);
          //     const faceCascadeFile = 'haarcascade_frontalface_alt2.xml';
          //     const url = './' + faceCascadeFile;
          //     const classifier = new cv.CascadeClassifier();
          //     const request = new XMLHttpRequest();
          //     request.open('GET', url, true);
          //     request.responseType = 'arraybuffer';
          //     request.onload = function () {
          //       if (request.readyState === 4) {
          //         if (request.status === 200) {
          //           const data = new Uint8Array(request.response);
          //           cv.FS_createDataFile('/', url, data, true, false, false);
          //           classifier.load(faceCascadeFile);
          //           const faces = new cv.RectVector();
          //           classifier.detectMultiScale(mat, faces, 1.1, 3, 0);

          //           console.log(faces.size());
          //         } else {
          //           console.error(
          //             'Failed to load ' + url + ' status: ' + request.status,
          //           );
          //         }
          //       }
          //     };
          //     request.send();
          //   };
          //   reader.readAsArrayBuffer(file);

          //   myWorker.postMessage(uInt8Array.buffer, [uInt8Array]);

          //   const img = new Image();
          //   img.src = URL.createObjectURL(file);
          //   img.onload = async () => {
          //     const matimg = cv.imread(img);
          //     const faceCascadeFile = 'haarcascade_frontalface_alt2.xml';
          //     const url = './' + faceCascadeFile;
          //     const classifier = new cv.CascadeClassifier();
          //     const request = new XMLHttpRequest();
          //     request.open('GET', url, true);
          //     request.responseType = 'arraybuffer';
          //     request.onload = function () {
          //       if (request.readyState === 4) {
          //         if (request.status === 200) {
          //           const data = new Uint8Array(request.response);
          //           cv.FS_createDataFile('/', url, data, true, false, false);
          //           classifier.load(faceCascadeFile);
          //           const faces = new cv.RectVector();
          //           classifier.detectMultiScale(matimg, faces, 1.1, 3, 0);

          //           console.log(faces.size());
          //         } else {
          //           console.error(
          //             'Failed to load ' + url + ' status: ' + request.status,
          //           );
          //         }
          //       }
          //     };
          //     request.send();
          //   };
          const fis = file as File;

          const facefiles: File[] = [];

          //#region 读取上传的图片转换为mat
          new Promise(() => {});
          //   setTimeout(() => {
          //     const img = new Image();
          //     img.src = URL.createObjectURL(file);
          //     img.onload = async () => {
          //       const matimg = cv.imread(img);
          //       const imgcanvas: any = document.getElementById('canface');
          //       const ctx: CanvasRenderingContext2D = imgcanvas.getContext('2d');
          //       cv.imshow('canface', matimg);
          //       //#region 人脸检测
          //       const faces = new cv.RectVector();
          //       classifier.detectMultiScale(matimg, faces, 1.1, 3, 0); //人脸检测
          //       //#endregion

          //       for (let i = 0; i < faces.size(); i++) {
          //         const face = faces.get(i);
          //         //画出人脸框
          //         ctx.strokeRect(face.x, face.y, face.width, face.height);

          //         //创建canvas来进行裁剪
          //         const tnCanvas = document.createElement('canvas');
          //         tnCanvas.width = face.width;
          //         tnCanvas.height = face.height;
          //         //裁剪人脸区域
          //         const roi = matimg.roi(
          //           new cv.Rect(face.x, face.y, face.width, face.height),
          //         );
          //         matimg.delete();
          //         cv.imshow(tnCanvas, roi);
          //         roi.delete();
          //         const faceFile = await new Promise<File | undefined>(
          //           (resolve) => {
          //             tnCanvas.toBlob((blob) => {
          //               let fileface: File | undefined = undefined;
          //               if (blob) {
          //                 fileface = new File([blob], `${i}_${file?.name}`, {
          //                   type: blob.type,
          //                 });
          //               }
          //               resolve(fileface);
          //             });
          //           },
          //         );
          //         if (faceFile) {
          //           facefiles.push(faceFile);
          //         }
          //       }
          //       faces.delete();
          //       // const msgasync = new Array(faces.size())
          //       //   .fill(0)
          //       //   .map(async (_, i) => {

          //       //     //将裁剪出的图片转换为文件
          //       //     const faceFile = await new Promise<File | undefined>(
          //       //       (resolve) => {
          //       //         tnCanvas.toBlob((blob) => {
          //       //           roi.delete();
          //       //           let fileface: File | undefined = undefined;
          //       //           if (blob) {
          //       //             fileface = new File([blob], `${i}_${file?.name}`, {
          //       //               type: blob.type,
          //       //             });
          //       //           }
          //       //           resolve(fileface);
          //       //         });
          //       //       },
          //       //     );
          //       //     const res: { x: number; y: number; faceFile?: File } = {
          //       //       x: face.x,
          //       //       y: face.y,
          //       //       faceFile,
          //       //     };
          //       //     return res;
          //       //   });
          //       if (facefiles.length > 0) {
          //         modal.update((prevConfig) => ({
          //           ...prevConfig,
          //           title: intl.formatMessage(
          //             { id: 'user.testResult' },
          //             { count: facefiles.length },
          //           ),
          //           icon: <CheckCircleOutlined />,
          //         }));
          //       } else {
          //         modal.update((prevConfig) => ({
          //           ...prevConfig,
          //           title: intl.formatMessage({ id: 'user.notTest' }),
          //           icon: <CloseCircleOutlined />,
          //         }));
          //       }
          //     };
          //   }, 1000);

          //#endregion

          //#region 界面显示上传结果并画出识别到的人脸并将识别到的脸转换base64
          //   for (let i = 0; i < faces.size(); ++i) {
          //     const face = faces.get(i);
          //     const point1 = new cv.Point(face.x, face.y);
          //     const point2 = new cv.Point(
          //       face.x + face.width,
          //       face.y + face.height,
          //     );
          //     cv.rectangle(matimg, point1, point2, [0, 0, 255, 255]);

          //     const tnCanvas = document.createElement('canvas');
          //     const tnCanvasContext = tnCanvas.getContext('2d');
          //     tnCanvas.width = face.width;
          //     tnCanvas.height = face.height;

          //     tnCanvasContext?.drawImage(
          //       img,
          //       face.x,
          //       face.y,
          //       face.width,
          //       face.height,
          //       0,
          //       0,
          //       face.width,
          //       face.height,
          //     );
          //     addurls.push(tnCanvas.toDataURL());
          //   }
          //   cv.imshow('canface', matimg);
          //   matimg.delete();
          //#endregion

          return false;
        }}
        onRemove={(file) => {
          if (upImg) {
            const index = upImg.urls.findIndex((f) => f.uid == file.uid);
            if (index > -1) {
              const urls = [...upImg.urls];
              urls.splice(index, 1);
              setUpImg({ ...upImg, urls });
            }
          }
        }}
      >
        <div className={styles.upimgvideo}>
          <UploadOutlined />
          <Divider type="vertical" style={{ margin: 0 }} />
          <VideoCameraAddOutlined
            onClick={(e) => {
              e.stopPropagation();
              const modal = Modal.info({
                title: intl.formatMessage({ id: 'user.Testing' }),
                icon: <ScanOutlined />,
                closable: true,
                centered: true,
                content: (
                  <video
                    id="video"
                    style={{
                      maxWidth: '100%',
                      height: '100%',
                    }}
                  ></video>
                ),
                afterClose: () => {
                  stream.then((res) => {
                    readVideo = false;
                    res.stream.getVideoTracks().forEach((element) => {
                      element.stop();
                    });
                  });
                },
              });

              const stream = navigator.mediaDevices
                .getUserMedia({
                  video: true,
                  audio: false,
                })
                .then(async (stream) => {
                  const video: any = document.getElementById('video');
                  video.srcObject = stream;
                  video.addEventListener('canplay', () => {
                    video.height = video.videoHeight;
                    video.width = video.videoWidth;
                    const faces = new cv.RectVector();
                    const src = new cv.Mat(
                      video.videoHeight,
                      video.videoWidth,
                      cv.CV_8UC4,
                    );

                    const cap = new cv.VideoCapture(video);

                    new Promise(async () => {
                      readVideo = true;
                      while (readVideo) {
                        await sleep(100);
                        //将视频当前帧读取到src
                        cap.read(src);
                        //监测人脸
                        classifier.detectMultiScale(src, faces, 1.1, 3, 0);

                        //遍历人脸
                        for (let i = 0; i < faces.size(); ++i) {
                          readVideo = false;
                          modal?.destroy();
                          let face = faces.get(i);

                          //定义canvas来接收人脸区域
                          const tnCanvas = document.createElement('canvas');
                          tnCanvas.width = face.width;
                          tnCanvas.height = face.height;
                          //裁剪人脸区域
                          const roi = src.roi(
                            new cv.Rect(
                              face.x,
                              face.y,
                              face.width,
                              face.height,
                            ),
                          );

                          cv.imshow(tnCanvas, roi);

                          //   setUser((user) => {
                          //     let fileList: API.UpFaceUrl[] = [];
                          //     if (user?.urls) {
                          //       fileList = [...user.urls];
                          //     }
                          //     fileList.push({
                          //       name: `${video}_${i}`,
                          //       uid: (Date.now() + i).toString(),
                          //       url: tnCanvas.toDataURL(),
                          //     });
                          //     return user
                          //       ? { ...user, urls: fileList }
                          //       : undefined;
                          //   });
                        }
                      }
                    });
                  });

                  video.play();
                  return { stream };
                });
            }}
          />
        </div>
      </Upload>
    </Modal>
  );
};
