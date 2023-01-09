# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://next.umijs.org/zh-CN/docs/max/introduce)

### openapi 使用问题

- 表单中的数组被自动转换为字符串了

### web worker 使用问题

- 同一个 worker 实例使用的同一个线程
- 多个 worker 如何共享同一个单例对象？

### 设计

- 为节省传输流量向后端请求识别时前端先截取人脸部分，并且没有人脸的图片不进行请求后端识别
