import { Select } from 'antd';
import { useEffect, useState } from 'react';

export default (props: any) => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>();
  useEffect(() => {
    //注意第一次没有权限获取不到id
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setCameras(devices.filter((item) => item.kind == 'videoinput'));
    });
  }, []);

  return (
    <Select onChange={props.onChange} placeholder="使用默认相机">
      {cameras?.map((m) => (
        <Select.Option key={m.deviceId} value={m.deviceId}>
          {m.label}
        </Select.Option>
      ))}
    </Select>
  );
};
