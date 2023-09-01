import { PageContainer } from '@ant-design/pro-components';
import { Button, Divider } from 'antd';
import FormDet from './FormDet';
import './index.less';

// const detectionModel = [
//   {
//     value: 'Haarcascade',
//     children: [
//       {
//         value: 'haarcascade_frontalface_alt2.xml',
//       },
//       {
//         value: 'haarcascade_frontalface_default.xml',
//       },
//       {
//         value: 'haarcascade_frontalface_alt.xml',
//       },
//       {
//         value: 'haarcascade_frontalface_alt_tree.xml',
//       },
//     ],
//   },
//   {
//     value: 'SSD',
//     children: [
//       {
//         value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
//       },
//     ],
//   },
//   {
//     value: 'SCRFD',
//     children: [
//       //   {
//       //     //value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
//       //   },
//     ],
//   },
//   {
//     value: 'RetinaFace',
//     children: [
//       //   {
//       //     value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
//       //   },
//     ],
//   },
//   {
//     value: 'BlazeFace',
//     children: [
//       //   {
//       //     value: 'res10_300x300_ssd_iter_140000_fp16.caffemodel',
//       //   },
//     ],
//   },
// ];

export default () => {
  return (
    <>
      <FormDet />
      <Divider />
      <PageContainer
        title="相似度计算"
        extra={[
          <Button key="3">操作</Button>,
          <Button key="2">操作</Button>,
          <Button
            key="1"
            type="primary"
            onClick={() => {
              // formDetectionRef.current?.submit();
            }}
          >
            开始计算
          </Button>,
        ]}
      >
        {/* <ProFormTreeSelect
          label="特征算法"
          name="model"
          placeholder="选择去特征算法模型"
          rules={[{ required: true }]}
          colProps={{ xs: 24, md: 12 }}
          fieldProps={{
            treeCheckable: true,
            treeDefaultExpandAll: true,
            fieldNames: {
              label: 'value',
            },
            treeData: detectionModel,
          }}
        /> */}
      </PageContainer>
    </>
  );
};

