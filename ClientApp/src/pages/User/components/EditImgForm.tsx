import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  ScanOutlined,
  UploadOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import { Divider, Modal, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { PropsWithChildren } from 'react';
import { classifier } from '@/models/global';
import { upurls } from '../index';
import styles from '../index.less';

export default (props: {
  user?: API.UpFace;
  setUser: React.Dispatch<React.SetStateAction<API.UpFace | undefined>>;
  onOk: () => void;
}) => {
  const { user, setUser, onOk } = props;
  return (
    <Modal
      maskClosable={false}
      title={`上传或删除人脸照片（${user?.ID}-${user?.name}）`}
      open={user ? true : false}
      onCancel={() => {
        const add = user?.urls.filter((f) => f.url.startsWith('data:image'));
        var del = upurls.filter(
          (item) => user?.urls.map((m) => m.uid).indexOf(item.uid) == -1,
        );
        if ((add && add.length > 0) || (del && del.length > 0)) {
          Modal.confirm({
            title: '未保存，放弃更改吗？',
            onOk: () => {
              setUser(undefined);
            },
          });
        } else {
          setUser(undefined);
        }
      }}
      onOk={onOk}
    >
      <Upload
        // multiple={true}
        listType="picture-card"
        fileList={user?.urls}
        onPreview={(file) => {
          Modal.info({
            title: `${user?.ID}-${file.name}`,
            closable: true,
            maskClosable: true,
            okButtonProps: { style: { display: 'none' } },
            content: <img width={300} src={file.url} />,
          });
        }}
        beforeUpload={async (file) => {
          const addurls: string[] = [];

          const modal = Modal.info({
            title: '检测中...',
            icon: <LoadingOutlined />,
            closable: true,
            width: 500,
            centered: true,
            okText: '确定',
            content: (
              <canvas
                id="canface"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            ),
            onOk: () => {
              if (user && addurls.length > 0) {
                const fileList = [...user.urls];
                const timenum = Date.now();
                for (let i = 0; i < addurls.length; ++i) {
                  fileList.push({
                    name: file.name,
                    uid: (timenum + i).toString(),
                    url: addurls[i],
                  });
                }
                setUser({ ...user, urls: fileList });
              }
            },
          });
          //#region 读取上传的图片转换为mat
          const img = new Image();
          img.src = URL.createObjectURL(file);
          await img.decode();
          const matimg = cv.imread(img);
          //#endregion

          //#region 人脸检测
          const faces = new cv.RectVector();
          try {
            const gray = new cv.Mat();
            cv.cvtColor(matimg, gray, cv.COLOR_RGBA2GRAY, 0); //灰度化
            classifier.detectMultiScale(gray, faces, 1.1, 3, 0); //人脸检测
            gray.delete();
          } catch (err) {
            console.log(err);
          }
          //#endregion

          //#region 界面显示上传结果并画出识别到的人脸并将识别到的脸转换base64
          for (let i = 0; i < faces.size(); ++i) {
            const face = faces.get(i);
            const point1 = new cv.Point(face.x, face.y);
            const point2 = new cv.Point(
              face.x + face.width,
              face.y + face.height,
            );
            cv.rectangle(matimg, point1, point2, [0, 0, 255, 255]);

            const tnCanvas = document.createElement('canvas');
            const tnCanvasContext = tnCanvas.getContext('2d');
            tnCanvas.width = face.width;
            tnCanvas.height = face.height;

            tnCanvasContext?.drawImage(
              img,
              face.x,
              face.y,
              face.width,
              face.height,
              0,
              0,
              face.width,
              face.height,
            );
            addurls.push(tnCanvas.toDataURL());
          }
          cv.imshow('canface', matimg);
          matimg.delete();
          //#endregion

          if (faces.size() > 0) {
            modal.update((prevConfig) => ({
              ...prevConfig,
              title: `检测到（${faces.size()}）张人脸`,
              icon: <CheckCircleOutlined />,
            }));
          } else {
            modal.update((prevConfig) => ({
              ...prevConfig,
              title: `未检测到人脸`,
              icon: <CloseCircleOutlined />,
            }));
          }
          faces.delete();
          return false;
        }}
        onRemove={(file) => {
          if (user) {
            const index = user.urls.findIndex((f) => f.uid == file.uid);
            if (index > -1) {
              const urls = [...user.urls];
              urls.splice(index, 1);
              setUser({ ...user, urls });
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
                title: '识别中...',
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
                    clearInterval(res.inte);
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
                  const inte = await new Promise<NodeJS.Timer>((resolve) => {
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

                      const inte = setInterval(() => {
                        //将视频当前帧读取到src
                        cap.read(src);
                        //监测人脸
                        classifier.detectMultiScale(src, faces, 1.1, 3, 0);

                        //遍历人脸
                        for (let i = 0; i < faces.size(); ++i) {
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

                          setUser((user) => {
                            let fileList: API.UpFaceUrl[] = [];
                            if (user?.urls) {
                              fileList = [...user.urls];
                            }
                            fileList.push({
                              name: `${video}_${i}`,
                              uid: (Date.now() + i).toString(),
                              url: tnCanvas.toDataURL(),
                            });
                            return user
                              ? { ...user, urls: fileList }
                              : undefined;
                          });
                        }
                      }, 1000);
                      resolve(inte);
                    });
                  });
                  video.play();

                  return { stream, inte };
                });
            }}
          />
        </div>
      </Upload>
    </Modal>
  );
};
