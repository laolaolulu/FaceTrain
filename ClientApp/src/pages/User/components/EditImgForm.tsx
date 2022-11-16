import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { PropsWithChildren } from 'react';
import { classifier } from '@/models/global';

export default (props: {
  user?: API.User;
  setUser: React.Dispatch<React.SetStateAction<API.User | undefined>>;
}) => {
  const { user, setUser } = props;

  return (
    <Modal
      destroyOnClose
      title="修改"
      // width={'100%'}
      // style={{}}
      // maskStyle={{ height: '100%' }}
      open={user ? true : false}
      onCancel={() => setUser(undefined)}
    >
      <Upload
        // multiple={true}
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={
          user?.faces
            ? user.faces.map((m, index) => ({
                url: m,
                name: m,
                uid: index.toString(),
              }))
            : []
        }
        // onPreview={handlePreview}
        onChange={(info) => {
          const { status } = info.file;
          if (status !== 'uploading') {
            //  console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            console.log(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            console.log(`${info.file.name} file upload failed.`);
          }
        }}
        // onDrop={() => {
        //   console.log('xxoo');
        // }}
        beforeUpload={async (file) => {
          const modal = Modal.info({
            title: '确认上传',
            // content: <img width={'100%'} src={img.src} />,
            content: <canvas id="canface" />,
            onOk() {},
          });

          const img = new Image();
          img.src = URL.createObjectURL(file);
          await img.decode();
          const matimg = cv.imread(img);

          let gray = new cv.Mat();
          let faces = new cv.RectVector();
          cv.cvtColor(matimg, gray, cv.COLOR_RGBA2GRAY, 0);
          try {
            classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
            console.log(faces);
          } catch (err) {
            console.log(err);
          }

          for (let i = 0; i < faces.size(); ++i) {
            let face = faces.get(i);
            let point1 = new cv.Point(face.x, face.y);
            let point2 = new cv.Point(
              face.x + face.width,
              face.y + face.height,
            );
            cv.rectangle(matimg, point1, point2, [255, 0, 0, 255]);
          }

          let dsize = new cv.Size(300, (300 * matimg.rows) / matimg.cols);
          let dst = new cv.Mat();
          cv.resize(matimg, dst, dsize, 0, 0, cv.INTER_AREA);

          cv.imshow('canface', dst);
        }}
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
    </Modal>
  );
};
