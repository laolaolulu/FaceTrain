import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

export default (props: any) => {
  const intl = useIntl();
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>();
  useEffect(() => {
    //注意第一次没有权限获取不到id
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const ds = devices.filter((item) => item.kind == 'videoinput');
      if (ds.length > 0) {
        setCameras(ds);
        props.onChange(ds[0].deviceId);
      }
    });
  }, []);

  return (
    <Select
      onChange={props.onChange}
      placeholder={intl.formatMessage({ id: 'model.video.placeholder' })}
      //  value={cameras && cameras.length > 0 ? cameras[0].deviceId : undefined}
    >
      {cameras?.map((m) => (
        <Select.Option key={m.deviceId} value={m.deviceId}>
          {m.label}
        </Select.Option>
      ))}
    </Select>
  );
};
