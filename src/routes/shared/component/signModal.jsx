/**
 * 合同盖章/批量盖章 Modal
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
  Modal,
  Form,
  Input,
  Collapse,
  Button,
  message,
} from 'antd';
import { utils } from '../../../application';
import { OAContractStampType } from '../../../application/define';
import { CoreForm } from '../../../components/core';
import { PageUpload } from '../../oa/document/components/index';
import styles from './styles.less';

const { TextArea } = Input;
const { Panel } = Collapse;
const voidFunc = () => {};

SignModal.propTypes = {
  visible: PropTypes.bool, // Modal visible
  setSignModalVisible: PropTypes.func, // set Modal visible
  signType: PropTypes.string, // 单次盖章 or 批量盖章
  signContractInfo: PropTypes.object, // 单次盖章合同信息
  batchSignContractInfo: PropTypes.array, // 批量盖章合同信息
  selectedRowKeys: PropTypes.array, // table selectedRowKeys
  setSelectedRowKeys: PropTypes.func, // set table selectedRowKeys
  breakContractList: PropTypes.func, // 刷新列表
};
SignModal.defaultProps = {
  batchSignContractInfo: [],
  selectedRowKeys: [],
  setSelectedRowKeys: voidFunc,
  breakContractList: voidFunc,
};

function SignModal({
  visible,
  setSignModalVisible,
  signType,
  signContractInfo,
  batchSignContractInfo,
  selectedRowKeys,
  setSelectedRowKeys,
  breakContractList,
  sharedContractSign,
}) {
  const [form] = Form.useForm();
  // 盖章Modal确定按钮 loading
  const [confirmLoading, setConfirmLoading] = useState(false);
  // 批量盖章结果Modal visible
  const [signResVisible, setSignResVisible] = useState(false);
  // 盖章结果
  const [signRecords, setSignRecords] = useState([]);

  // 盖章Modal确定操作
  const signHandleOk = async () => {
    // 确定按钮 loading
    setConfirmLoading(true);
    let params;
    const formValues = await form.validateFields();
    // 单次盖章
    if (signType === 'sign') {
      params = {
        ...formValues,
        contractIds: [signContractInfo._id],
      };
    // 批量盖章
    } else {
      params = {
        ...formValues,
        contractIds: selectedRowKeys,
      };
    }
    // 调用盖章接口
    const result = await sharedContractSign({ ...params });
    const res = result[0] || {};
    await utils.sleep(2000);
    // 确定按钮 loading
    setConfirmLoading(false);
    // 请求失败直接return
    if (!result) return;
    // 保存盖章结果
    setSignRecords(result);
    // 批量盖章时
    if (signType === 'batchSign') {
      // 显示盖章结果Modal
      setSignResVisible(true);
    // 单次盖章失败时
    } else if (res.msg) {
      message.error(res.msg);
    } else {
      message.success('盖章成功');
    }
    // 清空表单
    form.resetFields();
    // 隐藏盖章Modal
    setSignModalVisible(false);
    // 刷新列表
    breakContractList();
    // 清空选中的table项
    setSelectedRowKeys([]);
  };

  // 盖章Modal取消操作
  const signHandleCancel = () => {
    // 清空表单
    form.resetFields();
    // 隐藏盖章Modal
    setSignModalVisible(false);
  };

  // 渲染盖章弹窗
  const renderSignModal = () => {
    // 我方先盖章的合同
    const weFirstStamp = batchSignContractInfo.filter(item => item && item.stamp_type === OAContractStampType.weFirst);
    // 我方后盖章的合同
    const weNextStamp = batchSignContractInfo.filter(item => item && item.stamp_type === OAContractStampType.weNext);
    const renderSignItems = (SignItem) => {
      return (
        <div
          key={SignItem._id}
          className={signType === 'batchSign' ? styles['sign-modal-collapse-panel-item'] : undefined}
        >
          <p className={styles['sign-modal-info-wrap']}>
            <span className={styles['sign-modal-lable']}>合同名称：</span>
            <span className={styles['sign-modal-content']}>{SignItem.name || '--'}</span>
          </p>
          <p className={styles['sign-modal-info-wrap']}>
            <span className={styles['sign-modal-lable']}>签订单位：</span>
            <span className={styles['sign-modal-content']}>{utils.dotOptimal(SignItem, 'firm_info.name', '--')}</span>
          </p>
          <p className={styles['sign-modal-info-wrap']}>
            <span className={styles['sign-modal-lable']}>BOSS审批单号：</span>
            <span className={styles['sign-modal-content']}>{SignItem.application_order_id || '--'}</span>
          </p>
          <p className={styles['sign-modal-info-wrap']}>
            <span className={styles['sign-modal-lable']}>合同甲方：</span>
            <span className={styles['sign-modal-content']}>{SignItem.pact_part_a || '--'}</span>
          </p>
        </div>
      );
    };

    // formItem
    const formItem = [
      <Form.Item
        name="note"
        label="备注"
        rules={[{ pattern: /\S+/, message: '禁止输入空白字符' }]}
      >
        <TextArea rows={2} placeholder="请输入" />
      </Form.Item>,
    ];

    // 单次盖章时，可以上传附件
    if (signType === 'sign') {
      formItem[formItem.length] = (
        <Form.Item
          label="上传附件"
          name="assetKeys"
        >
          <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
        </Form.Item>
      );
    }

    return (
      <Modal
        title="确认盖章"
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={signHandleOk}
        onCancel={signHandleCancel}
      >
        {
          // 单次盖章时
          signType === 'sign'
          ? renderSignItems(signContractInfo)
          // 批量盖章时
          : <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            <Collapse
              defaultActiveKey={['weFirst', 'weNext']}
              bordered={false}
            >
              <Panel
                header={<span className={styles['sign-modal-collapse-panel-header']}>我方先章：{weFirstStamp.length}份合同</span>}
                key="weFirst"
                className={styles['sign-modal-collapse-panel']}
              >
                {weFirstStamp.map(item => renderSignItems(item))}
              </Panel>
              <Panel
                header={<span className={styles['sign-modal-collapse-panel-header']}>我方后章：{weNextStamp.length}份合同</span>}
                key="weNext"
                className={styles['sign-modal-collapse-panel']}
              >
                {weNextStamp.map(item => renderSignItems(item))}
              </Panel>
            </Collapse>
          </div>
        }
        {/* 渲染表单操作 */}
        <Form form={form} style={{ paddingTop: 20 }} className="affairs-flow-basic form-item-content-scroll">
          <CoreForm
            items={formItem}
            cols={1}
          />
        </Form>
      </Modal>
    );
  };

  // 渲染批量盖章结果弹窗
  const renderSignModalRes = () => {
    // 盖章类型为单次盖章
    if (signType === 'sign') return;
    // 盖章成功的合同
    const signSuccess = signRecords.filter(item => item && item.ok);
    // 盖章失败的合同
    const signFails = signRecords.filter(item => item && !item.ok);
    // 渲染盖章结果合同信息展示
    const renderSignResItems = (SignItem, PanelKey) => {
      return (
        <div
          key={SignItem._id}
          className={styles['sign-modal-collapse-panel-item']}
        >
          <p className={styles['sign-modal-info-wrap']}>
            <span className={styles['sign-modal-lable']}>合同名称：</span>
            <span className={styles['sign-modal-content']}>{SignItem.pact_name || '--'}</span>
          </p>
          <p className={styles['sign-modal-info-wrap']}>
            <span className={styles['sign-modal-lable']}>BOSS审批单号：</span>
            <span className={styles['sign-modal-content']}>{SignItem.application_order_id || '--'}</span>
          </p>
          {
            // 盖章失败
            PanelKey === 'fail'
            && <p className={styles['sign-modal-info-wrap']}>
              <span className={styles['sign-modal-lable']}>失败原因：</span>
              <span className={styles['sign-modal-content']}>{SignItem.msg || '--'}</span>
            </p>
          }
        </div>
      );
    };
    return (
      <Modal
        title={`${signSuccess.length}份合同盖章成功，${signFails.length}份合同盖章失败`}
        visible={signResVisible}
        onOk={() => { setSignResVisible(false); }}
        onCancel={() => { setSignResVisible(false); }}
        footer={
          <div className={styles['signres-modal-footer']}>
            <Button type="primary" onClick={() => { setSignResVisible(false); }}>知道了</Button>
          </div>
        }
      >
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          <Collapse
            defaultActiveKey={['fail', 'success']}
            bordered={false}
          >
            <Panel
              header={<span className={styles['sign-modal-collapse-panel-header']}>{signSuccess.length}份合同盖章成功</span>}
              key="success"
              className={styles['sign-modal-collapse-panel']}
            >
              {signSuccess.map(item => renderSignResItems(item, 'success'))}
            </Panel>
            <Panel
              header={<span className={styles['sign-modal-collapse-panel-header']}>{signFails.length}份合同盖章失败</span>}
              key="fail"
              className={styles['sign-modal-collapse-panel']}
            >
              {signFails.map(item => renderSignResItems(item, 'fail'))}
            </Panel>
          </Collapse>
        </div>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {/* 渲染盖章弹窗 */}
      {renderSignModal()}
      {/* 渲染批量盖章结果弹窗 */}
      {renderSignModalRes()}
    </React.Fragment>
  );
}

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  // 合同盖章
  sharedContractSign: payload => dispatch({
    type: 'sharedContract/sharedContractSign',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignModal);
