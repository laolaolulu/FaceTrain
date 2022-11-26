# 助你快速开发人脸识别功能

- 使用opencv内置的人脸识别算法
- 可帮助你进行用户人脸信息维护
- 一对多识别模型训练并导出xml模型文件
- 拥有简单的测试功能
- 开放webapi接口方便后期上生产环境
- 前端React+后端dotnetcore助你跨平台使用
- 完成electron打包方便测试预览
- 更多的是祝你能学到更多的新姿势

## 废话不多上预览图
![image](Resource/preview.webm)

## 我要去下载尝试
[给你打包好了，来伸手接住 https://github.com/laolaolulu/FaceTrain/releases](https://github.com/laolaolulu/FaceTrain/releases)

## 我是否能修改代码实现我想要的功能？
- 前端使用React技术（vue行不行？哎你去学习下React嘛很简单的）
- 前端脚手架使用阿里的umijs
- UI库还是阿里的antd
- OpenApi-Swagger
- 后端使用VisualStudio2022工具开发
- .net core 6 webapi 
- 人脸识别算法来自OpenCvSharp

## 项目目录介绍
- FaceTrain //根目录
    - ClientApp //前端代码
	- Controllers //webapi控制器
	- electron //桌面版打包
	- Models //数据库模型（EntityFramework）
	- Resource //公共资源
	- wwwroot
		- dist //前端build后的文件
		- Faces //人脸数据图片
		- Model //训练模型储存目录
	* face.db //数据库文件（sqlite）
	* lp.p12 //ssl证书（方便web调用摄像头）

## 模型使用demo
- c#

```//待完善 ```
- java

```//待完善 ```
- python

```//待完善 ```
- node

```//待完善 ```
- c++

```//待完善 ```

## 我要自行编译
文档待完善

## 写在最后
- 微软大法好！
- 谷歌大法好！

每一段代码都不能保证没有bug希望大家别骂娘，欢迎提交issues我有空时会去处理修复；
工具生成的模型适合于一对多人脸识别，如果你是需要一对一的人脸匹配认证这个工具不适合；
LBPH算法识别结果confidence小于50才能保证识别的准确性；