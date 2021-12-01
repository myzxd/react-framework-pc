/**
 * 公用组件，成员列表信息
 */
import dot from 'dot-prop';
import is from 'is_js';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio } from 'antd';
import moment from 'moment';

import { CoreForm, CoreContent } from '../../../../components/core';
import EmployeeSelect from './employeeOld';
import { TeamEffectiveDateState, TeamOwnerManagerState } from '../../../../application/define';
import DistrictModal from '../../components/districtModal';

function ComponentUpdateOwnerModal(props) {
  const [form] = Form.useForm();
  const [managerDetail, setManagerDetail] = useState({});
  const [isDistrictModal, setIsDistrictModal] = useState(false);
  const [paramsInfo, setParamsInfo] = useState({});
  const [knightInfo, setKnightInfo] = useState({});
  const [detail, setDetail] = useState({});

  useEffect(() => {
    const { visible } = props;
    if (visible && is.not.empty(props.detail)) {
      setDetail(props.detail);
    }
  }, [props.visible]);

  // 改变身份证号
  const onChangeManager = (id, info) => {
    setManagerDetail(info);
    form.setFieldsValue({ planDoneDate: undefined });
  };

  // 弹框关闭
  const onCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
    // 重置骑上商圈
    setKnightInfo({});
    setManagerDetail({});
    form.resetFields();
  };

  // 弹框确认
  const onOk = () => {
    // Modal 的确认按钮在 Form 之外，通过 form.submit 方法调用表单提交功能。
    form.submit();
  };

  // 成功回调
  const onSuccessCallBack = (res, params) => {
    const { getFieldValue } = form;
    if (is.not.empty(res) && is.existy(res) && getFieldValue('planDoneDate') === TeamEffectiveDateState.sameMonth) {
      // 隐藏弹窗
      if (props.onCancel) {
        props.onCancel();
      }
      // 获取骑士商圈信息
      setKnightInfo(res);
      setIsDistrictModal(true);
    } else {
      props.dispatch({
        type: 'teamManager/updateOwnerteamManagers',
        payload: {
          ...params,
          onSuccessCallBack: () => {
            // 调取更新接口
            if (props.onSuccessCallBack) {
              props.onSuccessCallBack();
            }
            if (props.onCancel) {
              props.onCancel();
            }
            // 重置骑上商圈
            setKnightInfo({});
            setManagerDetail({});
            form.resetFields();
          },
        },
      });
    }
  };

  // 提交表单且数据验证成功后回调事件
  const onFinish = (values) => {
    let planDoneDate;
    // 立即生效
    if (values.planDoneDate === TeamEffectiveDateState.sameMonth || values.planDoneDate === TeamEffectiveDateState.perfect) {
      planDoneDate = Number(moment().format('YYYYMMDD'));
    }
    // 次月生效
    if (values.planDoneDate === TeamEffectiveDateState.nextMonth) {
      planDoneDate = Number(moment().subtract('month', -1).format('YYYYMM01'));
    }
    const params = {
      ...values,
      planDoneDate,
      ownerId: detail._id,
      staffId: managerDetail._id,
      district: detail.biz_district_ids,
    };
    setParamsInfo(params);
    props.dispatch({ type: 'teamManager/fetchTeamKnightDistrcit', payload: { ...params, onSuccessCallBack: (e) => { onSuccessCallBack(e, params); } } });
  };

  // 隐藏商圈弹窗
  const onDistrictHandleCancel = () => {
    setIsDistrictModal(false);
  };

  // 业主团队信息
  const renderOwnerTeaminformation = () => {
    const items = [
      <Form.Item
        label="团队ID"
      >
        <span>{detail._id || '--'}</span>
      </Form.Item>,
    ];
    return (
      <CoreContent title="业主团队信息">
        <CoreForm items={items} cols={1} />
      </CoreContent>
    );
  };

  // 渲染身份证号码
  const renderIdentityCardId = () => {
    if (detail.state === TeamOwnerManagerState.notEffect) {
      return detail.identity_card_id ? detail.identity_card_id : '--';
    }
    return dot.get(detail, 'staff_info.identity_card_id', '--');
  };

  // 变更前业主
  const renderUpdateBeforeOwner = () => {
    const staffInfo = detail.staff_info || {};
    const items = [
      {
        span: 10,
        render: <Form.Item
          label="身份证号"
        >
          <span>{renderIdentityCardId()}</span>
        </Form.Item>,
      },
      {
        span: 6,
        render: <Form.Item
          label="姓名"
        >
          <span>{staffInfo.name || '--'}</span>
        </Form.Item>,
      },
      <Form.Item
        label="手机号"
      >
        <span>{staffInfo.phone || '--'}</span>
      </Form.Item>,
      {
        span: 12,
        render: <Form.Item
          label="业主ID"
        >
          <span>{detail.staff_id || '--'}</span>
        </Form.Item>,
      },
    ];
    return (
      <CoreContent title="变更前业主">
        <CoreForm items={items} />
      </CoreContent>
    );
  };

  // 变更后业主
  const renderUpdateAfterOwner = () => {
    const { getFieldValue } = form;
    const items = [
      {
        span: 17,
        render: <Form.Item
          label="身份证号"
          name="idCard"
          help={managerDetail._id ? '' : '暂无档案的新业主,输入身份证号后点“确定”即邀请加入'}
          rules={[{ required: true, message: '请输入正确的身份证号' }]}
        >
          <EmployeeSelect style={{ width: '95%' }} onChange={onChangeManager} />
        </Form.Item>,
      },
      {
        span: 12,
        render: <Form.Item
          label="姓名"
        >
          <span>{managerDetail.name || '--'}</span>
        </Form.Item>,
      },
      {
        span: 12,
        render: <Form.Item
          label="手机号"
        >
          <span>{managerDetail.phone || '--'}</span>
        </Form.Item>,
      },
      {
        span: 24,
        render: <Form.Item
          label="生效日期"
          name="planDoneDate"
          rules={[{ required: true, message: '请选择生效日期' }]}
        >
          <Radio.Group>
            <Radio disabled={managerDetail._id && getFieldValue('idCard') ? false : true} value={TeamEffectiveDateState.sameMonth}>{TeamEffectiveDateState.description(TeamEffectiveDateState.sameMonth)}</Radio>
            <Radio disabled={managerDetail._id && getFieldValue('idCard') ? false : true} value={TeamEffectiveDateState.nextMonth}>{TeamEffectiveDateState.description(TeamEffectiveDateState.nextMonth)}</Radio>
            <Radio disabled={managerDetail._id === undefined && getFieldValue('idCard') ? false : true} value={TeamEffectiveDateState.perfect}>{TeamEffectiveDateState.description(TeamEffectiveDateState.perfect)}</Radio>
          </Radio.Group>
        </Form.Item>,
      },
    ];
    return (
      <CoreContent title="变更后业主">
        <CoreForm items={items} />
      </CoreContent>
    );
  };

  // 渲染是否移出商圈的弹窗
  const renderDistrictModl = () => {
    const { onClickUpdateOwner } = props;
    const api = 'teamManager/updateOwnerteamManagers';
    return <DistrictModal isDistrictModal={isDistrictModal} detail={detail} onDistrictHandleCancel={onDistrictHandleCancel} api={api} onClickUpdateOwner={onClickUpdateOwner} onCancel={onCancel} knightInfo={knightInfo} updateListCallback={props.onSuccessCallBack} paramsInfo={paramsInfo} />;
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
    >
      <Modal
        title="变更业主"
        visible={props.visible}
        width={650}
        onOk={onOk}
        onCancel={onCancel}
      >
        {/* 业主团队信息 */}
        {renderOwnerTeaminformation()}
        {/* 变更前业主 */}
        {renderUpdateBeforeOwner()}
        {/* 变更后业主 */}
        {renderUpdateAfterOwner()}
      </Modal>
      {/* 渲染移出商圈的弹窗 */}
      {renderDistrictModl()}
    </Form>
  );
}

export default ComponentUpdateOwnerModal;
