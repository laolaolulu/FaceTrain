import {
  CheckCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
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
  UploadFile,
} from 'antd';
import { faceWorker } from '@/constants';
import api from '@/services/api';
import '../index.less';
import { useEffect, useState } from 'react';
import SelectCamera from './SelectCamera';
import { useIntl, getIntl } from 'umi';
import { sleep } from '@/utils';
import { useRequest } from '@umijs/max';
import ImgCanvas from '@/components/ImgCanvas';
import { RcFile } from 'antd/es/upload';

let readVideo = false;

export default (props: { models: API.UpFaceUrl[] | undefined }) => {
  const { models } = props;
  const [form, setForm] = useState('Video');
  const intl = useIntl();

  return (
    <Form<{ from: string; model: string; imgs: UploadFile[]; camera: string }>
      labelCol={{ span: 6 }}
      style={{ marginTop: 10 }}
      initialValues={{ from: 'Video' }}
      onFinish={async (values) => {
        if (values.from == 'Video') {
          Modal.info({
            title: intl.formatMessage({ id: 'user.Testing' }),
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
                readVideo = false;
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

                new Promise(async () => {
                  readVideo = true;
                  while (readVideo) {
                    await sleep(100);
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
                          api.Face.putFacePredict({ model: values.model }, {}, [
                            file,
                          ]).then((res) => {
                            ctx.font = '20px "微软雅黑"';
                            ctx.fillStyle = 'red';
                            ctx.textBaseline = 'top';
                            ctx.fillText(
                              `id:${res[0].label} c:${res[0].confidence.toFixed(
                                0,
                              )}`,
                              face.x,
                              face.y,
                            );
                            ctx.fillText(res[0].msg, face.x, face.y + 20);
                          });
                        }
                      });
                      //画出人脸框
                      ctx.strokeRect(face.x, face.y, face.width, face.height);
                    }
                  }
                });
              });

              video.play();

              return { stream };
            });
        } else {
          if (!values.imgs) {
            message.warning(intl.formatMessage({ id: 'model.notUpMsg' }));
            return;
          }

          const resfaces: NameFaces[] = [];

          const OnOk = (res: NameFaces) => {
            resfaces.push(res);
            modal.update((prevConfig) => ({
              ...prevConfig,
              title: getIntl().formatMessage(
                { id: 'user.testResult' },
                {
                  faces: resfaces.flatMap((f) => f.faces).length,
                  imgs: resfaces.length,
                  imgcount: values.imgs.length,
                },
              ),
            }));
            if (resfaces.length == values.imgs.length) {
              //请求后端识别
              api.Face.putFacePredict(
                { model: values.model },
                {},
                resfaces.flatMap((f) => f.faces.flatMap((f) => f.file)),
              ).then((res) => {
                modal.update((prevConfig) => ({
                  ...prevConfig,
                  icon: <CheckCircleOutlined />,
                }));
                resfaces.forEach((element) => {
                  const canvas: any = document.getElementById(element.name);
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.font = '60px "微软雅黑"';
                    ctx.fillStyle = 'rgb(253, 238, 152)';
                    ctx.textBaseline = 'top';
                    res
                      .filter((f) => f.name.includes(element.name))
                      .map((m) => {
                        const index = m.name.indexOf('_');
                        if (index > -1) {
                          const faceid = m.name.substring(0, index + 1);
                          const em = element.faces.find((f) =>
                            f.file.name.startsWith(faceid),
                          );
                          if (em) {
                            ctx.fillText(
                              `id:${m.label} c:${m.confidence.toFixed(0)}`,
                              em.x,
                              em.y,
                            );
                            ctx.fillText(m.msg, em.x, em.y + 60);
                          }
                        }
                      });
                  }
                });
              });
            }
          };

          //#region 创建界面canvas显示识别结果
          const modal = Modal.info({
            title: intl.formatMessage({ id: 'user.Testing' }),
            icon: <LoadingOutlined />,
            closable: true,
            width: 500,
            centered: true,
            content: (
              <Carousel
                style={{ display: 'grid' }}
                infinite={false}
                draggable={true}
              >
                {values.imgs.map((m) => (
                  <div key={m.uid}>
                    {m.originFileObj ? (
                      <ImgCanvas img={m.originFileObj} onOk={OnOk} />
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </Carousel>
            ),
          });
          //#endregion
        }
      }}
    >
      <Form.Item
        label={intl.formatMessage({ id: 'model.selectLabel' })}
        name="model"
      >
        <Select
          placeholder={intl.formatMessage({ id: 'model.model.placeholder' })}
        >
          {models?.map((m) => (
            <Select.Option key={m.uid} value={m.name}>
              {m.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label={intl.formatMessage({ id: 'model.fromLabel' })}
        name="from"
      >
        <Radio.Group
          onChange={(e) => {
            setForm(e.target.value);
          }}
        >
          <Radio value="Video">
            {intl.formatMessage({ id: 'model.videoValue' })}
          </Radio>
          <Radio value="Photo">
            {intl.formatMessage({ id: 'model.photoValue' })}
          </Radio>
        </Radio.Group>
      </Form.Item>
      {form == 'Photo' ? (
        <Form.Item
          //  label={intl.formatMessage({ id: 'model.selectImgLabel' })}
          name="imgs"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
            multiple={true}
            onPreview={undefined}
            beforeUpload={() => false}
            className="upload-list-inline"
            listType="picture-card"
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
      ) : (
        <Form.Item
          label={intl.formatMessage({ id: 'model.videoValue' })}
          name="camera"
        >
          <SelectCamera />
        </Form.Item>
      )}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {intl.formatMessage({ id: 'model.test' })}
        </Button>
      </Form.Item>
    </Form>
  );
};
