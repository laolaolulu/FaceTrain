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
import { Carousel, Divider, Modal, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { faceWorker } from '@/constants';
import { upurls } from '../index';
import styles from '../index.less';
import { useIntl, getIntl } from 'umi';
import { sleep } from '@/utils';
import ImgCanvas from '@/components/ImgCanvas';

export default (props: {
  upImg?: UpImg;
  setUpImg: React.Dispatch<React.SetStateAction<UpImg | undefined>>;
  onOk: () => void;
}) => {
  const intl = useIntl();
  const { upImg, setUpImg, onOk } = props;

  const [upfile, setUpfile] = useState<RcFile[]>();
  useEffect(() => {}, [upfile]);
  const ImgOk = () => {};

  return (
    <>
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
          multiple={true}
          maxCount={10}
          listType="picture-card"
          accept="image/*"
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
          beforeUpload={async (_, files) => {
            setUpfile(files);
            //   const resfaces: NameFaces[] = [];
            //   const OnOk = (res: any) => {
            //     resfaces.push(res);
            //     modal.update((prevConfig) => ({
            //       ...prevConfig,
            //       title: getIntl().formatMessage(
            //         { id: 'user.testResult' },
            //         { count: resfaces.flatMap((f) => f.faces).length },
            //       ),
            //     }));
            //     if (resfaces.length == 1) {
            //       modal.update((prevConfig) => ({
            //         ...prevConfig,
            //         icon: <CheckCircleOutlined />,
            //       }));
            //     }
            //   };

            //   const modal = Modal.info({
            //     title: intl.formatMessage({ id: 'user.Testing' }),
            //     icon: <LoadingOutlined />,
            //     closable: true,
            //     width: 500,
            //     centered: true,
            //     content: (
            //       <Carousel
            //         style={{ display: 'grid' }}
            //         infinite={false}
            //         draggable={true}
            //       >
            //         {values.imgs.map((m) => (
            //           <div key={m.uid}>
            //             {m.originFileObj ? (
            //               <ImgCanvas img={m.originFileObj} onOk={OnOk} />
            //             ) : (
            //               <></>
            //             )}
            //           </div>
            //         ))}
            //       </Carousel>
            //     ),
            //     //<ImgCanvas img={file} onOk={OnOk} />
            //     onOk: async () => {
            //       if (upImg && resfaces.length == 1) {
            //         const fileList = [...upImg.urls];
            //         resfaces.forEach((item) => {
            //           item.faces.forEach((facef, index) => {
            //             fileList.push({
            //               uid: `rc-upload-${Date.now().toString()}-${index}`,
            //               name: item.name,
            //               originFileObj: facef as RcFile,
            //             });
            //           });
            //         });
            //         setUpImg({ ...upImg, urls: fileList });
            //       }
            //     },
            //   });

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

                let readVideo = false;
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
                    readVideo = false;
                  },
                });

                navigator.mediaDevices
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

                      const faceRes = async (res: any) => {
                        //????????????
                        if (
                          res.data.action == 'res' &&
                          res.data.name == 'video-lp-img'
                        ) {
                          readVideo = false;
                          faceWorker.removeEventListener('message', faceRes);

                          const data: {
                            x: number;
                            y: number;
                            width: number;
                            height: number;
                          }[] = res.data.data;

                          modal.update((prevConfig) => ({
                            ...prevConfig,
                            title: getIntl().formatMessage(
                              { id: 'user.testResult' },
                              { count: data.length },
                            ),
                            icon: <CheckCircleOutlined />,
                          }));

                          setTimeout(() => {
                            modal.destroy();
                          }, 600);

                          const imageData = new ImageData(
                            new Uint8ClampedArray(res.data.buffer),
                            video.width,
                            video.height,
                          );
                          ctx.putImageData(imageData, 0, 0);

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
                          });
                          const faces = await Promise.all(blobs);
                          if (upImg) {
                            const fileList = [...upImg.urls];
                            faces.forEach((facef, index) => {
                              fileList.push({
                                uid: `rc-upload-${Date.now().toString()}-${index}`,
                                name: 'item.name',
                                originFileObj: facef as RcFile,
                              });
                            });
                            setUpImg({ ...upImg, urls: fileList });
                          }
                        }
                      };
                      faceWorker.addEventListener('message', faceRes);

                      const imgcanvas: any = new OffscreenCanvas(
                        video.width,
                        video.height,
                      );
                      const ctx = imgcanvas.getContext('2d');

                      new Promise(async () => {
                        readVideo = true;
                        while (readVideo) {
                          await sleep(200);
                          //???????????????????????????src
                          ctx.drawImage(video, 0, 0, video.width, video.height);
                          let buffer = ctx.getImageData(
                            0,
                            0,
                            video.width,
                            video.height,
                          ).data.buffer;
                          faceWorker.postMessage(
                            {
                              action: 'start',
                              name: 'video-lp-img',
                              buffer,
                              width: video.width,
                              height: video.height,
                            },
                            [buffer],
                          );
                        }
                        stream.getVideoTracks().forEach((element) => {
                          element.stop();
                        });
                      });
                    });

                    video.play();
                  });
              }}
            />
          </div>
        </Upload>
      </Modal>
      <Modal
        closable={true}
        centered={true}
        open={upfile ? true : false}
        title={
          <>
            <ScanOutlined />
            {intl.formatMessage({ id: 'user.Testing' })}
          </>
        }
        onCancel={() => {
          setUpfile(undefined);
        }}
      >
        <Carousel style={{ display: 'grid' }} infinite={false} draggable={true}>
          {upfile?.map((m) => (
            <div key={m.uid}>
              <ImgCanvas img={m} onOk={ImgOk} />
            </div>
          ))}
        </Carousel>
      </Modal>
    </>
  );
};
