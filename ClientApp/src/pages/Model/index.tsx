import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
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
  UploadProps,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import api from '@/services';
import { UploadFile } from 'antd/es/upload';
import { downfile } from '@/utils';
import TestForm from './components/TestForm';

export default () => {
  const { loading: training, run: Train } = useRequest(api.Face.postFaceTrain, {
    manual: true,
    onSuccess: (res) => {
      message.success(res.msg);
      init();
    },
  });

  const { data, run: init } = useRequest(api.Face.getFaceGet);
  const { run: Add } = useRequest(api.Face.postFaceAdd, {
    manual: true,
    onSuccess: () => {
      init();
    },
  });

  const { run: Delete } = useRequest(api.Face.deleteFaceDelete, {
    manual: true,
    onSuccess: () => {
      init();
    },
  });
  const models: API.UpFaceUrl[] | undefined = useMemo(() => {
    if (data?.list) {
      return data.list.map((m: string, index: number) => ({
        uid: index.toString(),
        src: m,
        name: m.split('/').at(-1),
        status: 'done',
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
        <Col xs={24} md={12} xxl={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} xxl={12}>
              <Card title="训练">
                <Form
                  labelCol={{ span: 6 }}
                  style={{ marginTop: 10 }}
                  initialValues={{ label: ['Name'], type: 'LBPH' }}
                  onFinish={(values) => {
                    Train({ type: values.type }, values.label || []);
                  }}
                >
                  <Form.Item
                    label="附加内容"
                    name="label"
                    valuePropName="checked"
                  >
                    <Checkbox.Group>
                      <Checkbox value="Name">姓名</Checkbox>
                      <Checkbox value="Phone">手机号</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                  <Form.Item label="选择算法" name="type">
                    <Radio.Group>
                      <Radio value="LBPH">LBPH</Radio>
                      <Radio value="Eigen">Eigen</Radio>
                      <Radio value="Fisher" disabled={true}>
                        Fisher
                      </Radio>
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
            <Col xs={24} md={24} xxl={12}>
              <Card title="管理">
                <Upload
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
                </Upload>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} xxl={8}>
          <Card title="测试">
            <TestForm models={models} />
          </Card>
        </Col>
      </Row>
      <iframe name="downmodel" style={{ display: 'none' }}></iframe>
    </PageContainer>
  );
};
