import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: { headerRender: true },
  locale: { title: true, default: 'en-US' },
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
      // name: '用户管理',
      title: 'user.title',
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
      // name: '模型管理',
      title: 'model.title',
      path: '/model',
      icon: 'setting',
      component: './Model',
    },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'https://localhost:54321/',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^': '' },
    },
  },
  outputPath: '../wwwroot/dist',
  headScripts: [
    {
      src: './opencv.js',
      async: true,
      // onload: 'opencvload();',
    },
  ],
  plugins: ['@umijs/max-plugin-openapi'],
  openAPI: {
    projectName: 'api',
    requestLibPath: "import { request } from 'umi'",
    schemaPath: 'https://localhost:54321/swagger/v1/swagger.json',
    mock: false,
    // serversPath: '',
  },
});
