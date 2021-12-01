/**
 * 财商类 - 银行开户 - 详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import React, { useEffect } from 'react';
import { CoreContent, DeprecatedCoreForm, CoreFinder } from '../../../../../../components/core';
import {
  BusinesBankAccountType,
  SharedBankCurrency,
  SharedBankOnlineBankType,
  SharedBankOpenAccountInfoType,
  SharedBankAccountSystem,
} from '../../../../../../application/define';

const { CoreFinderList } = CoreFinder;

function BankAccountDetail(props) {
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
    const {
      currency, // 币种
      online_banking: onlineBank, // 网银
      online_custodian_employee_list: onlineBankCustodian, // 网银保管人
      bank_user_contact_name: contactPerson, // 银行联系人
      bank_user_contact_way: contactPhone, // 银行联系方式
      opened_data: openAccountInformation, // 开户资料
      opened_data_desc: openAccountNote, // 开户资料说明
      opened_custodian_employee_info: openedCustodian, // 开户保管人
    } = businessBankDetail;
    const formItems = [
      {
        label: '公司名称',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBankDetail, 'firm_info.name', '--'),
      },
      {
        label: '账户类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBankDetail, 'bank_card_type') ? BusinesBankAccountType.description(dot.get(businessBankDetail, 'bank_card_type')) : '--',
      },
      {
        label: '开户银行支行全称',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBankDetail, 'bank_and_branch', '--'),
      },
      {
        label: '开户时间',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBankDetail, 'bank_opened_date') ? moment(`${dot.get(businessBankDetail, 'bank_opened_date')}`).format('YYYY-MM-DD') : '--',
      },
      {
        label: '币种',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: currency ? SharedBankCurrency.description(currency) : '--',
      },
      {
        label: '网银',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: onlineBank ? SharedBankOnlineBankType.description(onlineBank) : '--',
      },
      {
        label: '网银保管人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: Array.isArray(onlineBankCustodian) && onlineBankCustodian.length > 0
          ? onlineBankCustodian.map(i => i.name).join('，')
          : '--',
      },
      {
        label: '银行联系人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: contactPerson || '--',
      },
      {
        label: '银行联系方式',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: contactPhone || '--',
      },
      {
        label: '开户保管人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(openedCustodian, 'name', '--'),
      },
      {
        label: '账户体系',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: SharedBankAccountSystem.description(dot.get(businessBankDetail, 'account_system')),
      },
      {
        label: '开户资料',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: (
          <div>
            {
              Array.isArray(openAccountInformation) && openAccountInformation.length > 0 ? openAccountInformation.map(i => SharedBankOpenAccountInfoType.description(i)).join('、') : '--'
            }
          </div>
        ),
      },
    ];

    Array.isArray(openAccountInformation) && openAccountInformation.includes(SharedBankOpenAccountInfoType.other) && (formItems[formItems.length] = {
      label: '开户资料说明',
      span: 24,
      layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
      form: <span className="noteWrap">{openAccountNote || '--'}</span>,
    }
    );

    formItems.push(
      {
        label: '申请原因及说明',
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
      <CoreContent title="银行开户信息">
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

export default connect(mapStateToProps)(BankAccountDetail);
