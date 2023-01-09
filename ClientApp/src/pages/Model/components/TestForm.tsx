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
import { useCallback, useEffect, useRef, useState } from 'react';
import SelectCamera from './SelectCamera';
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
  const [form, setForm] = useState('Photo');
  const intl = useIntl();

  const ref = useRef();

  return (
    <ProForm<TestForm>
      //</ProForm></ProForm> form={ref}
      labelCol={{ span: 6 }}
      style={{ marginTop: 10 }}
      initialValues={{
        from: 'Video',
        // model: models[0].name,
      }}
      onValuesChange={(values) => {
        // console.log(values);
      }}
      onFinish={async (values) => {
        console.log(values);
        // if (values.from == 'Video') {
        //   Modal.info({
        //     title: intl.formatMessage({ id: 'user.Testing' }),
        //     icon: <ScanOutlined />,
        //     closable: true,
        //     centered: true,
        //     content: (
        //       <VideoCanvas
        //         camera={values.camera}
        //         onOk={(resface: NameFaces) => {
        //           //请求后端识别
        //           api.Face.putFacePredict(
        //             { model: values.model },
        //             {},
        //             resface.faces.flatMap((f) => f.file),
        //           ).then((res) => {
        //             if (resface.ctx) {
        //               resface.ctx.font = '30px "微软雅黑"';
        //               resface.ctx.fillStyle = 'rgb(253, 238, 152)';
        //               resface.ctx.textBaseline = 'top';
        //               res
        //                 .filter((f) => f.name.includes(resface.name))
        //                 .map((m) => {
        //                   const index = m.name.indexOf('_');
        //                   if (index > -1) {
        //                     const faceid = m.name.substring(0, index + 1);
        //                     const em = resface.faces.find((f) =>
        //                       f.file.name.startsWith(faceid),
        //                     );
        //                     if (em && resface.ctx) {
        //                       resface.ctx.fillText(
        //                         `id:${m.label} c:${m.confidence.toFixed(0)}`,
        //                         em.x,
        //                         em.y + 10,
        //                       );
        //                       resface.ctx.fillText(m.msg, em.x, em.y + 50);
        //                     }
        //                   }
        //                 });
        //             }
        //           });
        //         }}
        //       />
        //     ),
        //   });
        // } else {
        //   if (!values.imgs) {
        //     message.warning(intl.formatMessage({ id: 'model.notUpMsg' }));
        //     return;
        //   }

        //   const resfaces: NameFaces[] = [];

        //   const OnOk = (res: NameFaces) => {
        //     resfaces.push(res);
        //     modal.update((prevConfig) => ({
        //       ...prevConfig,
        //       title: getIntl().formatMessage(
        //         { id: 'user.testResult' },
        //         {
        //           faces: resfaces.flatMap((f) => f.faces).length,
        //           imgs: resfaces.length,
        //           imgcount: values.imgs.length,
        //         },
        //       ),
        //     }));
        //     if (resfaces.length == values.imgs.length) {
        //       //请求后端识别
        //       api.Face.putFacePredict(
        //         { model: values.model },
        //         {},
        //         resfaces.flatMap((f) => f.faces.flatMap((f) => f.file)),
        //       ).then((res) => {
        //         modal.update((prevConfig) => ({
        //           ...prevConfig,
        //           icon: <CheckCircleOutlined />,
        //         }));
        //         resfaces.forEach((element) => {
        //           const canvas: any = document.getElementById(element.name);
        //           const ctx = canvas.getContext('2d');
        //           if (ctx) {
        //             ctx.font = '60px "微软雅黑"';
        //             ctx.fillStyle = 'rgb(253, 238, 152)';
        //             ctx.textBaseline = 'top';
        //             res
        //               .filter((f) => f.name.includes(element.name))
        //               .map((m) => {
        //                 const index = m.name.indexOf('_');
        //                 if (index > -1) {
        //                   const faceid = m.name.substring(0, index + 1);
        //                   const em = element.faces.find((f) =>
        //                     f.file.name.startsWith(faceid),
        //                   );
        //                   if (em) {
        //                     ctx.fillText(
        //                       `id:${m.label} c:${m.confidence.toFixed(0)}`,
        //                       em.x,
        //                       em.y,
        //                     );
        //                     ctx.fillText(m.msg, em.x, em.y + 60);
        //                   }
        //                 }
        //               });
        //           }
        //         });
        //       });
        //     }
        //   };

        //   //#region 创建界面canvas显示识别结果
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
        //   });
        //   //#endregion
        // }
      }}
    >
      <ProFormSelect
        name="model"
        label={intl.formatMessage({ id: 'model.selectLabel' })}
        rules={[{ required: true }]}
        placeholder={intl.formatMessage({ id: 'model.model.placeholder' })}
        options={models?.map((m) => ({ label: m.name })) ?? []}
      />

      {/* <Form.Item
        // hidden={true}
        initialValue={models} //models && models.length > 0 ? models[0].name : undefined
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={intl.formatMessage({ id: 'model.model.placeholder' })}
          //   value={models && models.length > 0 ? models[0].name : undefined}
        >
          {models?.map((m) => (
            <Select.Option key={m.uid} value={m.name}>
              {m.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item> */}

      <ProFormRadio.Group
        name="from"
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
      {/* <Form.Item
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
      </Form.Item> */}
      {/* {form == 'Photo' ? ( */}
      {/* <Form.Item
        name="imgs"
        valuePropName="fileList"
        style={{ maxHeight: 220, overflowY: 'auto' }}
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
      >
        <Upload
          multiple={true}
          maxCount={10}
          beforeUpload={() => false}
          showUploadList={{ showPreviewIcon: false }}
          className="upload-list-inline"
          listType="picture-card"
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item> */}
      {/* //   ) : ( */}
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
                accept="image/*"
                className="upload-list-inline"
                listType="picture-card"
                fieldProps={{
                  multiple: true,
                  maxCount: 10,
                  beforeUpload: () => false,
                  showUploadList: { showPreviewIcon: false },
                }}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </ProFormUploadButton>
            );
          }
        }}
      </ProFormDependency>

      {/* <Form.Item
        // label={intl.formatMessage({ id: 'model.videoValue' })}
        noStyle
        // name="camera"
        shouldUpdate={(prevValues, curValues) =>
          prevValues.from !== curValues.from
        }
        // rules={[
        //   {
        //     required: true,
        //   },
        // ]}
      >
        {(re) => {
          console.log(re);
            if (getFieldValue('from') == 'Video') {
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
            }
          //  console.log(formvalue);
          //return <SelectCamera />;
          return <></>;
        }}
      </Form.Item> */}
      {/* //   )} */}
      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit">
          {intl.formatMessage({ id: 'model.test' })}
        </Button>
      </Form.Item>
    </ProForm>
  );
};
