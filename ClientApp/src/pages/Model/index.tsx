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
  UploadProps,
} from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import api from '@/services';
import { UploadFile } from 'antd/es/upload';

import TestForm from './components/TestForm';

export default () => {
  const { loading: training, run: Train } = useRequest(api.Face.postFaceTrain, {
    manual: true,
    onSuccess: (res) => {
      message.success(res.msg);
    },
  });

  const { data } = useRequest(api.Face.getFaceGet);

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
            {/* <Form
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
            </Form> */}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="测试">
            <TestForm models={models} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title="管理">
            {/* <Upload {...props}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload> */}
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
