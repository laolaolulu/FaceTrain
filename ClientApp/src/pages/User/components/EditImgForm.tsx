import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { PropsWithChildren } from 'react';
import { classifier } from '@/models/global';

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
        Modal.confirm({
          title: '未保存，放弃更改吗？',
          onOk: () => {
            setUser(undefined);
          },
        });
      }}
      onOk={onOk}
    >
      <Upload
        // multiple={true}
        listType="picture-card"
        fileList={user?.urls}
        // onPreview={handlePreview}
        beforeUpload={async (file) => {
          const addurls: string[] = [];

          const modal = Modal.info({
            title: '检测中...',
            icon: <LoadingOutlined />,
            closable: true,
            width: 500,
            content: <canvas id="canface" style={{ width: '100%' }} />,
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
        }}
        onChange={({ fileList }) =>
          setUser(
            user
              ? {
                  ...user,
                  urls: fileList.map((m) => ({
                    name: m.name,
                    uid: m.uid,
                    url: m.url || '',
                  })),
                }
              : undefined,
          )
        }
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
    </Modal>
  );
};
