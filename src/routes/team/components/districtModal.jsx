/**
 * 公共组件 - 商圈弹窗
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import React from 'react';
import { Modal, Button } from 'antd';

function DistrictModal(props) {
  const {
    dispatch,
    onDistrictHandleCancel,
    isDistrictModal,
  } = props;

  // 提交
  const onCreateModalHandleOk = () => {
    const { api = undefined, paramsInfo = {}, updateListCallback, onCancel, knightInfo } = props;
    // 获取商圈名称
    const districtId = knightInfo.map(item => item.biz_district_id);
    const payload = {
      ...paramsInfo, // 参数
      districtId, // 商圈ids
      onSuccessCallBack: () => {
        // 更新列表数据
        if (updateListCallback) {
          updateListCallback();
        }
        // 关闭当前弹窗
        if (onDistrictHandleCancel) {
          onDistrictHandleCancel();
        }
        // 重置父组件表单
        if (onCancel) {
          onCancel();
        }
      },
    };
    dispatch({ type: api, payload });
  };

  // 新增业主弹窗点击取消回调
  const onCreateModalHandleCancel = () => {
    const { onClickUpdateOwner, detail } = props;
    // 调取回凋
    if (onDistrictHandleCancel) {
      onDistrictHandleCancel();
    }
    // 开启父组件的弹窗
    if (onClickUpdateOwner) {
      onClickUpdateOwner(detail);
    }
  };

  // 不移商圈出账号
  const onCreateModalHandleNo = () => {
    const { api = undefined, paramsInfo = {}, updateListCallback, onCancel } = props;
    const payload = {
      ...paramsInfo, // 参数
      onSuccessCallBack: () => {
        // 关闭当前弹窗
        if (onDistrictHandleCancel) {
          onDistrictHandleCancel();
        }
        // 更新列表数据
        if (updateListCallback) {
          updateListCallback();
        }
        // 重置父组件表单
        if (onCancel) {
          onCancel();
        }
      },
    };
    dispatch({ type: api, payload });
  };

  // 渲染内容
  const renderContent = () => {
    const { detail } = props;
    const { knightInfo } = props;
    const data = is.not.empty(knightInfo) && knightInfo.length > 0 ? knightInfo : [];
    const name = dot.get(detail, 'staff_info.name') ? dot.get(detail, 'staff_info.name', '--') : dot.get(detail, 'owner_info.staff_info.name');
    // 获取商圈名称
    const districtName = data.map(item => item.biz_district_name);
    return (
      <div style={{ textAlign: 'center' }}>
        <span>{`是否同时将${name || '--'}的骑士账号移出`}</span>
        <a>{districtName && is.not.empty(districtName) ? districtName.join(',') : ''}</a>
        <span>（当前业主有骑士身份的商圈）？</span>
      </div>
    );
  };

  return (
    <Modal
      visible={isDistrictModal}
      onOk={onCreateModalHandleOk}
      onCancel={onCreateModalHandleCancel}
      footer={[
        <Button key="yes" type="primary" onClick={onCreateModalHandleOk}>
          是
        </Button>,
        <Button key="no" onClick={onCreateModalHandleNo}>
          否
        </Button>,
      ]}
    >
      {/* 渲染信息内容 */}
      {renderContent()}
    </Modal>
  );
}


const mapStateToProps = ({ teamManager }) => {
  return { teamManager };
};

export default connect(mapStateToProps)(DistrictModal);
