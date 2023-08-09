import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProForm,
  ProFormCheckbox,
  ProFormDependency,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormTreeSelect,
  ProFormUploadButton,
  ProFormUploadDragger,
  ProTable,
} from '@ant-design/pro-components';
import { getWorker, getSendImgData } from '@/utils';
import {
  Image as AntdImage,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Drawer,
  Form,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
  UploadProps,
  Spin,
  Carousel,
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '@/services/api';
import { UploadFile } from 'antd/es/upload';
import { downfile } from '@/utils';
import TestForm from './components/TestForm';
import { useIntl } from 'umi';
import {} from '@/constants';
import { db } from '@/db';
import { wrap } from 'comlink';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import './index.less';
import { detection } from '@/utils/worker';

const detectionModel = [
  {
    value: 'Haarcascade',
    children: [
      {
        value: 'haarcascade_frontalface_alt2.xml',
      },
      {
        value: 'haarcascade_frontalface_default.xml',
      },
      {
        value: 'haarcascade_frontalface_alt.xml',
      },
      {
        value: 'haarcascade_frontalface_alt_tree.xml',
      },
    ],
  },
  {
    value: 'SSD',
    children: [
      {
        value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
      },
    ],
  },
  {
    value: 'SCRFD',
    children: [
      //   {
      //     //value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
      //   },
    ],
  },
  {
    value: 'RetinaFace',
    children: [
      //   {
      //     value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
      //   },
    ],
  },
  {
    value: 'BlazeFace',
    children: [
      //   {
      //     value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
      //   },
    ],
  },
];

type FaceRect = { height: number; width: number; x: number; y: number };
type DetectionDataType = {
  index: number;
  imgfile: UploadFile;
  model: {
    index: number;
    time: number;
    faces: (FaceRect & {
      face: string;
    })[];
  }[];
};

const getFace = (file: File, rect: FaceRect) =>
  new Promise((resolve) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      image.src = e.target!.result as string;
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        const context = canvas.getContext('2d')!;
        context.drawImage(
          image,
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          0,
          0,
          rect.width,
          rect.height,
        );
        resolve(canvas.toDataURL());
      };
    };

    reader.readAsDataURL(file);
  });

