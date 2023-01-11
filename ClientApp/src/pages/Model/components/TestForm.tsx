import {
  CheckCircleOutlined,
  LoadingOutlined,
  ScanOutlined,
} from '@ant-design/icons';
import { Button, Carousel, Form, message, Modal, UploadFile } from 'antd';
import api from '@/services/api';
import '../index.less';
import { useEffect } from 'react';
import { useIntl, getIntl } from 'umi';
import ImgCanvas from '@/components/ImgCanvas';
import VideoCanvas from '@/components/VideoCanvas';
import {
  ProForm,
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormUploadButton,
} from '@ant-design/pro-components';

type TestForm = {
  from: string;
  model: string;
  imgs: UploadFile[];
  camera: string;
};

export default (props: { models: UpFaceUrl[] | undefined }) => {
  const { models } = props;
  const [form] = Form.useForm();
  const intl = useIntl();

  useEffect(() => {
    if (models && models.length > 0) {
      form.setFieldValue('model', models[0].name);
    }
  }, [models]);

  return (
    <ProForm<TestForm>
      form={form}
      layout={'horizontal'}
      labelCol={{ span: 6 }}
      style={{ marginTop: 10 }}
      initialValues={{
        from: 'Video',
      }}
      submitter={false}
      onFinish={async (values) => {
        if (values.from == 'Video') {
          Modal.info({
            title: intl.formatMessage({ id: 'user.Testing' }),
            icon: <ScanOutlined />,
            closable: true,
            centered: true,
            content: (
              <VideoCanvas
                camera={values.camera}
                onOk={(resface: NameFaces) => {
                  //请求后端识别
                  api.Face.putFacePredict(
                    { model: values.model },
                    {},
                    resface.faces.flatMap((f) => f.file),
                  ).then((res) => {
                    if (resface.ctx) {
                      resface.ctx.font = '30px "微软雅黑"';
                      resface.ctx.fillStyle = 'rgb(253, 238, 152)';
                      resface.ctx.textBaseline = 'top';
                      res
                        .filter((f) => f.name.includes(resface.name))
                        .map((m) => {
                          const index = m.name.indexOf('_');
                          if (index > -1) {
                            const faceid = m.name.substring(0, index + 1);
                            const em = resface.faces.find((f) =>
                              f.file.name.startsWith(faceid),
                            );
                            if (em && resface.ctx) {
                              resface.ctx.fillText(
                                `id:${m.label} c:${m.confidence.toFixed(0)}`,
                                em.x,
                                em.y + 10,
                              );
                              resface.ctx.fillText(m.msg, em.x, em.y + 50);
                            }
                          }
                        });
                    }
                  });
                }}
              />
            ),
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
              <div style={{ textAlign: 'center', marginLeft: -34 }}>
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
              </div>
            ),
          });
          //#endregion
        }
      }}
    >
      <ProFormSelect
        name="model"
        label={intl.formatMessage({ id: 'model.selectLabel' })}
        rules={[{ required: true }]}
        placeholder={intl.formatMessage({ id: 'model.model.placeholder' })}
        options={models?.map((m) => ({ label: m.name })) ?? []}
      />

      <ProFormRadio.Group
        name="from"
        rules={[{ required: true }]}
        label={intl.formatMessage({ id: 'model.fromLabel' })}
        options={[
          {
            label: intl.formatMessage({ id: 'model.videoValue' }),
            value: 'Video',
          },
          {
            label: intl.formatMessage({ id: 'model.photoValue' }),
            value: 'Photo',
          },
        ]}
      />
      <ProFormDependency name={['from']}>
        {({ from }, { setFieldValue }) => {
          if (from == 'Video') {
            return (
              <ProFormSelect
                name="camera"
                label={intl.formatMessage({ id: 'model.videoValue' })}
                rules={[{ required: true }]}
                placeholder={intl.formatMessage({
                  id: 'model.video.placeholder',
                })}
                request={async () => {
                  console.log('加载camera=request');
                  const data = await navigator.mediaDevices
                    .enumerateDevices()
                    .then((devices) => {
                      return devices
                        .filter((item) => item.kind == 'videoinput')
                        .map((m) => ({
                          key: m.deviceId,
                          label: m.label,
                          value: m.deviceId,
                        }));
                    });
                  if (data.length > 0) {
                    setFieldValue('camera', data[0].value);
                  }
                  return data;
                }}
              />
            );
          } else {
            return (
              <ProFormUploadButton
                name="imgs"
                formItemProps={{
                  style: { maxHeight: 220, overflowY: 'auto' },
                }}
                //  noStyle
                accept="image/*"
                className="upload-list-inline"
                listType="picture-card"
                rules={[{ required: true }]}
                title={<div>Upload</div>}
                fieldProps={{
                  multiple: true,
                  maxCount: 10,
                  beforeUpload: () => false,
                  showUploadList: { showPreviewIcon: false },
                }}
              ></ProFormUploadButton>
            );
          }
        }}
      </ProFormDependency>

      <div style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit">
          {intl.formatMessage({ id: 'model.test' })}
        </Button>
      </div>
    </ProForm>
  );
};
