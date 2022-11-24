import {
  CheckCircleOutlined,
  LoadingOutlined,
  ScanOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Carousel,
  Form,
  message,
  Modal,
  Radio,
  Select,
  Upload,
} from 'antd';
import { classifier } from '@/models/global';
import api from '@/services';
import '../index.less';
import { useRequest } from '@umijs/max';
import { useEffect, useState } from 'react';
import SelectCamera from './SelectCamera';

export default (props: { models: API.UpFaceUrl[] | undefined }) => {
  const { models } = props;
  const [form, setForm] = useState('Video');

  const { loading: predicting, run: Predict } = useRequest(
    api.Face.postFacePredict,
    {
      manual: true,
      onSuccess: (res, par) => {
        const resc: any = par[3];
        res?.forEach(
          (element: {
            label: number;
            confidence: number;
            name: string;
            msg: string;
          }) => {
            const index = element.name.indexOf('_');
            if (index > -1) {
              const name = element.name.substring(index + 1);
              const faceid = Number(element.name.substring(0, index));

              const fmm = resc.facemsg.find((f: any) => f.name == name);
              if (fmm) {
                fmm.ctx.font = '20px "微软雅黑"';
                fmm.ctx.fillStyle = 'red';
                fmm.ctx.textBaseline = 'top';
                fmm.ctx.fillText(
                  `id:${element.label} c:${element.confidence.toFixed(0)}`,
                  fmm.msg[faceid].x,
                  fmm.msg[faceid].y,
                );
                fmm.ctx.fillText(
                  element.msg,
                  fmm.msg[faceid].x,
                  fmm.msg[faceid].y + 20,
                );
              }
            }
          },
        );

        resc.modal.update((prevConfig: any) => ({
          ...prevConfig,
          title: `识别完成`,
          icon: <CheckCircleOutlined />,
        }));
      },
    },
  );

  return (
    <Form
      labelCol={{ span: 6 }}
      style={{ marginTop: 10 }}
      initialValues={{ from: 'Video' }}
      onFinish={async (values) => {
        if (values.from == 'Video') {
          Modal.info({
            title: '识别中...',
            icon: <ScanOutlined />,
            closable: true,
            centered: true,
            content: (
              <div style={{ position: 'relative' }}>
                <video
                  id="video"
                  style={{
                    maxWidth: '100%',
                    height: '100%',
                  }}
                ></video>
                <canvas
                  id="canvas"
                  style={{
                    width: '100%',
                    height: '100%',
                    left: 0,
                    position: 'absolute',
                  }}
                ></canvas>
              </div>
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
              video: {
                deviceId: values.camera,
              },
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
                  const imgcanvas: any = document.getElementById('canvas');
                  imgcanvas.width = video.videoWidth;
                  imgcanvas.height = video.videoHeight;
                  const ctx: CanvasRenderingContext2D =
                    imgcanvas.getContext('2d');
                  const cap = new cv.VideoCapture(video);

                  const inte = setInterval(() => {
                    //清除画的人脸框
                    ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
                    //将视频当前帧读取到src
                    cap.read(src);
                    //监测人脸
                    classifier.detectMultiScale(src, faces, 1.1, 3, 0);
                    //遍历人脸
                    for (let i = 0; i < faces.size(); ++i) {
                      let face = faces.get(i);

                      //定义canvas来接收人脸区域
                      const tnCanvas = document.createElement('canvas');
                      tnCanvas.width = face.width;
                      tnCanvas.height = face.height;
                      //裁剪人脸区域
                      const roi = src.roi(
                        new cv.Rect(face.x, face.y, face.width, face.height),
                      );

                      cv.imshow(tnCanvas, roi);

                      //将裁剪出的图片转换为文件
                      tnCanvas.toBlob((blob) => {
                        if (blob) {
                          const file = new File(
                            [blob],
                            `video.${blob.type.split('/')[1]}`,
                            {
                              type: blob.type,
                            },
                          );

                          //请求后端识别
                          api.Face.postFacePredict(
                            { model: values.model },
                            {},
                            [file],
                          ).then((res) => {
                            if (res.success) {
                              ctx.font = '20px "微软雅黑"';
                              ctx.fillStyle = 'red';
                              ctx.textBaseline = 'top';
                              ctx.fillText(
                                `id:${
                                  res.data[0].label
                                } c:${res.data[0].confidence.toFixed(0)}`,
                                face.x,
                                face.y,
                              );
                              ctx.fillText(
                                res.data[0].msg,
                                face.x,
                                face.y + 20,
                              );
                            }
                          });
                        }
                      });
                      //画出人脸框
                      ctx.strokeRect(face.x, face.y, face.width, face.height);
                    }
                  }, 500);
                  resolve(inte);
                });
              });
              video.play();

              return { stream, inte };
            });
        } else {
          if (!values.imgs) {
            message.warning('请上传照片后再操作');
            return;
          }

          const files: any[] = values.imgs.fileList.filter(
            (f: any) => f.originFileObj,
          );

          //#region 创建界面canvas显示识别结果
          const modal = Modal.info({
            title: '识别中...',
            icon: <LoadingOutlined />,
            closable: true,
            width: 500,
            centered: true,
            content: (
              <Carousel infinite={false} draggable={true}>
                {files.map((m) => (
                  <div key={m.uid}>
                    <canvas
                      id={m.name}
                      style={{
                        maxHeight: 400,
                        maxWidth: '100%',
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            ),
          });
          //#endregion

          const facemsgasync: Promise<{
            ctx: CanvasRenderingContext2D;
            name: string;
            msg: { x: number; y: number; faceFile?: File }[];
          }>[] = files.map(async (m: any) => {
            const img = new Image();
            img.src = URL.createObjectURL(m.originFileObj);
            await img.decode();
            const mat = cv.imread(img);

            cv.imshow(m.name, mat);
            const imgcanvas: any = document.getElementById(m.name);
            const ctx: CanvasRenderingContext2D = imgcanvas.getContext('2d');

            //#region 人脸检测
            const faces = new cv.RectVector();
            try {
              //   const gray = new cv.Mat();
              //   cv.cvtColor(matimg, gray, cv.COLOR_RGBA2GRAY, 0); //灰度化
              classifier.detectMultiScale(mat, faces, 1.1, 3, 0); //人脸检测
              // gray.delete();
            } catch (err) {
              console.log(err);
            }
            //#endregion

            //#region 将人脸裁剪储存到待识别请求集合
            const msgasync = new Array(faces.size())
              .fill(0)
              .map(async (_, i) => {
                const face = faces.get(i);
                //画出人脸框
                ctx.strokeRect(face.x, face.y, face.width, face.height);

                //创建canvas来进行裁剪
                const tnCanvas = document.createElement('canvas');
                tnCanvas.width = face.width;
                tnCanvas.height = face.height;
                //裁剪出人脸传入后端请求识别
                //裁剪人脸区域
                const roi = mat.roi(
                  new cv.Rect(face.x, face.y, face.width, face.height),
                );
                mat.delete();
                cv.imshow(tnCanvas, roi);
                //将裁剪出的图片转换为文件
                const faceFile = await new Promise<File | undefined>(
                  (resolve) => {
                    tnCanvas.toBlob((blob) => {
                      roi.delete();
                      let file: File | undefined = undefined;
                      if (blob) {
                        file = new File([blob], `${i}_${m.name}`, {
                          type: blob.type,
                        });
                      }
                      resolve(file);
                    });
                  },
                );
                const res: { x: number; y: number; faceFile?: File } = {
                  x: face.x,
                  y: face.y,
                  faceFile,
                };
                return res;
              });

            //#endregion
            const msg = await Promise.all(msgasync);
            faces.delete();
            return {
              ctx,
              name: m.name,
              msg,
            };
          });
          const facemsg = await Promise.all(facemsgasync);
          //获取人脸文件
          const facefiles = facemsg
            .flatMap((f) => f.msg)
            .map((m) => m.faceFile)
            .filter(Boolean) as File[];
          //请求后端识别
          Predict({ model: values.model }, {}, facefiles, { modal, facemsg });
        }
      }}
    >
      <Form.Item label="选择模型" name="model">
        <Select placeholder="默认使用最新的模型">
          {models?.map((m) => (
            <Select.Option key={m.uid} value={m.name}>
              {m.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="图片来源" name="from">
        <Radio.Group
          onChange={(e) => {
            setForm(e.target.value);
          }}
        >
          <Radio value="Video">摄像头</Radio>
          <Radio value="Photo">照片</Radio>
        </Radio.Group>
      </Form.Item>
      {form == 'Photo' ? (
        <Form.Item label="选择图片" name="imgs" valuePropName="img">
          <Upload
            listType="picture"
            multiple={true}
            beforeUpload={() => false}
            className="upload-list-inline"
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      ) : (
        <Form.Item label="摄像头" name="camera">
          <SelectCamera />
        </Form.Item>
      )}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button loading={predicting} type="primary" htmlType="submit">
          识别
        </Button>
      </Form.Item>
    </Form>
  );
};
