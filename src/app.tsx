// 运行时配置

import { ApiOutlined, GithubOutlined } from '@ant-design/icons';
import { RequestConfig } from '@umijs/max';
import { Button, message, Modal } from 'antd';
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

    fixSiderbar: true,
    layout: 'top',
    contentStyle: { padding: '0' },

    actionsRender: () => {
      return [
        // eslint-disable-next-line react/jsx-key
        <Button
          type="link"
          icon={<ApiOutlined />}
          href={`${window.location.origin}/swagger`}
          target="_blank"
        />,
        // eslint-disable-next-line react/jsx-key
        <Button
          type="link"
          icon={<GithubOutlined />}
          href={`https://github.com/laolaolulu/FaceTrain`}
          target="_blank"
        />,
        // eslint-disable-next-line react/jsx-key
        <SelectLang reload={false} />,
      ];
    },
    rightContentRender: false,
  };
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  responseInterceptors: [
    [
      (response) => {
        if (response.status !== 200) {
          message.success(getIntl().formatMessage({ id: 'success' }));
        }
        return response;
      },
      (error: any) => {
        console.log(error);
        Modal.error({
          title: `${getIntl().formatMessage({ id: 'error' })}:${
            error.response.status
          }`,
          content: error.message,
        });
        return Promise.reject();
      },
    ],
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
