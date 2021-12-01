/**
 * 借款单详情 - 借款信息
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';

import React, { Component } from 'react';

import { DeprecatedCoreForm, CoreContent, CoreFinder } from '../../../../../components/core';
import { Unit, BorrowType, RepayMethod, RepayCircle } from '../../../../../application/define';

const { CoreFinderList } = CoreFinder;

const Panel = Collapse.Panel;

class BorrowingInfo extends Component {
  static propTypes = {
    borrowingDetail: PropTypes.object, // 借款单信心
  }

  static defaultProps = {
    borrowingDetail: {}, // 借款单信息
  }

  // 借款人信息
  renderBorrowingPeopleInfo = (record) => {
    const { platform_code: platformCode } = record;
    // 正常借款单
    const normalItems = [
      {
        label: '平台',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'platform_name', undefined) || '--',
      },
      {
        label: '供应商',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'supplier_name', undefined) || '--',
      }, {
        label: '城市',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'city_name', undefined) || '--',
      }, {
        label: '商圈',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'biz_district_name', undefined) || '--',
      }, {
        label: '实际借款人',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'actual_loan_info.name', '--'),
      },
    ];

    const headquartersItems = [
      {
        label: '实际借款人',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'actual_loan_info.name', '--'),
      }, {
        label: '团队信息',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'actual_loan_info.department_name', '--'),
      },
    ];

    // 平台为总部时，渲染对应字段
    const items = platformCode === 'zongbu' ? headquartersItems : normalItems;

    const formItems = [
      ...items,
      {
        label: '身份证号码',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'actual_loan_info.identity', '--'),
      }, {
        label: '借款联系人方式',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'actual_loan_info.phone', '--'),
      }, {
        label: '收款账户',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'payee_account_info.card_num', '--'),
      }, {
        label: '开户支行',
        span: 10,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: dot.get(record, 'payee_account_info.bank_details', '--'),
      },
    ];
    return (
      <CoreContent title="借款人信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

   // 预览组件
  renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.file_url')) {
      const data = value.map((item) => {
        return { key: item.file_name, url: item.file_url };
      });
      return (
        <CoreFinderList data={data} enableTakeLatest={false} />
      );
    }
    return '--';
  };


  // 借款信息
  renderBorrowingInfo = (record) => {
    const formItems = [
      {
        label: '借款金额 (元)',
        form: dot.get(record, 'loan_money', 0) ? Unit.exchangePriceCentToMathFormat(dot.get(record, 'loan_money', 0)) : '--',
      },
      {
        label: '借款类型',
        form: dot.get(record, 'loan_type', 0) ? BorrowType.description(dot.get(record, 'loan_type', 0)) : '--',
      },
      {
        label: '借款事由',
        form: <span className="noteWrap">{dot.get(record, 'loan_note', '--') || '--'}</span>,
      }, {
        label: '上传附件',
        form: this.renderCorePreview(dot.get(record, 'assert_file_list', [])),
      },
    ];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <CoreContent title="借款信息">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  // 还款方式
  renderRepaymentsInfo = (record) => {
    const formItems = [
      {
        label: '还款方式',
        form: dot.get(record, 'repayment_method', 0) ? RepayMethod.description(dot.get(record, 'repayment_method', 0)) : '--',
      },
      {
        label: '还款周期',
        form: dot.get(record, 'repayment_cycle', 0) ? RepayCircle.description(dot.get(record, 'repayment_cycle', 0)) : '--',
      }, {
        label: '预计还款时间',
        form: dot.get(record, 'expected_repayment_time', undefined) || '--',
      },
    ];
    const layout = { labelCol: { span: 7 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="还款信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render = () => {
    const { borrowingDetail } = this.props;

    // 数据为空，返回null
    if (Object.keys(borrowingDetail).length === 0) return null;

    return (
      <CoreContent title="借款单">
        <Collapse bordered={false} defaultActiveKey={['0']}>
          {
            [borrowingDetail].map((item, index) => {
              const header = `${'借款单号:'} ${item._id}`;
              return (
                <Panel header={header} key={index}>
                  {/* 渲染借款人信息 */}
                  {this.renderBorrowingPeopleInfo(item)}

                  {/* 渲染借款信息 */}
                  {this.renderBorrowingInfo(item)}

                  {/* 渲染还款信息 */}
                  {this.renderRepaymentsInfo(item)}
                </Panel>
              );
            })
          }
        </Collapse>

      </CoreContent>
    );
  }
}

export default BorrowingInfo;
