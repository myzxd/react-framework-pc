/**
 * 财商类 - 注销银行账户申请 - 详情
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import React, { useEffect } from 'react';
import { CoreContent, DeprecatedCoreForm, CoreFinder } from '../../../../../../components/core';
import { BusinesBankAccountType } from '../../../../../../application/define';

const { CoreFinderList } = CoreFinder;

function CancellationBankDetail(props) {
  const {
    dispatch,
    businessBankDetail,
    query,
    oaDetail = {},
  } = props;

  // 接口请求
  useEffect(() => {
    // 请求接口
    if (oaDetail._id) {
      dispatch({ type: 'business/fetchBusinessBankOrderDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'business/fetchBusinessBankOrderDetail', payload: { id: query.id } });
    }
  }, [dispatch, query.id, oaDetail]);

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
    const formItems = [
      {
        label: '公司名称',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBankDetail, 'firm_info.name', '--'),
      },
    ];
    formItems.push(
      {
        label: '银行账号',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBankDetail, 'bank_account_info.bank_card', '--'),
      },
      {
        label: '账户类型',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBankDetail, 'bank_account_info.bank_card_type') ? BusinesBankAccountType.description(dot.get(businessBankDetail, 'bank_account_info.bank_card_type')) : '--',
      },
      {
        label: '开户银行支行全称',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBankDetail, 'bank_account_info.bank_and_branch', '--'),
      },
      {
        label: '注销原因及说明',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: <span className="noteWrap">{dot.get(businessBankDetail, 'note', '--')}</span>,
      },
      {
        label: '上传附件',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: renderCorePreview(dot.get(businessBankDetail, 'asset_infos.asset_maps', [])),
      },
    );
    return (
      <CoreContent title="注销银行账户申请">
        <DeprecatedCoreForm items={formItems} />
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


const mapStateToProps = ({ business: { businessBankDetail } }) => {
  return { businessBankDetail };
};

export default connect(mapStateToProps)(CancellationBankDetail);
