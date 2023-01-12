import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  LoadingOutlined,
  PlusOutlined,
  ScanOutlined,
  UploadOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons';
import {
  Carousel,
  Divider,
  message,
  Modal,
  Select,
  Upload,
  UploadFile,
} from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { faceWorker } from '@/constants';
import { upurls } from '../index';
import styles from '../index.less';
import { useIntl, getIntl } from 'umi';
import { sleep } from '@/utils';
import ImgCanvas from '@/components/ImgCanvas';
import VideoCanvas from '@/components/VideoCanvas';

export default (props: {
  upImg?: UpImg;
  setUpImg: React.Dispatch<React.SetStateAction<UpImg | undefined>>;
  onOk: () => void;
}) => {
  const intl = useIntl();
  const { upImg, setUpImg, onOk } = props;

  const [upfile, setUpfile] = useState<{ file: RcFile; faces?: File[] }[]>();

  const ImgOk = (res: any) => {
    setUpfile((files) => {
      const upm = files?.find((f) => f.file.name == res.name);
      if (upm && files) {
        upm.faces = res.faces.map((m: any) => m.file);
        return [...files];
      }
      return files;
    });
  };

  return (
    <>
      <Modal
        maskClosable={false}
        open={upImg ? true : false}
        onOk={onOk}
        title={intl.formatMessage(
          { id: 'user.faceTitle' },
          { msg: `${upImg?.ID}-${upImg?.name}` },
        )}
        onCancel={() => {
          const add = upImg?.urls.filter((f) => f.uid.startsWith('rc-upload'));
          var del = upurls.filter(
            (item) => upImg?.urls.map((m) => m.uid).indexOf(item.uid) == -1,
          );
          if ((add && add.length > 0) || (del && del.length > 0)) {
            Modal.confirm({
              title: intl.formatMessage({ id: 'user.facePrompt' }),
              onOk: () => {
                setUpImg(undefined);
              },
            });
          } else {
            setUpImg(undefined);
          }
        }}
      >
        <Upload
          multiple={true}
          maxCount={10}
          listType="picture-card"
          accept="image/*"
          fileList={upImg?.urls}
          onPreview={async (file) => {
            if (!file.url) {
              file.url = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as File);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
              });
            }

            Modal.info({
              title: `${upImg?.ID}-${file.name}`,
              closable: true,
              maskClosable: true,
              okButtonProps: { style: { display: 'none' } },
              content: <img width={300} src={file.url} />,
            });
          }}
          beforeUpload={async (file) => {
            setUpfile((f) => {
              let res = [{ file }];
              if (f) {
                res = [...f, ...res];
              }
              return res;
            });
            return false;
          }}
          onRemove={(file) => {
            if (upImg) {
              const index = upImg.urls.findIndex((f) => f.uid == file.uid);
              if (index > -1) {
                const urls = [...upImg.urls];
                urls.splice(index, 1);
                setUpImg({ ...upImg, urls });
              }
            }
          }}
        >
          <div className={styles.upimgvideo}>
            <UploadOutlined />
            <Divider type="vertical" style={{ margin: 0 }} />
            <VideoCameraAddOutlined
              onClick={async (e) => {
                e.stopPropagation();
                const deviceId = await new Promise<string | undefined>(
                  (resolve) => {
                    navigator.mediaDevices
                      .enumerateDevices()
                      .then((devices) => {
                        const voides = devices
                          .filter((item) => item.kind == 'videoinput')
                          .map((m) => ({
                            key: m.deviceId,
                            label: m.label,
                            value: m.deviceId,
                          }));
                        if (voides.length > 1) {
                          const modal = Modal.info({
                            title: intl.formatMessage({
                              id: 'user.selectvideo',
                            }),
                            width: 300,
                            closable: true,
                            centered: true,
                            okButtonProps: { style: { display: 'none' } },
                            content: (
                              <Select
                                style={{ marginTop: 10, width: '100%' }}
                                placeholder={intl.formatMessage({
                                  id: 'user.selectvideo',
                                })}
                                options={voides}
                                onChange={(res) => {
                                  modal.destroy();
                                  resolve(res);
                                }}
                              />
                            ),
                            onCancel: () => {
                              resolve(undefined);
                            },
                          });
                        } else {
                          resolve(voides[0]?.value);
                        }
                      })
                      .catch(() => {
                        resolve(undefined);
                      });
                  },
                );
                if (deviceId) {
                  const modal = Modal.info({
                    title: intl.formatMessage({ id: 'user.Testing' }),
                    icon: <ScanOutlined />,
                    closable: true,
                    centered: true,
                    content: (
                      <VideoCanvas
                        camera={deviceId}
                        onOk={(resface: NameFaces) => {
                          if (upImg && resface.faces.length > 0) {
                            modal.destroy();
                            const urls: UploadFile[] = upImg.urls.concat(
                              resface.faces.map((m) => ({
                                uid: 'rc-upload-' + m.file.name,
                                name: m.file.name,
                                originFileObj: m.file as RcFile,
                              })),
                            );
                            setUpImg({ ...upImg, urls });
                          }
                        }}
                      />
                    ),
                  });
                } else {
                  message.warning(intl.formatMessage({ id: 'user.novideo' }));
                }
              }}
            />
          </div>
        </Upload>
      </Modal>
      <Modal
        closable={true}
        centered={true}
        destroyOnClose
        open={upfile ? true : false}
        bodyStyle={{ textAlign: 'center' }}
        title={
          <>
            <span style={{ color: '#1677ff', fontSize: 22, marginRight: 12 }}>
              {upfile?.filter((f) => f.faces).length == upfile?.length ? (
                <CheckCircleOutlined />
              ) : (
                <LoadingOutlined />
              )}
            </span>
            {intl.formatMessage(
              { id: 'user.testResult' },
              {
                faces: upfile?.flatMap((f) => f.faces).length || 0,
                imgs: upfile?.filter((f) => f.faces).length || 0,
                imgcount: upfile?.length || 0,
              },
            )}
          </>
        }
        onCancel={() => {
          setUpfile(undefined);
        }}
        onOk={() => {
          if (upfile && upImg) {
            const urls: UploadFile[] = upImg.urls.concat(
              upfile
                .flatMap((m) => m.faces)
                .map((m) => ({
                  uid: 'rc-upload-' + m?.name,
                  name: m?.name as string,
                  originFileObj: m as RcFile,
                })),
            );
            setUpImg({ ...upImg, urls });
            setUpfile(undefined);
          }
        }}
      >
        <Carousel style={{ display: 'grid' }} infinite={false} draggable={true}>
          {upfile?.map((m) => (
            <div key={m.file.uid}>
              <ImgCanvas img={m.file} onOk={ImgOk} />
            </div>
          ))}
        </Carousel>
      </Modal>
    </>
  );
};
