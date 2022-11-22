import {
  CheckCircleOutlined,
  LoadingOutlined,
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
import { useState } from 'react';
export default (props: { models: API.UpFaceUrl[] | undefined }) => {
  const [form, setForm] = useState('Photo');

  const { models } = props;

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
      onFinish={async (values) => {
        if (values.from == 'Video') {
          console.log(values);
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
              mat.delete();
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
                const tnCanvasContext = tnCanvas.getContext('2d');
                tnCanvas.width = face.width;
                tnCanvas.height = face.height;
                //裁剪出人脸传入后端请求识别
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
                //将裁剪出的图片转换为文件
                const faceFile = await new Promise<File | undefined>(
                  (resolve) => {
                    tnCanvas.toBlob((blob) => {
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
      initialValues={{ from: 'Photo' }}
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
          <Radio value="Video" disabled={true}>
            视频
          </Radio>
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
      ) : null}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button loading={predicting} type="primary" htmlType="submit">
          识别
        </Button>
      </Form.Item>
    </Form>
  );
};
