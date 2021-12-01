/**
 * 行政类 - 奖惩通知申请 - 详情 /Oa/Document/Pages/Administration/Reward/Detail
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Form } from 'antd';

import { PageUpload } from '../../../components/index';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { AdministrationRewardWay, Unit } from '../../../../../../application/define';

const DetailRewardSeal = (props) => {
  const {
    rewardDetail,
    dispatch,
    query,
    oaDetail = {},
  } = props;
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({ type: 'administration/fetchRewardDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'administration/fetchRewardDetail', payload: { id: query.id } });
    }
    return () => { dispatch({ type: 'administration/resetRewardDetail' }); };
  }, [dispatch, query, oaDetail]);


  const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };

  // 渲染奖惩信息
  const renderSeal = () => {
    const formItems = [
      <Form.Item
        label="员工姓名"
        {...formLayoutC3}
      >
        {dot.get(rewardDetail, 'order_employee_info.name') || '--'}
      </Form.Item>,
      <Form.Item
        label="所属部门"
        {...formLayoutC3}
      >
        {dot.get(rewardDetail, 'department_info.name') || '--'}
      </Form.Item>,
      <Form.Item
        label="岗位"
        {...formLayoutC3}
      >
        {dot.get(rewardDetail, 'job_info.name') || '--'}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="奖惩措施"
        {...formLayoutC1}
      >
        {rewardDetail.prize_opt ?
          rewardDetail.prize_opt.map((item, index) =>
          (<span style={{ marginRight: '20px' }} key={index}>{AdministrationRewardWay.description(item)}</span>))
          : '--'}
      </Form.Item>,
    ];
    const formItems3 = [
      <Form.Item
        label="奖惩金额"
        {...formLayoutC3}
      >
        {rewardDetail.money ? Unit.exchangePriceToYuan(rewardDetail.money) : '--'}
      </Form.Item>,
      <Form.Item
        label="奖惩积分"
        {...formLayoutC3}
      >
        {dot.get(rewardDetail, 'integral') || '--'}
      </Form.Item>,
    ];
    const formItems4 = [
      <Form.Item
        label="奖惩原因"
        {...formLayoutC1}
      >
        <span className="noteWrap">{dot.get(rewardDetail, 'note') || '--'}</span>
      </Form.Item>,
      <Form.Item
        label="上传附件"
        {...formLayoutC1}
      >
        <PageUpload
          domain={PageUpload.UploadDomains.OAUploadDomain}
          displayMode
          value={PageUpload.getInitialValue(rewardDetail, 'asset_infos')}
        />
      </Form.Item>,
    ];
    return (
      <CoreContent title="奖惩信息">
        <CoreForm items={formItems} />
        <CoreForm items={formItems2} cols={1} />
        <CoreForm items={formItems3} />
        <CoreForm items={formItems4} cols={1} />
      </CoreContent>
    );
  };
  return (
    <Form>
      {renderSeal()}
    </Form>
  );
};
function mapPropsToState({ administration: { rewardDetail } }) {
  return { rewardDetail };
}
export default connect(mapPropsToState)(DetailRewardSeal);