{
  /* // <Row gutter={[16, 16]}>
    //   <Col xs={24} md={24} xxl={24}>
    //     <Card title="人脸检测测试">
    //       <ProForm
    //         formRef={formDetectionRef}
    //         labelCol={{ span: 6 }}
    //         style={{ marginTop: 10 }}
    //         initialValues={{ type: 'LBPH', label: ['Name'] }}
    //         submitter={{
    //           resetButtonProps: { style: { display: 'none' } },
    //           submitButtonProps: { style: { marginLeft: 100 } },
    //           searchConfig: {
    //             submitText: intl.formatMessage({ id: 'model.runTrain' }),
    //           },
    //         }}
    //         onFinish={async (values) => {
    //           //获取选中的model及父级项
    //           const models = detectionModel
    //             .flatMap((t) =>
    //               t.children.map((n) => ({
    //                 mtype: t.value.toLowerCase(),
    //                 mname: n.value,
    //               })),
    //             )
    //             .filter((f) => values.model.includes(f.mname));
    //           //获取表头数据以及要检测的图片
    //           const data = await Promise.all(
    //             values.imgs.map(async (m: UploadFile, index: number) => {
    //               imgs[index] = await new Promise<HTMLCanvasElement>(
    //                 (resolve) => {
    //                   const reader = new FileReader();
    //                   reader.onload = function (e) {
    //                     const image = new Image();
    //                     image.onload = function () {
    //                       const canvas = document.createElement('canvas');
    //                       canvas.width = image.width;
    //                       canvas.height = image.height;
    //                       const context = canvas.getContext('2d')!;
    //                       context.drawImage(
    //                         image,
    //                         0,
    //                         0,
    //                         image.width,
    //                         image.height,
    //                       );
    //                       resolve(canvas);
    //                     };
    //                     image.src = e.target?.result as string;
    //                   };
    //                   reader.readAsDataURL(m.originFileObj!);
    //                 },
    //               );
    //               return {
    //                 index,
    //                 name: m.name,
    //                 size: m.size,
    //               };
    //             }),
    //           );

    //           //配置表头以及需要识别的图片
    //           setDetectionData({
    //             mnames: models.map(({ mname }, index) => ({ mname, index })),
    //             data,
    //           });

    //           //请求人脸检测worker
    //           models.forEach((element, index) => {
    //             const callback = async (res: {
    //               index: number;
    //               time: number;
    //               faces: FaceRect[];
    //             }) => {
    //               const context = imgs[res.index].getContext('2d')!;
    //               const faces = await Promise.all(
    //                 res.faces.map(async (m) => {
    //                   //将检测到人脸边框绘制到图片上
    //                   context.beginPath();
    //                   context.rect(m.x, m.y, m.width, m.height); // 参数分别是 x, y, width, height
    //                   context.strokeStyle = colors[index]; // 设置边框颜色
    //                   context.lineWidth = 1; // 设置边框宽度
    //                   context.stroke(); // 绘制矩形边框

    //                   return {
    //                     face: await getFace(
    //                       values.imgs[res.index].originFileObj,
    //                       m,
    //                     ),
    //                     ...m,
    //                   };
    //                 }),
    //               );

    //               setDetectionData((state) => {
    //                 const resstate = [...(state?.data || [])];
    //                 const model = {
    //                   index,
    //                   time: res.time,
    //                   faces,
    //                 };
    //                 const statedata = resstate.find(
    //                   (f) => f.index === res.index,
    //                 );
    //                 if (statedata?.model) {
    //                   statedata.model.push(model);
    //                 } else {
    //                   statedata!.model = [model];
    //                 }

    //                 return {
    //                   ...(state || { mnames: [], data: [] }),
    //                   data: resstate,
    //                 };
    //               });
    //             };

    //             setTimeout(() => {
    //               //启动识别
    //               detection(
    //                 element.mtype,
    //                 element.mname,
    //                 values.imgs.map((m: any) => m.originFileObj),
    //                 callback,
    //               );
    //             }, index * 200);
    //           });
    //         }}
    //       >
    //         {/* <ProFormSelect
    //           name="mtype"
    //           label="检测算法"
    //           options={[
    //             'SCRFD_500M',
    //             'SCRFD_10G',
    //             'SCRFD_500M_KPS',
    //             'SCRFD_10G_KPS',
    //             'RetinaFace-R50',
    //             'RetinaFace-MobileNet-0.25',
    //             'BlazeFace-FPN-SSH',
    //           ]}
    //           placeholder="Please select a country"
    //           rules={[
    //             { required: true, message: 'Please select your country!' },
    //           ]}
    //         /> */
}
//         <ProFormTreeSelect
//           label="检测算法"
//           name="model"
//           placeholder="选择检测模型"
//           rules={[{ required: true }]}
//           fieldProps={{
//             treeCheckable: true,
//             treeDefaultExpandAll: true,
//             fieldNames: {
//               label: 'value',
//             },
//             treeData: detectionModel,
//           }}
//         />
//         {/* <ProFormSelect
//           name="model"
//           label="检测算法"
//           options={[
//             'Haarcascade',
//             'SSD',
//             'SCRFD',
//             'RetinaFace',
//             'BlazeFace',
//           ]}
//           placeholder="Please select a country"
//           rules={[
//             { required: true, message: 'Please select your country!' },
//           ]}
//         /> */}

//         {/* <ProFormSelect
//           name="mname"
//           label="检测模型"
//           dependencies={['mtype']}
//           request={async (params) => {
//             let opt: string[] = [];
//             switch (params.mtype) {
//               case 'Haarcascade': {
//                 opt = [
//                   'haarcascade_frontalface_alt2.xml',
//                   'haarcascade_frontalface_default.xml',
//                   'haarcascade_frontalface_alt.xml',
//                   'haarcascade_frontalface_alt_tree.xml',
//                 ];
//                 break;
//               }
//               case 'SSD':
//                 opt = ['res10_300x300_ssd_iter_140000_fp16.caffemodel'];
//                 break;
//               case 'SCRFD':
//                 opt = [''];
//                 break;
//             }
//             formDetectionRef.current?.setFieldValue('mname', opt[0]);
//             return opt.map((m) => ({ label: m }));
//           }}
//           placeholder="Please select a country"
//           rules={[
//             { required: true, message: 'Please select your country!' },
//           ]}
//         /> */}

