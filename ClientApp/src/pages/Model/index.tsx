import services from '@/services/demo';
import { UploadOutlined } from '@ant-design/icons';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Drawer,
  Form,
  message,
  Radio,
  Row,
  Select,
  Upload,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import api from '@/services';
import { UploadFile } from 'antd/es/upload';
import type { RcFile, UploadProps } from 'antd/es/upload';

export default () => {
  const { loading: training, run: Train } = useRequest(api.Face.postFaceTrain, {
    manual: true,
    onSuccess: (res) => {
      message.success(res.msg);
    },
  });

  const { data } = useRequest(api.Face.getFaceGet);

  const [testImg, setTestImg] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        console.log(file, fileList);
      }
    },
    defaultFileList: [
      {
        uid: '1',
        name: 'xxx.png',
        status: 'done',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/xxx.png',
      },
      {
        uid: '2',
        name: 'yyy.png',
        status: 'done',
        url: 'http://www.baidu.com/yyy.png',
      },
      {
        uid: '3',
        name: 'zzz.png',
        status: 'error',
        response: 'Server Error 500', // custom error message to show
        url: 'http://www.baidu.com/zzz.png',
      },
    ],
  };

  const models: API.UpFaceUrl[] | undefined = useMemo(() => {
    if (data?.list) {
      return data.list.map((m: string, index: number) => ({
        uid: index.toString(),
        url: m,
        name: m.split('/').at(-1),
      }));
    }
    return undefined;
  }, [data]);

  return (
    <PageContainer
      header={{
        title: '模型管理',
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="训练">
            <Form
              labelCol={{ span: 6 }}
              style={{ marginTop: 10 }}
              onFinish={(values) => {
                Train({ type: values.type }, values.label || []);
              }}
            >
              <Form.Item label="附加内容" name="label" valuePropName="checked">
                <Checkbox.Group defaultValue={['ID']}>
                  <Checkbox value="ID">ID</Checkbox>
                  <Checkbox value="Name">姓名</Checkbox>
                  <Checkbox value="Phone">手机号</Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item label="选择算法" name="type">
                <Radio.Group defaultValue="LBPH">
                  <Radio value="LBPH">LBPH</Radio>
                  <Radio value="Eigen">Eigen</Radio>
                  <Radio value="Fisher">Fisher</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button loading={training} type="primary" htmlType="submit">
                  启动训练
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="测试">
            <Form
              labelCol={{ span: 6 }}
              style={{ marginTop: 10 }}
              onFinish={async (values) => {
                if (!values.model) {
                  values.model = models?.at(-1)?.name;
                }

                testImg.forEach(async (element) => {
                  //#region 读取上传的图片转换为mat
                  // console.log(element);
                  if (element.thumbUrl) {
                    const img = new Image();
                    img.onload = (re) => {
                      console.log(img.width);
                      //   const matimg = cv.imread(img);
                      //   console.log(matimg);
                    };
                    img.src = element.thumbUrl;

                    // await img.decode();
                  }
                  //#endregion
                });

                //  //#region 人脸检测
                //  const faces = new cv.RectVector();
                //  try {
                //    const gray = new cv.Mat();
                //    cv.cvtColor(matimg, gray, cv.COLOR_RGBA2GRAY, 0); //灰度化
                //    classifier.detectMultiScale(gray, faces, 1.1, 3, 0); //人脸检测
                //    gray.delete();
                //  } catch (err) {
                //    console.log(err);
                //  }
                //  //#endregion

                //  //#region 界面显示上传结果并画出识别到的人脸并将识别到的脸转换base64
                //  for (let i = 0; i < faces.size(); ++i) {
                //    const face = faces.get(i);
                //    const point1 = new cv.Point(face.x, face.y);
                //    const point2 = new cv.Point(
                //      face.x + face.width,
                //      face.y + face.height,
                //    );
                //    cv.rectangle(matimg, point1, point2, [0, 0, 255, 255]);

                //    const tnCanvas = document.createElement('canvas');
                //    const tnCanvasContext = tnCanvas.getContext('2d');
                //    tnCanvas.width = face.width;
                //    tnCanvas.height = face.height;

                //    tnCanvasContext?.drawImage(
                //      img,
                //      face.x,
                //      face.y,
                //      face.width,
                //      face.height,
                //      0,
                //      0,
                //      face.width,
                //      face.height,
                //    );
                //    addurls.push(tnCanvas.toDataURL());
                //  }
                //  cv.imshow('canface', matimg);
                //  matimg.delete();
                //  //#endregion

                //  if (faces.size() > 0) {
                //    modal.update((prevConfig) => ({
                //      ...prevConfig,
                //      title: `检测到（${faces.size()}）张人脸`,
                //      icon: <CheckCircleOutlined />,
                //    }));
                //  } else {
                //    modal.update((prevConfig) => ({
                //      ...prevConfig,
                //      title: `未检测到人脸`,
                //      icon: <CloseCircleOutlined />,
                //    }));
                //  }
                //  faces.delete();
              }}
            >
              <Form.Item label="选择模型" name="model">
                {models ? (
                  <Select defaultValue={models.at(-1)?.name}>
                    {models.map((m) => (
                      <Select.Option key={m.uid} value={m.name}>
                        {m.name}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <></>
                )}
              </Form.Item>
              <Form.Item label="选择图片" valuePropName="fileList">
                <Upload
                  listType="picture"
                  multiple={true}
                  defaultFileList={testImg}
                  className="upload-list-inline"
                  onChange={({ fileList: newFileList }) => {
                    console.log(newFileList);
                    // if (newFileList.thumbUrl) {
                    //   const img = new Image();
                    //   img.src = newFileList.thumbUrl;
                    //   img.onload = () => {
                    //     console.log(img.width);
                    //     //   const matimg = cv.imread(img);
                    //     //   console.log(matimg);
                    //   };
                    // }

                    setTestImg(newFileList);
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  识别
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title="管理">
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
