import { Image as AntdImage } from 'antd';

export default () => {
  return (
    <AntdImage
      width={200}
      preview={{
        imageRender: (node, info) => {
          console.log('test', node);
          console.log('test', info);
          return (
            <video
              muted
              width="100%"
              controls
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*uYT7SZwhJnUAAAAAAAAAAAAADgCCAQ"
            />
          );
        },
        toolbarRender: () => null,
      }}
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  );
};
