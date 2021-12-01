/**
 * 财商类 - 注册公司申请 - 详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Form } from 'antd';
import { CoreContent, CoreForm, CoreFinder } from '../../../../../../components/core';
import { BusinessCompanyHandleType, BusinessCompanyType, Unit } from '../../../../../../application/define';

const { CoreFinderList } = CoreFinder;

function RegisteredCompanyDeail(props) {
  const {
    dispatch,
    businessCompanyDetail,
    query,
    oaDetail = {},
  } = props;
  const flag = query.id;

  // 接口请求
  useEffect(() => {
    // 请求接口
    if (oaDetail._id) {
      dispatch({ type: 'business/fetchBusinessFirmModifyOrderDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'business/fetchBusinessFirmModifyOrderDetail', payload: { id: flag } });
    }
  }, [dispatch, flag, oaDetail]);

   // 预览组件
  const renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.asset_url')) {
      const data = value.map((item) => {
        return { key: item.asset_key, url: item.asset_url };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };

  // 渲染表单
  const renderFrom = function () {
    const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    const formLayoutC1 = { labelCol: { span: 3 }, wrapperCol: { span: 16 } };
    const handleItems = [
      <Form.Item
        label="办理类型"
        {...formLayoutC1}
      >
        {dot.get(businessCompanyDetail, 'deal_type') ? BusinessCompanyHandleType.description(dot.get(businessCompanyDetail, 'deal_type')) : '--'}
      </Form.Item >,
    ];

    const formItems = [
      <Form.Item
        label="公司名称"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'name', '--')}
      </Form.Item >,
      <Form.Item
        label="公司性质"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'firm_type') ? BusinessCompanyType.description(dot.get(businessCompanyDetail, 'firm_type')) : '--'}
      </Form.Item >,
      <Form.Item
        label="法人代表"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'legal_name', '--')}
      </Form.Item >,
      <Form.Item
        label="注册资本"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'registered_capital') >= 0 ? <span>{`${Unit.exchangePriceToWanYuan(dot.get(businessCompanyDetail, 'registered_capital'))}万元`}</span> : '--'}
      </Form.Item >,
      <Form.Item
        label="注册时间"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'registered_date') ? moment(`${dot.get(businessCompanyDetail, 'registered_date')}`).format('YYYY-MM-DD') : '--'}
      </Form.Item >,
      <Form.Item
        label="注册地址"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'registered_address', '--')}
      </Form.Item >,
      <Form.Item
        label="股东信息"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'share_holder_info', '--')}
      </Form.Item >,
    ];
    // 判断类型是否添加注销时间
    if (dot.get(businessCompanyDetail, 'deal_type') === BusinessCompanyHandleType.cancellation) {
      formItems.push(
        <Form.Item
          label="注销时间"
          {...formLayoutC3}
        >
          {dot.get(businessCompanyDetail, 'cancel_date') ? moment(`${dot.get(businessCompanyDetail, 'cancel_date')}`).format('YYYY-MM-DD') : '--'}
        </Form.Item >,
      );
    }
    const publicItems = [
      <Form.Item
        label="申请原因及说明"
        {...formLayoutC1}
      >
        <span className="noteWrap">{dot.get(businessCompanyDetail, 'note') || '--'}</span>
      </Form.Item >,
      <Form.Item
        label="上传附件"
        {...formLayoutC1}
      >
        {renderCorePreview(dot.get(businessCompanyDetail, 'asset_infos.asset_maps', []))}
      </Form.Item >,
    ];
    return (
      <CoreContent title="注册/注销公司信息">
        <CoreForm items={handleItems} cols={1} />
        <CoreForm items={formItems} cols={2} />
        <CoreForm items={publicItems} cols={1} />
      </CoreContent>
    );
  };

  return (
    <Form layout="horizontal">
      {/* 渲染表单 */}
      {renderFrom()}
    </Form>
  );
}


const mapStateToProps = ({ business: { businessCompanyDetail } }) => {
  return { businessCompanyDetail };
};

export default connect(mapStateToProps)(RegisteredCompanyDeail);
