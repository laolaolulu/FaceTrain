import {
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileImageOutlined,
  LoadingOutlined,
  ScanOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import {
  ProForm,
  ProFormDependency,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { Modal, Space, Image, Button, message, Carousel } from 'antd';
import { useEffect, useRef } from 'react';
import { useIntl } from 'umi';
import { db } from '@/db';
import ImgCanvas from '@/components/ImgCanvas';
import VideoCanvas from '@/components/VideoCanvas';

export default (props: {
  modalVisible: number;
  faceinfo?: FaceInfo;
  onCancel: () => void;
}) => {
  const upload = useRef<HTMLInputElement>(null);
  const { modalVisible, onCancel, faceinfo } = props;
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (modalVisible === 2) {
      formRef.current?.setFieldsValue(faceinfo);
    } else {
      formRef.current?.resetFields();
    }
  }, [modalVisible]);

  const intl = useIntl();
  return (
    <Modal
      title={
        modalVisible === 1
          ? intl.formatMessage({ id: 'user.adduser' })
          : intl.formatMessage({ id: 'user.edituser' })
      }
      width={420}
      open={modalVisible > 0}
      maskClosable={false}
      onCancel={() => {
        onCancel();
        // console.log(faceinfo);
        // console.log(formRef.current?.getFieldsValue());
      }}
      onOk={() => {
        formRef.current?.submit();
      }}
    >
      <ProForm
        formRef={formRef}
        initialValues={undefined}
        onChange={() => {}}
        submitter={false}
        layout="horizontal"
        onFinish={async (res: FaceInfo) => {
          //判断是否有人脸照片
          if (res.faces && res.faces.length > 0) {
            if (modalVisible === 1) {
              await db.faceInfos.add(res);
            } else if (modalVisible === 2) {
              await db.faceInfos.put(res);
            }
            message.success(intl.formatMessage({ id: 'success' }));
            onCancel();
          } else {
            message.warning(intl.formatMessage({ id: 'user.faceeditwarn' }));
          }
        }}
      >
        <ProForm.Item name="id" noStyle></ProForm.Item>
        <ProFormText
          name="name"
          rules={[{ required: true }]}
          labelCol={{ span: 5 }}
          label={intl.formatMessage({ id: 'user.name' })}
        />
        <ProFormText
          name="phone"
          labelCol={{ span: 5 }}
          label={intl.formatMessage({ id: 'user.phone' })}
        />
        <Space wrap={true}>
          <Button
            style={{ marginBottom: 10 }}
            icon={<VideoCameraAddOutlined />}
            onClick={async () => {
              const modal = Modal.info({
                title: intl.formatMessage({ id: 'user.Testing' }),
                icon: <ScanOutlined />,
                closable: true,
                centered: true,
                content: (
                  <div style={{ marginLeft: -35 }}>
                    <VideoCanvas
                      onOk={(resface?: NameFaces) => {
                        if (
                          formRef.current &&
                          resface &&
                          resface.faces.length > 0
                        ) {
                          const value =
                            formRef.current.getFieldValue('faces') ?? [];
                          formRef.current.setFieldValue('faces', [
                            ...value,
                            ...resface.faces.map((f) => f.file),
                          ]);

                          modal.destroy();
                        }
                      }}
                    />
                  </div>
                ),
              });
            }}
          >
            {intl.formatMessage({ id: 'user.facebyvideo' })}
          </Button>
          <Button
            onClick={() => {
              upload.current?.click();
            }}
            style={{ marginBottom: 10 }}
            icon={<FileImageOutlined />}
          >
            {intl.formatMessage({ id: 'user.facebyimg' })}
          </Button>
          <input
            ref={upload}
            style={{ display: 'none' }}
            type="file"
            multiple
            onChange={(event) => {
              if (
                formRef.current &&
                event.target.files &&
                event.target.files.length > 0
              ) {
                const value = formRef.current.getFieldValue('faces') ?? [];
                const images = [...event.target.files];

                const resfaces: NameFaces[] = [];
                const OnOk = (res: NameFaces) => {
                  resfaces.push(res);
                  const okloading =
                    resfaces.filter((f) => f.faces).length === images.length;
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define
                  modal.update((prevConfig) => ({
                    ...prevConfig,
                    title: intl.formatMessage(
                      { id: 'user.testResult' },
                      {
                        faces: resfaces?.flatMap((f) => f.faces).length || 0,
                        imgs: resfaces?.filter((f) => f.faces).length || 0,
                        imgcount: images?.length || 0,
                      },
                    ),
                    okButtonProps: { loading: !okloading },
                    icon: okloading ? (
                      <CheckCircleOutlined />
                    ) : (
                      <LoadingOutlined />
                    ),
                  }));
                };
                const modal = Modal.confirm({
                  title: intl.formatMessage({ id: 'user.Testing' }),
                  icon: <LoadingOutlined />,
                  closable: true,
                  width: 500,
                  centered: true,

                  onOk: () => {
                    formRef?.current?.setFieldValue('faces', [
                      ...value,
                      ...resfaces.flatMap((f) => f.faces).map((f) => f.file),
                    ]);
                  },
                  content: (
                    <div style={{ textAlign: 'center', marginLeft: -34 }}>
                      <Carousel
                        style={{ display: 'grid' }}
                        infinite={false}
                        draggable={true}
                      >
                        {images.map((m) => (
                          <div key={m.name}>
                            <ImgCanvas img={m} onOk={OnOk} />
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  ),
                });
              }
            }}
          />
        </Space>
        <ProForm.Item name="faces" noStyle>
          <ProFormDependency name={['faces']}>
            {({ faces }) => {
              return (
                <Image.PreviewGroup>
                  <Space wrap={true}>
                    {faces?.map((m: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: 8,
                          border: '1px solid #d9d9d9',
                          borderRadius: 8,
                        }}
                      >
                        <Image
                          src={URL.createObjectURL(m)}
                          width={100}
                          height={100}
                          preview={{
                            mask: (
                              <>
                                <EyeOutlined
                                  style={{
                                    padding: 5,
                                  }}
                                />
                                <DeleteOutlined
                                  style={{
                                    padding: 5,
                                  }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    const faces =
                                      formRef.current?.getFieldValue('faces');
                                    faces.splice(index, 1);
                                    formRef.current?.setFieldValue('faces', [
                                      ...faces,
                                    ]);
                                  }}
                                />
                              </>
                            ),
                          }}
                        />
                      </div>
                    ))}
                  </Space>
                </Image.PreviewGroup>
              );
            }}
          </ProFormDependency>
        </ProForm.Item>
      </ProForm>
    </Modal>
  );
};
