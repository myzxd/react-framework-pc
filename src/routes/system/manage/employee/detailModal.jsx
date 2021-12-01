/**
 * 人员管理 - 员工合同甲方 - 详情弹窗
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Form,
  Modal,
} from 'antd';
import {
  ThirdCompanyState,
  AllowElectionSign,
} from '../../../../application/define';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 14 } };

const DetailModal = ({
  dispatch,
  companyId, // 合同甲方id
  contractDetail, // 合同甲方详情
  visible,
  setVisible,
}) => {
  useEffect(() => {
    companyId && dispatch({
      type: 'systemManage/fetchContractDetail',
      payload: { id: companyId },
    });
  }, [dispatch, companyId]);

  // form
  const renderForm = () => {
    return (
      <Form
        layout="horizontal"
      >
        <Form.Item
          label="公司名称"
          {...formLayout}
        >
          {dot.get(contractDetail, 'name', '--')}
        </Form.Item>
        <Form.Item
          label="是否允许电子签约"
          {...formLayout}
        >
          {AllowElectionSign.description(dot.get(contractDetail, 'is_electronic_sign', false))}
        </Form.Item>
        <Form.Item
          label="法人"
          {...formLayout}
        >
          {dot.get(contractDetail, 'legal_person', '--')}
        </Form.Item>
        <Form.Item
          label="统一社会信用代码"
          {...formLayout}
        >
          {dot.get(contractDetail, 'credit_no', '--')}
        </Form.Item>
        <Form.Item
          label="地址"
          {...formLayout}
        >
          {dot.get(contractDetail, 'address', '--')}
        </Form.Item>
        <Form.Item
          label="电话"
          {...formLayout}
        >
          {dot.get(contractDetail, 'phone', '--')}
        </Form.Item>
        <Form.Item
          label="状态"
          {...formLayout}
        >
          {
            dot.get(contractDetail, 'state', undefined) ?
              ThirdCompanyState.description(dot.get(contractDetail, 'state', undefined))
              : '--'
          }
        </Form.Item>
      </Form>
    );
  };


  return (
    <React.Fragment>
      <Modal
        title="合同归属公司"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        {renderForm()}
      </Modal>
    </React.Fragment>
  );
};

const mapStateToProps = (
  { systemManage: { contractDetail } },
) => {
  return { contractDetail };
};

export default connect(mapStateToProps)(DetailModal);
