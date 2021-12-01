/**
 * 房屋详情 = 历史合同信息
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Unit } from '../../../../../../application/define';
import {
  CoreContent,
  DeprecatedCoreForm,
  CoreFinder,
} from '../../../../../../components/core';

import style from './style.css';

const { CoreFinderList } = CoreFinder;

class HistoryContract extends Component {
  static propTypes = {
    houseContractDetail: PropTypes.object, // 房屋详情数据
    isExternal: PropTypes.bool,
  };
  static defaultProps = {
    houseContractDetail: {}, // 默认为空
    isExternal: false,
  }

  // 预览组件
  renderCorePreview = (value, filename) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const data = value.map((item, index) => {
        return { key: filename[index], url: item };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };

  // 历史合同信息
  renderHistoryContract = () => {
    // 合同详情
    const { houseContractDetail = {}, isExternal = false } = this.props;
    // 历史合同信息
    const { fromContractInfo = {}, fromContractId } = houseContractDetail;

    // 历史合同无数据，不渲染
    if (!fromContractId || Object.keys(fromContractInfo).length === 0) {
      return null;
    }

    const {
      _id: id,
      agent_money: agentMoney,
      month_money: monthMoney,
      pledge_money: pledgeMoney,
      unrefunded_pledge_money: unrefundedPledgeMoney,
    } = fromContractInfo;

    // 历史合同信息
    const contract = [
      {
        label: '合同编号',
        form: id || '--',
      },
      {
        label: '附件',
        form: this.renderCorePreview(
          dot.get(fromContractInfo, 'attachment_private_urls', []),
          dot.get(fromContractInfo, 'attachments', []),
        ),
      },
    ];

    // 历史合同金额项
    const amount = [
      {
        label: '押金金额（元）',
        form: pledgeMoney !== undefined
        ? Unit.exchangePriceToYuan(pledgeMoney)
        : '--',
      },
      {
        label: '未退押金（元）',
        form: pledgeMoney !== undefined
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

    // 合同布局
    const contractLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    // 押金、租金等布局
    const amountLayout = {
      labelCol: {
        span: 12,
      },
      wrapperCol: {
        span: 12,
      },
    };

    // 查看历史合同
    const titleExt = Object.keys(fromContractInfo).length > 0 && fromContractId && !isExternal
      ? (<a
        key="detail"
        target="_blank"
        rel="noopener noreferrer"
        className={style['app-comp-expense-house-contract-detail-history']}
        href={`/#/Expense/Manage/House/Detail?id=${id}`}
      >
      更多详情
    </a>)
      : null;

    return (
      <CoreContent title="历史合同信息" titleExt={titleExt}>
        {/* 渲染历史合同信息 */}
        <DeprecatedCoreForm
          items={contract}
          cols={2}
          layout={contractLayout}
        />
        {/* 渲染历史合同金额项 */}
        <DeprecatedCoreForm
          items={amount}
          cols={4}
          layout={amountLayout}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderHistoryContract();
  }
}

export default HistoryContract;
