import api from '@/services/api';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Image, Modal, UploadFile } from 'antd';
import { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import EditImgForm from './components/EditImgForm';
import { urltoFile } from '@/utils/opencv';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';

export let upurls: UploadFile[];

export default () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // const [select, setSelect] = useState<API.UpFace>();
  //编辑人脸图片选项
  const [upImg, setUpImg] = useState<UpImg>();
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<API.UserInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      editable: false,
      valueType: 'digit',
      width: 50,
      fieldProps: { min: 1, precision: 0, style: { width: '100%' } },
      formItemProps: {
        rules: [
          {
            required: true,
            message: intl.formatMessage({ id: 'user.idmsg' }),
          },
        ],
      },
    },
    {
      title: intl.formatMessage({ id: 'user.name' }),
      dataIndex: 'userName',
      valueType: 'text',
      // width: 120,
    },
    {
      title: intl.formatMessage({ id: 'user.phone' }),
      dataIndex: 'phone',
      valueType: 'text',
      //width: 120,
    },
    {
      title: intl.formatMessage({ id: 'user.handle' }),
      dataIndex: 'option',
      valueType: 'option',
      //  width: 160,
      render: (_, record, __, action) => (
        <>
          <a
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            {intl.formatMessage({ id: 'user.edit' })}
          </a>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'user.faceimg' }),
      editable: false,
      dataIndex: 'faces',
      formItemProps: { hidden: true },
      render: (_, record) => {
        const res = [
          <a
            key="editfaces"
            onClick={() => {
              upurls = record.faces
                ? record.faces.map((url) => {
                    const us = url.split('/');
                    const name = us[us.length - 1];
                    return { name, url, uid: name.split('.')[0] };
                  })
                : [];

              setUpImg({
                ID: record.id,
                name: record.userName,
                urls: upurls,
              });
            }}
          >
            {intl.formatMessage({ id: 'user.edit' })}
          </a>,
        ];
        if (record.faces) {
          res.unshift(
            <Image.PreviewGroup key="facesimg">
              {record.faces.map((m: string) => (
                <Image
                  key={m}
                  width={30}
                  height={30}
                  wrapperStyle={{ marginRight: 10 }}
                  style={{}}
                  src={m}
                  fallback="data:image/png;base64,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"
                />
              ))}
            </Image.PreviewGroup>,
          );
        }
        return res;
      },
    },
  ];

  return (
    <>
      <ProTable<API.UserInfo>
        tableLayout="auto"
        headerTitle={intl.formatMessage({ id: 'user.header' })}
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        scroll={{ y: 'calc(100vh - 280px)' }}
        search={false}
        cardBordered
        options={{ setting: false, density: false }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            {intl.formatMessage({ id: 'user.adduser' })}
          </Button>,
        ]}
        editable={{
          type: 'single',
          onSave: (_, record: any) => {
            return api.User.putUserPut(record);
          },
          onDelete: (_, record) => {
            return api.User.deleteUserDel({ ID: record.id });
          },
        }}
        request={async (params) => {
          const data = await api.User.getUserGet({
            ...params,
          });

          return {
            data: data.list,
            total: data.total,
          };
        }}
      />

      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value: any) => {
            await api.User.postUserAdd(value).then(() => {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            });
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      <EditImgForm
        upImg={upImg}
        setUpImg={setUpImg}
        onOk={async () => {
          if (upImg) {
            const reqs: Promise<{ type: string; num: number }>[] = [];
            const modal = Modal.info({
              title: intl.formatMessage({ id: 'user.requesting' }),
              icon: <LoadingOutlined />,
            });
            //#region  处理新增
            const addfiles = upImg.urls
              .filter((f) => !f.url)
              .map((m) => m.originFileObj as File);
            if (addfiles && addfiles.length > 0) {
              reqs.push(
                new Promise(async (resolve, reject) => {
                  // const addfiles = await Promise.all(addfilesasync);
                  return api.User.postUserAddImg(
                    { ID: upImg.ID },
                    {},
                    addfiles,
                  ).then((res) => {
                    resolve({ type: 'add', num: res });
                  });
                  // .catch(() => {
                  //   reject(0);
                  // });
                }),
              );
            }
            //#endregion

            //#region 处理删除
            var delfaces = upurls
              .filter(
                (item) => upImg.urls.map((m) => m.uid).indexOf(item.uid) == -1,
              )
              .map((m) => m.name);
            if (delfaces && delfaces.length > 0) {
              reqs.push(
                api.Face.deleteFaceDel({ ID: upImg.ID }, delfaces).then(
                  (res) => ({ type: 'del', num: res }),
                ),
              );
            }
            //#endregion

            const res = await Promise.all(reqs);
            //更新界面数据
            if (actionRef.current) {
              actionRef.current.reload();
            }
            setUpImg(undefined);
            if (res) {
              modal.update((prevConfig) => ({
                ...prevConfig,
                title: intl.formatMessage({ id: 'user.requested' }),
                content: res.map((m, index) => (
                  <p key={index}>
                    {intl.formatMessage(
                      { id: `user.face${m.type}res` },
                      { num: m.num },
                    )}
                  </p>
                )),
                icon: <CheckCircleOutlined />,
              }));
            } else {
              modal.destroy();
            }
          }
        }}
      />
    </>
  );
};
