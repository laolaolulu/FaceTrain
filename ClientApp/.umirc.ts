import { TrademarkOutlined } from '@ant-design/icons';
import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Opencv人脸识别',
  },
  routes: [
    {
      path: '/',
      redirect: '/user',
    },
    // {
    //   name: '首页',
    //   path: '/home',
    //   component: './Home',
    //   icon: 'home',
    // },
    {
      name: '用户管理',
      path: '/user',
      component: './User',
      icon: 'user',
    },
    // {
    //   name: '权限演示',
    //   path: '/access',
    //   icon: 'setting',
    //   component: './Access',
    // },
    {
      name: '模型管理',
      path: '/model',
      icon: 'setting',
      component: './Model',
    },
  ],
  npmClient: 'pnpm',
  //   headScripts: [
  //     {
  //       src: '/opencv.js',
  //       async: true,
  //     },
  //   ],
  proxy: {
    '/api': {
      target: 'http://localhost:5048/',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^': '' },
    },
  },
  outputPath: '../wwwroot/dist',
});
