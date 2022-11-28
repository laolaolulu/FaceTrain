import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';
import { useIntl } from 'umi';
interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const { modalVisible, onCancel } = props;
  const intl = useIntl();
  return (
    <Modal
      destroyOnClose
      title={intl.formatMessage({ id: 'user.adduser' })}
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
