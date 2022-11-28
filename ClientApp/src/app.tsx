// 运行时配置

import { ApiOutlined, GithubOutlined } from '@ant-design/icons';
import { Col, Row, Button } from 'antd';
import { SelectLang, useIntl } from 'umi';

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
    title: useIntl().formatMessage({ id: 'title' }),
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
          <SelectLang />
        </Col>
      </Row>
    ),
  };
};