//         <ProFormUploadButton
//           label="选择图片"
//           name="imgs"
//           listType="picture-card"
//           className="avatar-uploader"
//           fieldProps={{
//             beforeUpload: () => {
//               return false;
//             },
//             multiple: true,
//             onPreview: (imgfile) => {
//               const reader = new FileReader();
//               reader.onload = (e) => {
//                 const img = new Image();
//                 img.onload = () => {
//                   Modal.info({
//                     title: '预览',
//                     width: img.width,
//                     closable: true,
//                     centered: true,
//                     maskClosable: true,
//                     content: (
//                       <div style={{ marginLeft: -35, textAlign: 'center' }}>
//                         <img
//                           style={{
//                             maxWidth: '100%',
//                             maxHeight: 'calc(100vh - 140px)',
//                           }}
//                           src={e.target?.result?.toString()}
//                         />
//                       </div>
//                     ),
//                   });
//                 };
//                 if (e.target?.result) {
//                   img.src = e.target.result.toString();
//                 }
//               };
//               reader.readAsDataURL(imgfile.originFileObj!);
//             },
//           }}
//           max={10}
//           accept={'image/png, image/jpeg'}
//           rules={[
//             { required: true, message: 'Please select your country!' },
//           ]}
//         />

//         {/* <ProFormSelect
//           name="recognition"
//           label="识别模型"
//           options={[
//             'SCRFD_500M',
//             'SCRFD_10G',
//             'SCRFD_500M_KPS',
//             'SCRFD_10G_KPS',
//           ]}
//           placeholder="Please select a country"
//           rules={[
//             { required: true, message: 'Please select your country!' },
//           ]}
//         /> */}
//       </ProForm>
//       {detectionData ? (
//         <ProTable<DetectionDataType>
//           headerTitle="检测结果"
//           search={false}
//           pagination={false}
//           columns={detectionDataColumns}
//           dataSource={detectionData.data}
//           rowKey={'index'}
//           scroll={{ x: true }}
//         >
//           {/* <Column title="照片" dataIndex="imgfile" key="imgfile" />
//           <Column title="文件名" dataIndex="name" />
//           {detectionData.mnames.map((m, index) => (
//             <ColumnGroup key={m.mname} title={m.mname}>
//               <Column
//                 title="耗时"
//                 render={(_, record: DetectionDataType) =>
//                   record.model.find((f) => f.index === index)?.time
//                 }
//               />
//               <Column
//                 title="人脸数量"
//                 render={(_, record: DetectionDataType) =>
//                   record.model.find((f) => f.index === index)?.faces.length
//                 }
//               />
//               <Column
//                 title="人脸"
//                 render={(_, record: DetectionDataType) =>
//                   record.model.find((f) => f.index === index)?.faces.length
//                 }
//               />
//             </ColumnGroup>
//           ))} */}
//         </ProTable>
//       ) : null}
//     </Card>
//   </Col>
//   <Col xs={24} md={12} xxl={16}>
//     <Row gutter={[16, 16]}>
//       <Col xs={24} md={24} xxl={12}>
//         <Card title={intl.formatMessage({ id: 'model.train' })}>
//           <ProForm
//             labelCol={{ span: 6 }}
//             style={{ marginTop: 10 }}
//             initialValues={{ type: 'LBPH', label: ['Name'] }}
//             submitter={{
//               resetButtonProps: { style: { display: 'none' } },
//               submitButtonProps: { style: { marginLeft: 100 } },
//               searchConfig: {
//                 submitText: intl.formatMessage({ id: 'model.runTrain' }),
//               },
//             }}
//             onFinish={async (values) => {
//               console.log(values);
//               // console.log(cv);
//               //   const model = new cv.LBPHFaceRecognizer();
//               //   console.log('model', model);
//               //   const sendData = db.faceInfos.toArray().then((data) =>
//               //     data.map(async (m) => {
//               //       const facedata = await Promise.all(
//               //         m.faces?.map(
//               //           (file) =>
//               //             new Promise<ImageData | undefined>((resolve) => {
//               //               const timeout = setTimeout(() => {
//               //                 resolve(undefined);
//               //                 console.error('人脸图片加载超时3s');
//               //               }, 3000);
//               //               const reader = new FileReader();
//               //               reader.onload = function (event) {
//               //                 if (event.target?.result) {
//               //                   // 创建一个 Image 对象
//               //                   const image = new Image();
//               //                   image.onload = function () {
//               //                     const canvas = new OffscreenCanvas(
//               //                       image.width,
//               //                       image.height,
//               //                     );
//               //                     const ctx = canvas.getContext('2d')!;
//               //                     ctx.drawImage(image, 0, 0);

