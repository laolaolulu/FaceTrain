// 运行时配置

import { ApiOutlined, GithubOutlined } from '@ant-design/icons';
import { RequestConfig } from '@umijs/max';
import { Col, Row, Button, message, Modal } from 'antd';
import { SelectLang, getIntl } from 'umi';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'laolaolulu' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: true,
    },
    title: getIntl().formatMessage({ id: 'title' }),
    rightContentRender: () => (
      <Row gutter={[16, 16]}>
        <Col xs={8} md={24}>
          <Button
            type="link"
            icon={<ApiOutlined style={{ fontSize: 18 }} />}
            href={`${window.location.origin}/swagger`}
            style={{ padding: '12px' }}
            target="_blank"
          />
        </Col>
        <Col xs={8} md={24}>
          <Button
            type="link"
            style={{ padding: '12px' }}
            icon={<GithubOutlined style={{ fontSize: 18 }} />}
            href={`https://github.com/laolaolulu/FaceTrain`}
            target="_blank"
          />
        </Col>
        <Col xs={8} md={24}>
          <SelectLang reload={false} />
        </Col>
      </Row>
    ),
  };
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  responseInterceptors: [
    (response) => {
      if (response.status > 200 && response.status < 300) {
        message.success(getIntl().formatMessage({ id: 'success' }));
      } else if (response.status >= 400) {
        Modal.error({
          title: response.status,
          content: getIntl().formatMessage({ id: 'error' }),
        });
        throw new Error('Error:' + response.status);
      }

      return response;
    },
  ],
  // requestInterceptors: [(url: string, options: any) => {
  //   return {
  //     url,
  //     options: {
  //       ...options, headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`
  //       }
  //     },
  //   };
  // }]
};
