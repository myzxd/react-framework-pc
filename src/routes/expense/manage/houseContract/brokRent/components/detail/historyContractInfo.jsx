/**
 * 费用管理 / 房屋管理 / 断租编辑 / 历史合同信息
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';
import {
  Unit,
} from '../../../../../../../application/define';

class HistoryContractInfo extends Component {

  static propTypes = {
    detail: PropTypes.object, // 房屋信息
  };

  static defaultProps = {
    detail: {}, // 默认为空
  }

  // 渲染历史合同信息
  renderHistoryContractInfo = () => {
    // 房屋信息
    const { detail } = this.props;

    const {
      id, // 房屋合同id
      monthMoney, // 月租金
      pledgeMoney, // 押金
      agentMoney, // 中介费
      fileList, // 附件
      unrefundedPledgeMoney, // 未退押金
    } = detail;

    // 首行
    const firstLint = [
      {
        label: '合同编号',
        form: id,
      },
      {
        label: '附件',
        form: fileList,
      },
    ];

    const formItems = [
      {
        label: '押金金额（元）',
        form: pledgeMoney !== undefined
        ? Unit.exchangePriceToYuan(pledgeMoney)
        : '--',
      },
      {
        label: '未退押金（元）',
        form: unrefundedPledgeMoney !== undefined
        ? Unit.exchangePriceToYuan(unrefundedPledgeMoney)
        : '--',
      },
      {
        label: '月租金（元）',
        form: monthMoney !== undefined
        ? Unit.exchangePriceToYuan(monthMoney)
        : '--',
      },
      {
        label: '中介费（元）',
        form: agentMoney !== undefined
        ? Unit.exchangePriceToYuan(agentMoney)
        : '--',
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    // 列表扩展
    const titleExt = (
      <a
        key="detail"
        target="_blank"
        rel="noopener noreferrer"
        href={`/#/Expense/Manage/House/Detail?id=${id}`}
      >
        更多详情
      </a>
    );

    return (
      <CoreContent
        title="历史合同信息"
        titleExt={titleExt}
      >
        <DeprecatedCoreForm
          items={firstLint}
          cols={2}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={formItems}
          cols={4}
          layout={layout}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderHistoryContractInfo();
  }
}

export default HistoryContractInfo;
