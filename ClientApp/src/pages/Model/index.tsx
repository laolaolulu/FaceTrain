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
import { useIntl } from 'umi';

export default () => {
  const intl = useIntl();
  const { loading: training, run: Train } = useRequest(api.Face.postFaceTrain, {
    manual: true,
    onSuccess: (res) => {
      message.success(intl.formatMessage({ id: 'model.trainsuccess' }));
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
        title: intl.formatMessage({ id: 'model.title' }),
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xxl={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} xxl={12}>
              <Card title={intl.formatMessage({ id: 'model.train' })}>
                <Form
                  labelCol={{ span: 6 }}
                  style={{ marginTop: 10 }}
                  initialValues={{ type: 'LBPH' }}
                  onFinish={(values) => {
                    Train({ type: values.type }, values.label || []);
                  }}
                >
                  <Form.Item
                    label={intl.formatMessage({ id: 'model.additional' })}
                    name="label"
                    valuePropName="checked"
                  >
                    <Checkbox.Group>
                      <Checkbox value="Name">
                        {intl.formatMessage({ id: 'user.name' })}
                      </Checkbox>
                      <Checkbox value="Phone">
                        {intl.formatMessage({ id: 'user.phone' })}
                      </Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'model.labeltype' })}
                    name="type"
                  >
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
                      {intl.formatMessage({ id: 'model.runTrain' })}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} md={24} xxl={12}>
              <Card title={intl.formatMessage({ id: 'model.administration' })}>
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
          <Card title={intl.formatMessage({ id: 'model.test' })}>
            <TestForm models={models} />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
