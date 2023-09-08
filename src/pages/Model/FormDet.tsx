import { colors, faceModel } from '@/constants';
import { formatBytes, getFace, imageDataToImage } from '@/utils';
import { detection, initWorker } from '@/utils/worker';
import {
  FieldTimeOutlined,
  FileImageOutlined,
  PauseOutlined,
  PieChartOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormDependency,
  ProFormInstance,
  ProFormTreeSelect,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import {
  Button,
  Col,
  Modal,
  Row,
  Segmented,
  Space,
  Tag,
  UploadFile,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WorkerPool } from 'workerpool';
import ProFormFromVideo from './components/FromVideo';
import ResTableDet from './components/ResTableDet';

const imgs: HTMLCanvasElement[] = [];
const voidgetimgtimeout: NodeJS.Timeout[] = [];
const clearvoidgetimgtimeout = () => {
  for (let i = voidgetimgtimeout.length - 1; i >= 0; i--) {
    clearTimeout(voidgetimgtimeout[i]); // 清除定时器
    voidgetimgtimeout.splice(i, 1); // 从数组中删除定时器
  }
};

export default () => {
  //人脸检测表单ref
  const formDetectionRef = useRef<ProFormInstance>();
  const fromVideoRef = useRef<{
    getImg: () => { name: string; img: ImageData };
  }>();

  //人脸检测结果数据
  const [detectionData, setDetectionData] = useState<{
    mnames: { mname: string; index: number }[];
    data: DetectionDataType[];
  }>({ mnames: [], data: [] });
  //检测第三线程
  const [detectionPool, setDetectionPool] = useState<WorkerPool[]>([]);

  //检测第三线程
  const [detectionWorker, setDetectionWorker] = useState<
    { name: string; worker: Worker }[]
  >([]);

  //是否正在进行人脸检测
  const detectioning = useMemo(() => {
    return detectionWorker.length > 0;
  }, [detectionWorker]);

  useEffect(() => {
    return () => {
      //清除还在等待读取摄像头
      clearvoidgetimgtimeout();
      //清除未结束的线程
      setDetectionWorker((state) => {
        state.forEach((worker) => {
          worker.worker.terminate();
        });
        return [];
      });
    };
  }, []);
  //开始从摄像头检测人脸
  const videoStart = (
    models: {
      mtype: string;
      mname: string;
    }[],
  ) => {
    clearvoidgetimgtimeout();
    const images = Array(5)
      .fill(0)
      .map((_, imgID) => {
        const getimg = new Promise<{
          name: string;
          data: ImageData;
          element: HTMLImageElement;
        }>((resolve) => {
          const timeout = setTimeout(() => {
            const { name, img } = fromVideoRef.current!.getImg();
            //#region 创建img canvas
            // 创建一个新的 HTMLCanvasElement
            const canvas = document.createElement('canvas');
            // 设置画布的宽度和高度，与 ImageData 的尺寸相匹配
            canvas.width = img.width;
            canvas.height = img.height;
            const context = canvas.getContext('2d')!;
            // 将 ImageData 渲染到画布上
            context.putImageData(img, 0, 0);
            imgs[imgID] = canvas;
            //#endregion

            setDetectionData((state) => ({
              ...state,
              data: [
                ...state.data,
                {
                  imgID,
                  name,
                  size: img.data.byteLength,
                },
              ],
            }));
            resolve({ name, data: img, element: imageDataToImage(img) });
          }, 1000 * imgID);
          voidgetimgtimeout.push(timeout);
        });

        return { imgID, getimg };
      });

    models.forEach(async (element, modelID) => {
      const res = await initWorker(element.mtype, element.mname);

      //将人脸检测线程储存起来
      setDetectionWorker((state) => [
        ...state,
        { name: element.mname, worker: res.worker },
      ]);
      for (let index = 0; index < images.length; index++) {
        const imagem = images[index];

        const image = await imagem.getimg;
        //执行检测人脸
        const execres = await res.exec(image.data, imagem.imgID);

        if (execres.success) {
          const faces = execres.data.faces.map((m: any) => {
            //#region 将检测到人脸边框绘制到图片上
            const context = imgs[imagem.imgID].getContext('2d')!;
            context.beginPath();
            context.rect(m.x, m.y, m.width, m.height); // 参数分别是 x, y, width, height
            context.strokeStyle = colors[modelID]; // 设置边框颜色
            context.lineWidth = 1; // 设置边框宽度
            context.stroke(); // 绘制矩形边框
            //#endregion

            //#region 将人脸部分截取为图片
            const canvas = document.createElement('canvas');
            canvas.width = m.width;
            canvas.height = m.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(
              image.element,
              m.x,
              m.y,
              m.width,
              m.height,
              0,
              0,
              m.width,
              m.height,
            );

            return {
              face: canvas.toDataURL(),
              ...m,
            };
            //#endregion
          });

          setDetectionData((state) => {
            const resstate = [...state.data];
            const model = {
              modelID,
              time: execres.data.time,
              faces,
            };
            const statedata = resstate.find((f) => f.imgID === imagem.imgID);

            if (statedata?.model) {
              statedata.model.push(model);
            } else {
              statedata!.model = [model];
            }

            return {
              ...state,
              data: resstate,
            };
          });
        }
      }
      res.worker.terminate();

      setDetectionWorker((state) =>
        state.filter((f) => f.name !== element.mname),
      );
    });
  };
  //上传图片检测人脸
  const imageStart = async (
    models: {
      mtype: string;
      mname: string;
    }[],
  ) => {
    //获取表头数据以及要检测的图片
    const data = await Promise.all(
      values.imgs.map(async (m: UploadFile, index: number) => {
        imgs[index] = await new Promise<HTMLCanvasElement>((resolve) => {
          const reader = new FileReader();
          reader.onload = function (e) {
            const image = new Image();
            image.onload = function () {
              const canvas = document.createElement('canvas');
              canvas.width = image.width;
              canvas.height = image.height;
              const context = canvas.getContext('2d')!;
              context.drawImage(image, 0, 0, image.width, image.height);
              resolve(canvas);
            };
            image.src = e.target?.result as string;
          };
          reader.readAsDataURL(m.originFileObj!);
        });
        return {
          index,
          name: m.name,
          size: m.size,
        };
      }),
    );

    //配置表头以及需要识别的图片
    setDetectionData({
      mnames: models.map(({ mname }, index) => ({ mname, index })),
      data,
    });

    //请求人脸检测worker
    models.forEach((element, index) => {
      const callback = async (res: {
        index: number;
        time: number;
        faces: FaceRect[];
      }) => {
        const context = imgs[res.index].getContext('2d')!;
        const faces = await Promise.all(
          res.faces.map(async (m) => {
            //将检测到人脸边框绘制到图片上
            context.beginPath();
            context.rect(m.x, m.y, m.width, m.height); // 参数分别是 x, y, width, height
            context.strokeStyle = colors[index]; // 设置边框颜色
            context.lineWidth = 1; // 设置边框宽度
            context.stroke(); // 绘制矩形边框

            return {
              face: await getFace(values.imgs[res.index].originFileObj, m),
              ...m,
            };
          }),
        );

        setDetectionData((state) => {
          const resstate = [...(state?.data || [])];
          const model = {
            index,
            time: res.time,
            faces,
          };
          const statedata = resstate.find((f) => f.index === res.index);
          if (statedata?.model) {
            statedata.model.push(model);
          } else {
            statedata!.model = [model];
          }

          return {
            ...(state || { mnames: [], data: [] }),
            data: resstate,
          };
        });
      };
      //启动识别
      setTimeout(async () => {
        const pool = await detection(
          element.mtype,
          element.mname,
          values.imgs.map((m: any) => m.originFileObj),
          callback,
        );

        setDetectionPool((state) => [...state, pool]);
      }, index * 200);
    });
  };
  return (
    <ProForm
      formRef={formDetectionRef}
      // style={{ marginTop: 10 }}
      initialValues={{ imgfrom: 'files' }}
      submitter={false}
      onFinish={async (values) => {
        //获取选中的model及父级项
        const models = faceModel.detection
          .flatMap((t) =>
            t.children.map((n) => ({
              mtype: t.value.toLowerCase(),
              mname: n.value,
            })),
          )
          .filter((f) => values.model.includes(f.mname));

        if (values.imgfrom === 'videos') {
          //配置表头
          setDetectionData({
            mnames: models.map(({ mname }, index) => ({ mname, index })),
            data: [],
          });
          videoStart(models);
        } else {
        }
      }}
    >
      <PageContainer
        title="人脸检测测试"
        style={{ width: '100%' }}
        extra={[
          <ProForm.Item name="imgfrom" key="1" noStyle>
            <Segmented
              disabled={detectioning}
              options={[
                {
                  value: 'files',
                  icon: <FileImageOutlined />,
                },
                {
                  value: 'videos',
                  icon: <VideoCameraOutlined />,
                },
              ]}
            />
          </ProForm.Item>,
          <Space.Compact key="2" block>
            <Button loading={detectioning} type="primary" htmlType="submit">
              检测人脸
            </Button>
            <Button
              type="primary"
              icon={<PauseOutlined />}
              style={{
                display: detectioning ? 'unset' : 'none',
              }}
              onClick={() => {
                //清除还在等待读取摄像头
                clearvoidgetimgtimeout();
                //清除未结束的线程
                setDetectionWorker((state) => {
                  state.forEach((worker) => {
                    worker.worker.terminate();
                  });
                  return [];
                });
              }}
            />
          </Space.Compact>,
        ]}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <ProFormTreeSelect
              label="检测算法"
              name="model"
              placeholder="选择检测模型"
              rules={[{ required: true }]}
              fieldProps={{
                treeCheckable: true,
                treeNodeLabelProp: 'value',
                treeDefaultExpandAll: true,
                treeData: faceModel.detection.map((m) => ({
                  ...m,
                  label: m.value,
                  children: m.children.map((c) => ({
                    ...c,
                    label: (
                      <div>
                        {c.value}
                        <br />
                        <Tag icon={<FieldTimeOutlined />} color="default">
                          {c.date}
                        </Tag>
                        <Tag icon={<PieChartOutlined />} color="default">
                          {formatBytes(c.size)}
                        </Tag>
                      </div>
                    ),
                  })),
                })),
              }}
            />
          </Col>
          <Col xs={24} md={12}>
            <ProFormDependency name={['imgfrom']}>
              {({ imgfrom }) =>
                imgfrom === 'videos' ? (
                  <ProFormFromVideo
                    ref={fromVideoRef}
                    label="摄像头"
                    name="video"
                    placeholder="选择摄像头"
                    rules={[{ required: true }]}
                    onLoad={(devid: string) => {
                      formDetectionRef.current?.setFieldValue('video', devid);
                    }}
                  />
                ) : (
                  <ProFormUploadButton
                    label="选择图片"
                    name="imgs"
                    listType="picture-card"
                    className="avatar-uploader"
                    fieldProps={{
                      beforeUpload: () => {
                        return false;
                      },
                      multiple: true,
                      maxCount: 10,
                      onPreview: (imgfile) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const img = new Image();
                          img.onload = () => {
                            Modal.info({
                              title: '预览',
                              width: img.width,
                              closable: true,
                              centered: true,
                              maskClosable: true,
                              content: (
                                <div
                                  style={{
                                    marginLeft: -35,
                                    textAlign: 'center',
                                  }}
                                >
                                  <img
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: 'calc(100vh - 140px)',
                                    }}
                                    src={e.target?.result?.toString()}
                                  />
                                </div>
                              ),
                            });
                          };
                          if (e.target?.result) {
                            img.src = e.target.result.toString();
                          }
                        };
                        reader.readAsDataURL(imgfile.originFileObj!);
                      },
                    }}
                    max={10}
                    accept={'image/png, image/jpeg'}
                    rules={[
                      {
                        required: true,
                        message: 'Please select your country!',
                      },
                    ]}
                  />
                )
              }
            </ProFormDependency>
          </Col>
        </Row>

        {detectionData.mnames.length > 0 ? (
          <ResTableDet imgs={imgs} detectionData={detectionData} />
        ) : null}
      </PageContainer>
    </ProForm>
  );
};