export default () => {
  const formDetectionRef = useRef<ProFormInstance>();
  const intl = useIntl();

  useEffect(() => {
    // eslint-disable-next-line no-async-promise-executor
  }, []);

  // const { loading: training, run: Train } = useRequest(api.Face.putFaceTrain, {
  //   manual: true,
  //   onSuccess: () => {
  //     init();
  //   },
  // });

  // const { data, run: init } = useRequest(api.Face.getFaceGetModel, {
  //   onBefore: () => {
  //     return '';
  //   },
  // });

  // const { run: Add } = useRequest(api.Face.postFaceAddModel, {
  //   manual: true,
  //   onSuccess: () => {
  //     init();
  //   },
  // });

  // const { run: Delete } = useRequest(api.Face.deleteFaceDelModel, {
  //   manual: true,
  //   onSuccess: () => {
  //     init();
  //   },
  // });
  // const models: UploadFile[] | undefined = useMemo(() => {
  //   if (data) {
  //     return data.map((m: string, index: number) => ({
  //       uid: index.toString(),
  //       src: m,
  //       name: m.split('/').at(-1) ?? '',
  //       status: 'done',
  //     }));
  //   }
  //   return undefined;
  // }, [data]);

  const [detectionData, setDetectionData] = useState<{
    mnames: { mname: string; index: number }[];
    data: DetectionDataType[];
  }>();

  useEffect(() => {
    //console.log(detectionData?.data);
    // setTimeout(async () => {
    //   if (cv instanceof Function) {
    //     cv = await cv();
    //     console.log(cv);
    //   }
    // }, 3000);
  }, [detectionData?.data]);

  const detectionDataColumns = useMemo(() => {
    const columns: ProColumns<DetectionDataType>[] = [
      {
        title: '图片',
        dataIndex: 'imgfile',
        fixed: 'left',
        render: (_, record: DetectionDataType) => (
          <Spin
            spinning={
              !record.model ||
              !detectionData ||
              record.model.filter((f) => f.faces).length !==
                detectionData.mnames.length
            }
          >
            <AntdImage width={50} src={record.imgfile.thumbUrl} />
          </Spin>
        ),
      },
      {
        title: '图片名称',
        dataIndex: 'name',
        fixed: 'left',
        render: (_, record: DetectionDataType) => record.imgfile.name,
      },
    ];
    if (detectionData?.mnames) {
      detectionData.mnames.forEach(async (element) => {
        columns.push({
          title: element.mname,
          dataIndex: element.mname,
          children: [
            {
              title: '耗时',
              render: (_, record: DetectionDataType) => {
                const model = record.model?.find(
                  (f) => f.index === element.index,
                );
                return (model && (model.time / 1000)?.toFixed(2)) || '-';
              },
            },
            {
              title: '数量',
              render: (_, record: DetectionDataType) =>
                record.model?.find((f) => f.index === element.index)?.faces
                  .length,
            },
            {
              title: '人脸',
              render: (_, record: DetectionDataType) => (
                <AntdImage.PreviewGroup>
                  <Carousel
                    infinite={false}
                    draggable={true}
                    // autoplay={true}
                    dots={{ className: 'dotclass' }}
                    style={{
                      display: 'grid',
                      maxHeight: 100,

                      maxWidth: 80,
                      background: '#364d79',
                    }}
                  >
                    {record.model
                      ?.find((f) => f.index === element.index)
                      ?.faces.map((m, index) => (
                        <AntdImage
                          key={`${index}-${element.index}`}
                          width={80}
                          height={80}
                          src={m.face}
                        />
                      ))}
                  </Carousel>
                </AntdImage.PreviewGroup>
              ),
            },
          ],
        });
      });
    }
    return columns;
  }, [detectionData]);

  return (
    // <PageContainer
    //   header={{
    //     title: intl.formatMessage({ id: 'model.title' }),
    //   }}
    //   childrenContentStyle={{ padding: '0 10px' }}
    // >
    <Row gutter={[16, 16]}>
      <Col xs={24} md={24} xxl={24}>
        <Card title="人脸检测测试">
          <ProForm
            formRef={formDetectionRef}
            labelCol={{ span: 6 }}
            style={{ marginTop: 10 }}
            initialValues={{ type: 'LBPH', label: ['Name'] }}
            submitter={{
              resetButtonProps: { style: { display: 'none' } },
              submitButtonProps: { style: { marginLeft: 100 } },
              searchConfig: {
                submitText: intl.formatMessage({ id: 'model.runTrain' }),
              },
            }}
            onFinish={async (values) => {
              const models = detectionModel
                .flatMap((t) =>
                  t.children.map((n) => ({
                    mtype: t.value.toLowerCase(),
                    mname: n.value,
                  })),
                )
                .filter((f) => values.model.includes(f.mname));
              //配置表头以及需要识别的图片
              setDetectionData({
                mnames: models.map(({ mname }, index) => ({ mname, index })),
                data: values.imgs.map((m: UploadFile, index: number) => ({
                  index,
                  imgfile: m,
                })),
              });
              //请求人脸检测worker
              const callback = (res: any) => {
                console.log(res);
              };
              models.forEach((element, index) => {
                setTimeout(() => {
                  detection(
                    element.mtype,
                    element.mname,
                    values.imgs.map((m: any) => m.originFileObj),
                    callback,
                  ).then((res: any) => {
                    console.log(res);
                  });
                }, index * 200);

                // values.imgs.forEach(async (img: any) => {
                //   const imddata = await getSendImgData(img.originFileObj);
                //   console.log('start', new Date());
                //   const se = detection(element.mtype, element.mname, imddata);
                // });
              });
              //   const worker: any = getWorker();
              //   for (let index = 0; index < models.length; index++) {
              //     const element = models[index];
              //     for (
              //       let dataindex = 0;
              //       dataindex < values.imgs.length;
              //       dataindex++
              //     ) {
              //       //请求人脸检测
              //       const res = await worker.detectMultiScale(
              //         await getSendImgData(values.imgs[dataindex].originFileObj),
              //         element.mname,
              //       );
              //       //返回人脸矩形框截取到人脸部分
              //       for (
              //         let faceindex = 0;
              //         faceindex < res.faces.length;
              //         faceindex++
              //       ) {
              //         res.faces[faceindex].face = await getFace(
              //           values.imgs[dataindex].originFileObj,
              //           res.faces[faceindex],
              //         );
              //       }
              //       console.log(res);

              //       setDetectionData((state) => {
              //         const resstate = [...(state?.data || [])];
              //         const statedata = resstate.find(
              //           (f) => f.index === dataindex,
              //         );
              //         if (state && statedata) {
              //           statedata.model = [
              //             ...(statedata.model || []),
              //             { index, ...res },
              //           ];

              //           return { ...state, data: resstate };
              //         }
              //         return state;
              //       });
              //     }
              //   }
            }}
          >
            {/* <ProFormSelect
              name="mtype"
              label="检测算法"
              options={[
                'SCRFD_500M',
                'SCRFD_10G',
                'SCRFD_500M_KPS',
                'SCRFD_10G_KPS',
                'RetinaFace-R50',
                'RetinaFace-MobileNet-0.25',
                'BlazeFace-FPN-SSH',
              ]}
              placeholder="Please select a country"
              rules={[
                { required: true, message: 'Please select your country!' },
              ]}
            /> */}
            <ProFormTreeSelect
              label="检测算法"
              name="model"
              placeholder="选择检测模型"
              rules={[{ required: true }]}
              fieldProps={{
                treeCheckable: true,
                treeDefaultExpandAll: true,
                fieldNames: {
                  label: 'value',
                },
                treeData: detectionModel,
              }}
            />
            {/* <ProFormSelect
              name="model"
              label="检测算法"
              options={[
                'Haarcascade',
                'SSD',
                'SCRFD',
                'RetinaFace',
                'BlazeFace',
              ]}
              placeholder="Please select a country"
              rules={[
                { required: true, message: 'Please select your country!' },
              ]}
            /> */}

            {/* <ProFormSelect
              name="mname"
              label="检测模型"
              dependencies={['mtype']}
              request={async (params) => {
                let opt: string[] = [];
                switch (params.mtype) {
                  case 'Haarcascade': {
                    opt = [
                      'haarcascade_frontalface_alt2.xml',
                      'haarcascade_frontalface_default.xml',
                      'haarcascade_frontalface_alt.xml',
                      'haarcascade_frontalface_alt_tree.xml',
                    ];
                    break;
                  }
                  case 'SSD':
                    opt = ['res10_300x300_ssd_iter_140000_fp16.caffemodel'];
                    break;
                  case 'SCRFD':
                    opt = [''];
                    break;
                }
                formDetectionRef.current?.setFieldValue('mname', opt[0]);
                return opt.map((m) => ({ label: m }));
              }}
              placeholder="Please select a country"
              rules={[
                { required: true, message: 'Please select your country!' },
              ]}
            /> */}

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
                          <div style={{ marginLeft: -35, textAlign: 'center' }}>
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
                { required: true, message: 'Please select your country!' },
              ]}
            />

            {/* <ProFormSelect
              name="recognition"
              label="识别模型"
              options={[
                'SCRFD_500M',
                'SCRFD_10G',
                'SCRFD_500M_KPS',
                'SCRFD_10G_KPS',
              ]}
              placeholder="Please select a country"
              rules={[
                { required: true, message: 'Please select your country!' },
              ]}
            /> */}
          </ProForm>
          {detectionData ? (
            <ProTable<DetectionDataType>
              headerTitle="检测结果"
              search={false}
              pagination={false}
              columns={detectionDataColumns}
              dataSource={detectionData.data}
              rowKey={'index'}
              scroll={{ x: true }}
            >
              {/* <Column title="照片" dataIndex="imgfile" key="imgfile" />
              <Column title="文件名" dataIndex="name" />
              {detectionData.mnames.map((m, index) => (
                <ColumnGroup key={m.mname} title={m.mname}>
                  <Column
                    title="耗时"
                    render={(_, record: DetectionDataType) =>
                      record.model.find((f) => f.index === index)?.time
                    }
                  />
                  <Column
                    title="人脸数量"
                    render={(_, record: DetectionDataType) =>
                      record.model.find((f) => f.index === index)?.faces.length
                    }
                  />
                  <Column
                    title="人脸"
                    render={(_, record: DetectionDataType) =>
                      record.model.find((f) => f.index === index)?.faces.length
                    }
                  />
                </ColumnGroup>
              ))} */}
            </ProTable>
          ) : null}
        </Card>
      </Col>
      <Col xs={24} md={12} xxl={16}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24} xxl={12}>
            <Card title={intl.formatMessage({ id: 'model.train' })}>
              <ProForm
                labelCol={{ span: 6 }}
                style={{ marginTop: 10 }}
                initialValues={{ type: 'LBPH', label: ['Name'] }}
                submitter={{
                  resetButtonProps: { style: { display: 'none' } },
                  submitButtonProps: { style: { marginLeft: 100 } },
                  searchConfig: {
                    submitText: intl.formatMessage({ id: 'model.runTrain' }),
                  },
                }}
                onFinish={async (values) => {
                  console.log(values);
                  // console.log(cv);
                  //   const model = new cv.LBPHFaceRecognizer();
                  //   console.log('model', model);
                  const sendData = db.faceInfos.toArray().then((data) =>
                    data.map(async (m) => {
                      const facedata = await Promise.all(
                        m.faces?.map(
                          (file) =>
                            new Promise<ImageData | undefined>((resolve) => {
                              const timeout = setTimeout(() => {
                                resolve(undefined);
                                console.error('人脸图片加载超时3s');
                              }, 3000);
                              const reader = new FileReader();
                              reader.onload = function (event) {
                                if (event.target?.result) {
                                  // 创建一个 Image 对象
                                  const image = new Image();
                                  image.onload = function () {
                                    const canvas = new OffscreenCanvas(
                                      image.width,
                                      image.height,
                                    );
                                    const ctx = canvas.getContext('2d')!;
                                    ctx.drawImage(image, 0, 0);

                                    // 获取图像数据
                                    const imageData = ctx.getImageData(
                                      0,
                                      0,
                                      canvas.width,
                                      canvas.height,
                                    );
                                    resolve(imageData);
                                    clearTimeout(timeout);
                                  };

                                  // 将图像数据加载到 Image 对象中
                                  image.src = event.target.result.toString();
                                }
                              };
                              // 读取文件内容
                              reader.readAsDataURL(file);
                            }),
                        ) ?? [],
                      );

                      const labelInfo = '';
                      return {
                        label: m.id!,
                        labelInfo,
                        facedata: (
                          facedata.filter((f) => f) as ImageData[]
                        ).map((fd) => ({
                          width: fd.width,
                          height: fd.height,
                          buffer: fd.data.buffer,
                        })),
                      };
                    }),
                  );

                  const data = await Promise.all(await sendData);
                  getFaceWorker()
                    .detection('a', 'b', 2)
                    .then((res: any) => {
                      console.log(res);
                    });
                  //   faceWorker.postMessage(
                  //     {
                  //       action: 'train',
                  //       faces: data,
                  //     },
                  //     data.flatMap((m) => m.facedata.map((m) => m.buffer)),
                  //   );
                }}
              >
                <ProFormCheckbox.Group
                  name="label"
                  label={intl.formatMessage({ id: 'model.additional' })}
                  options={['Name', 'Phone']}
                />
                <ProFormRadio.Group
                  name="type"
                  label={intl.formatMessage({ id: 'model.labeltype' })}
                  radioType="radio"
                  options={['LBPH', 'Eigen', 'Fisher']}
                />
              </ProForm>
            </Card>
          </Col>
          <Col xs={24} md={24} xxl={12}>
            <Card title={intl.formatMessage({ id: 'model.administration' })}>
              {/* <Upload
                  fileList={models}
                  onPreview={undefined}
                  showUploadList={{
                    showDownloadIcon: true,
                    downloadIcon: (file: any) => {
                      return (
                        <DownloadOutlined
                          onClick={() => {
                            fetch(file.src).then((res) => {
                              return res.blob().then((blob) => {
                                var a = document.createElement('a');
                                var url = window.URL.createObjectURL(blob);
                                a.href = url;
                                a.download = file.src.split('/').at(-1);
                                a.click();
                                window.URL.revokeObjectURL(url);
                              });
                            });
                          }}
                        />
                      );
                    },
                  }}
                  onRemove={(file) => {
                    Delete({ fileName: file.name });
                  }}
                  beforeUpload={(file) => {
                    Add({}, file);
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload> */}
            </Card>
          </Col>
        </Row>
      </Col>
      <Col xs={24} md={12} xxl={8}>
        <Card title={intl.formatMessage({ id: 'model.test' })}>
          {/* <TestForm models={models} /> */}
        </Card>
      </Col>
    </Row>
    // {/* </PageContainer> */}
  );
};
