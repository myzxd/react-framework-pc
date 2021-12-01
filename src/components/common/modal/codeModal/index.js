/**
 * code弹框
 */
import dot from 'dot-prop';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, Transfer } from 'antd';

function CodeModal(props) {
  const { visible, dispatch, values, roleInfos = [] } = props;
  const [targetKeys, setTargetKeys] = useState([]);

  const data = dot.get(props, 'codeInformation', []);
  // 获取ids集合
  const roleInfoIds = roleInfos.map(v => v._id);
  // 数组对象筛选
  const dataSource = data.filter(v => !roleInfoIds.includes(v._id));
  useEffect(() => {
    dispatch({ type: 'adminManage/fetchSystemCodeInformation', payload: {} });
    () => {
      dispatch({ type: 'adminManage/reduceSystemCodeInformation', payload: {} });
    };
  }, [dispatch]);
  useEffect(() => {
    setTargetKeys(values);
  }, [values]);

    // code弹框确定
  const onOkCodeModal = () => {
    // 获取每一项的值
    const items = getTransferItems(targetKeys);
    if (props.onOk) {
      props.onOk(targetKeys, items);
    }
  };

    // code弹框取消
  const onCancelCodeModal = () => {
    setTargetKeys([]);
    if (props.onCancel) {
      props.onCancel();
    }
  };

  // 获取每项
  const getTransferItems = (keys = []) => {
    const items = dataSource.filter(v => keys.includes(v._id));
    return items;
  };

  // 穿梭框
  const onChangeTargetKeys = (keys) => {
    setTargetKeys(keys);
  };

    // code弹框
  const renderCodeModal = () => {
    if (visible !== true) {
      return null;
    }
    return (
      <Modal
        title="数据权限组"
        visible={visible}
        onOk={onOkCodeModal}
        onCancel={onCancelCodeModal}
        width={900}
      >
        <Transfer
          dataSource={dataSource}
          rowKey={record => record._id}
          titles={['全选／合计', '全选／合计']}
          showSearch
          targetKeys={targetKeys}
          onChange={onChangeTargetKeys}
          render={item => item.name}
          listStyle={{
            height: 400,
            width: 400,
          }}
        />
      </Modal>
    );
  };
  return (
    <React.Fragment>
      {renderCodeModal()}
    </React.Fragment>
  );
}

function mapStateToProps({ adminManage: { codeInformation } }) {
  return { codeInformation };
}
export default connect(mapStateToProps)(CodeModal);
