// 运行时配置

import { ApiOutlined, GithubFilled, GithubOutlined } from '@ant-design/icons';
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
    //fixedHeader: true,
    fixSiderbar: true,
    layout: 'mix',
    // splitMenus: true,
    actionsRender: () => {
      return [
        <Button
          type="link"
          icon={<ApiOutlined />}
          href={`${window.location.origin}/swagger`}
          target="_blank"
        />,
        <Button
          type="link"
          icon={<GithubOutlined />}
          href={`https://github.com/laolaolulu/FaceTrain`}
          target="_blank"
        />,
        <SelectLang reload={false} />,
      ];
    },
    rightContentRender: false,
  };
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  errorConfig: {
    errorHandler: (error: any) => {
      console.log(error);
      Modal.error({
        title: `${getIntl().formatMessage({ id: 'error' })}:${
          error.response.status
        }`,
        content: error.message,
      });
    },
    errorThrower: () => {
      alert('error');
    },
  },
  responseInterceptors: [
    (response) => {
      if (response.status > 200 && response.status < 300) {
        message.success(getIntl().formatMessage({ id: 'success' }));
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
