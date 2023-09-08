import { colors } from '@/constants';
import { formatBytes } from '@/utils';
import { PieChartOutlined } from '@ant-design/icons';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Image, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import ResImgsDet from './ResImgsDet';

export default ({
  detectionData,
  imgs,
}: {
  detectionData: {
    mnames: { mname: string; index: number }[];
    data: DetectionDataType[];
  };
  imgs: HTMLCanvasElement[];
}) => {
  //识别结果表头数据
  const detectionDataColumns = useMemo(() => {
    if (detectionData.mnames.length > 0) {
      const columns: ProColumns<DetectionDataType>[] = [
        {
          title: '图片',
          dataIndex: 'imgfile',
          fixed: 'left',
          align: 'center',
          width: 100,
          render: (_, record: DetectionDataType) => (
            //   <Spin
            //     spinning={
            //       !record.model ||
            //       !detectionData ||
            //       record.model.filter((f) => f.faces).length !==
            //         detectionData.mnames.length
            //     }
            //   >
            <Image
              key="nameimage"
              style={{ maxHeight: 100 }}
              src={imgs[record.imgID]?.toDataURL()}
            />
          ),
        },
        {
          title: '图片名称',
          dataIndex: 'name',
          fixed: 'left',
          width: 150,
          render: (_, record: DetectionDataType) => (
            <div>
              <Typography.Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
              >
                {record.name}
              </Typography.Paragraph>
              <Tag icon={<PieChartOutlined />} color="cyan">
                {formatBytes(record.size)}
              </Tag>
            </div>
          ),
        },
      ];

      detectionData.mnames.forEach((element) => {
        columns.push({
          title: () => (
            <Typography.Paragraph
              style={{ color: colors[element.index], marginBottom: 'unset' }}
              ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
            >
              {element.mname}
            </Typography.Paragraph>
          ),
          dataIndex: element.mname,
          align: 'center',
          render: (_, record: DetectionDataType) => (
            <ResImgsDet
              model={record.model?.find((f) => f.modelID === element.index)}
            />
          ),
        });
      });

      return columns;
    }
    return [];
  }, [detectionData.mnames]);

  return (
    <ProTable<DetectionDataType>
      size="small"
      headerTitle="检测结果"
      search={false}
      pagination={false}
      columns={detectionDataColumns}
      dataSource={detectionData.data}
      rowKey={'imgID'}
      scroll={{
        x: detectionData.mnames.length * 110 + 250,
        y: 'calc(100vh - 250px)',
      }}
    />
  );
};
