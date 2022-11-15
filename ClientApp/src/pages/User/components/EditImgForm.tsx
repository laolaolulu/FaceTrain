import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

export default (props: {
  user?: API.User;
  setUser: React.Dispatch<React.SetStateAction<API.User | undefined>>;
}) => {
  const { user, setUser } = props;

  return (
    <Modal
      destroyOnClose
      title="修改"
      width={420}
      open={user ? true : false}
      onCancel={() => setUser(undefined)}
    ></Modal>
  );
};
