/**
 * 财商类 - 公司变更申请 - 详情
 */
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from 'antd';
import React, { useEffect } from 'react';
import { CoreContent, CoreForm, CoreFinder } from '../../../../../../components/core';
import { BusinessCompanyType, BusinessCompanyChangeType, Unit } from '../../../../../../application/define';

const { CoreFinderList } = CoreFinder;

function CompanyChangeDetail(props) {
  const {
    dispatch,
    businessCompanyDetail,
    query,
    oaDetail = {},
  } = props;

  // 接口请求
  useEffect(() => {
    // 请求接口
    if (oaDetail._id) {
      dispatch({ type: 'business/fetchBusinessFirmModifyOrderDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'business/fetchBusinessFirmModifyOrderDetail', payload: { id: query.id } });
    }
  }, [dispatch, query.id, oaDetail]);

  // // 渲染变更类型
  const renderChangeType = () => {
    if (dot.get(businessCompanyDetail, 'modify_type', []).length <= 0) {
      return '--';
    }
    return (
      <div>
        {
          dot.get(businessCompanyDetail, 'modify_type', []).map((item) => {
            if (dot.get(businessCompanyDetail, 'modify_type').length <= 1) {
              return (
                <span>{BusinessCompanyChangeType.description(item)}</span>
              );
            }
            return (
              <span>{`${BusinessCompanyChangeType.description(item)}、`}</span>
            );
          })
        }
      </div>
    );
  };


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
    const formItems = [
      <Form.Item
        label="公司名称"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'name', '--')}
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
        label="公司性质"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'firm_info.firm_type') ? BusinessCompanyType.description(dot.get(businessCompanyDetail, 'firm_info.firm_type')) : '--'}
      </Form.Item >,
      <Form.Item
        label="股东信息"
        {...formLayoutC3}
      >
        {dot.get(businessCompanyDetail, 'share_holder_info', '--')}
      </Form.Item >,
    ];
    const formItems2 = [
      <Form.Item
        label="变更类型"
        {...formLayoutC1}
      >
        {renderChangeType()}
      </Form.Item >,
      <Form.Item
        label="变更内容"
        {...formLayoutC1}
      >
        <span className="noteWrap">{dot.get(businessCompanyDetail, 'modify_content') || '--'}</span>
      </Form.Item >,
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
      <CoreContent title="公司变更申请表">
        <CoreForm items={formItems} cols={2} />
        <CoreForm items={formItems2} cols={1} />
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


export default connect(mapStateToProps)(CompanyChangeDetail);
