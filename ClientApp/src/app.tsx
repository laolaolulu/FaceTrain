// 运行时配置

import { ApiOutlined, GithubOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'laolaolulu' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    rightContentRender: () => (
      <Row gutter={[16, 16]}>
        <Col xs={12} md={24}>
          <a href={`${window.location.origin}/swagger`} target="_blank">
            <ApiOutlined />
          </a>
        </Col>
        <Col xs={12} md={24}>
          <a href="https://github.com/laolaolulu/FaceTrain" target="_blank">
            <GithubOutlined />
          </a>
        </Col>
      </Row>
    ),
  };
};
