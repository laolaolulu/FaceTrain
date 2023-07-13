import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Divider,
  Empty,
  Image,
  Popconfirm,
  Space,
  UploadFile,
} from 'antd';
import { useRef, useState } from 'react';
import EditForm from './components/EditForm';
import { EyeOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { db } from '@/db';
export let upurls: UploadFile[];

let editfaceinfo: FaceInfo | undefined = undefined;

export default () => {
  const [modalVisible, setModalVisible] = useState<number>(0);

  //编辑人脸图片选项
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<FaceInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 40,
    },
    {
      title: intl.formatMessage({ id: 'user.name' }),
      dataIndex: 'name',
      // width: 120,
    },
    {
      title: intl.formatMessage({ id: 'user.phone' }),
      dataIndex: 'phone',
      //width: 120,
    },

    {
      title: intl.formatMessage({ id: 'user.faceimg' }),
      dataIndex: 'faces',
      render: (_, record) => (
        <Image.PreviewGroup key="facesimg">
          <Space wrap={true}>
            {record.faces?.map((m, index) => (
              <Image
                key={index}
                width={30}
                height={30}
                src={URL.createObjectURL(m)}
                preview={{
                  mask: <EyeOutlined />,
                }}
              />
            ))}
          </Space>
        </Image.PreviewGroup>
      ),
    },
    {
      title: intl.formatMessage({ id: 'user.handle' }),
      valueType: 'option',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              editfaceinfo = record;
              setModalVisible(2);
            }}
          >
            {intl.formatMessage({ id: 'user.edit' })}
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title={intl.formatMessage({ id: 'user.deleteprompt' })}
            onConfirm={() => {
              db.faceInfos.delete(record.id!);
              actionRef.current?.reload();
            }}
          >
            <a>{intl.formatMessage({ id: 'user.delete' })}</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<FaceInfo>
        tableLayout="auto"
        headerTitle={intl.formatMessage({ id: 'user.header' })}
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        scroll={{ y: 'calc(100vh - 280px)' }}
        search={false}
        cardBordered
        options={{ setting: false, density: false }}
        pagination={{ pageSize: 5 }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={intl.formatMessage({ id: 'user.datatip' })}
            />
          ),
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => {
              editfaceinfo = undefined;
              setModalVisible(1);
            }}
          >
            {intl.formatMessage({ id: 'user.adduser' })}
          </Button>,
        ]}
        request={async (params) => {
          const pageSize = params.pageSize ?? 15;
          const offset = pageSize * ((params.current ?? 1) - 1);
          const total = await db.faceInfos.count();
          const data = await db.faceInfos
            .orderBy('id')
            .reverse()
            .offset(offset)
            .limit(pageSize)
            .toArray();
          return { data, total };
        }}
      />

      <EditForm
        onCancel={() => {
          setModalVisible(0);
          actionRef.current?.reload();
        }}
        faceinfo={editfaceinfo}
        modalVisible={modalVisible}
      />
    </>
  );
};