//               //                     // 获取图像数据
//               //                     const imageData = ctx.getImageData(
//               //                       0,
//               //                       0,
//               //                       canvas.width,
//               //                       canvas.height,
//               //                     );
//               //                     resolve(imageData);
//               //                     clearTimeout(timeout);
//               //                   };

//               //                   // 将图像数据加载到 Image 对象中
//               //                   image.src = event.target.result.toString();
//               //                 }
//               //               };
//               //               // 读取文件内容
//               //               reader.readAsDataURL(file);
//               //             }),
//               //         ) ?? [],
//               //       );

//               //       const labelInfo = '';
//               //       return {
//               //         label: m.id!,
//               //         labelInfo,
//               //         facedata: (
//               //           facedata.filter((f) => f) as ImageData[]
//               //         ).map((fd) => ({
//               //           width: fd.width,
//               //           height: fd.height,
//               //           buffer: fd.data.buffer,
//               //         })),
//               //       };
//               //     }),
//               //   );

//               //   const data = await Promise.all(await sendData);
//               //   getFaceWorker()
//               //     .detection('a', 'b', 2)
//               //     .then((res: any) => {
//               //       console.log(res);
//               //     });
//               //   faceWorker.postMessage(
//               //     {
//               //       action: 'train',
//               //       faces: data,
//               //     },
//               //     data.flatMap((m) => m.facedata.map((m) => m.buffer)),
//               //   );
//             }}
//           >
//             <ProFormCheckbox.Group
//               name="label"
//               label={intl.formatMessage({ id: 'model.additional' })}
//               options={['Name', 'Phone']}
//             />
//             <ProFormRadio.Group
//               name="type"
//               label={intl.formatMessage({ id: 'model.labeltype' })}
//               radioType="radio"
//               options={['LBPH', 'Eigen', 'Fisher']}
//             />
//           </ProForm>
//         </Card>
//       </Col>
//       <Col xs={24} md={24} xxl={12}>
//         <Card title={intl.formatMessage({ id: 'model.administration' })}>
//           {/* <Upload
//               fileList={models}
//               onPreview={undefined}
//               showUploadList={{
//                 showDownloadIcon: true,
//                 downloadIcon: (file: any) => {
//                   return (
//                     <DownloadOutlined
//                       onClick={() => {
//                         fetch(file.src).then((res) => {
//                           return res.blob().then((blob) => {
//                             var a = document.createElement('a');
//                             var url = window.URL.createObjectURL(blob);
//                             a.href = url;
//                             a.download = file.src.split('/').at(-1);
//                             a.click();
//                             window.URL.revokeObjectURL(url);
//                           });
//                         });
//                       }}
//                     />
//                   );
//                 },
//               }}
//               onRemove={(file) => {
//                 Delete({ fileName: file.name });
//               }}
//               beforeUpload={(file) => {
//                 Add({}, file);
//                 return false;
//               }}
//             >
//               <Button icon={<UploadOutlined />}>Upload</Button>
//             </Upload> */}
//         </Card>
//       </Col>
//     </Row>
//   </Col>
//   <Col xs={24} md={12} xxl={8}>
//     <Card title={intl.formatMessage({ id: 'model.test' })}>
//       {/* <TestForm models={models} /> */}
//     </Card>
//   </Col>
// </Row> */}
