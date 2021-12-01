/**
 * 房屋信息
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import HouseInfoComponent from '../houseContract/detail';
import style from './styles.less';

class HouseInfo extends Component {

  static propTypes = {
    contractId: PropTypes.string.isRequired, // 合同id
    isExternal: PropTypes.bool, // 外部审批单字段
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowInfo: false,     // 是否显示房屋详细信息
    };
  }

  componentDidMount() {
    const { dispatch, contractId, isExternal = false } = this.props;

    // 外部审批单不调用接口
    if (contractId === '' || isExternal) return;

    // 获取房屋合同详情数据
    dispatch({
      type: 'expenseHouseContract/fetchHouseContractsDetail',
      payload: { id: contractId },
    });

    // 获取费用单列表数据
    dispatch({
      type: 'expenseCostOrder/fetchCostOrders',
      payload: {
        bizExtraHouseContractId: contractId,
        // TODO: 加分页
        limit: 9999,
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.contractId === '' || this.props.contractId === prevProps.contractId || prevProps.isExternal) return;
    // 获取费用单列表数据
    this.props.dispatch({
      type: 'expenseHouseContract/fetchHouseContractsDetail',
      payload: { id: this.props.contractId },
    });
    // 获取费用单列表数据
    this.props.dispatch({
      type: 'expenseCostOrder/fetchCostOrders',
      payload: {
        bizExtraHouseContractId: this.props.contractId,
        // TODO: 加分页
        limit: 9999,
      },
    });
  }

  // 点击展示基本信息
  checkShowInfo = () => {
    this.setState({
      isShowInfo: !this.state.isShowInfo,
    });
  }

  // 房屋详细信息
  renderHouseInfo = () => {
    const { isReset, contractId, isExternal } = this.props;
    return (
      <HouseInfoComponent isReset={isReset} contractId={contractId} isExternal={isExternal} />
    );
  }

  render() {
    const { isShowInfo } = this.state;
    return (
      <div>
        <div
          className={style['app-comp-expense-manage-common-house-info']}
          onClick={this.checkShowInfo}
        >
          房屋信息
          {
            isShowInfo ?
              <UpOutlined className={style['app-comp-expense-manage-common-house-info-icon']} /> :
              <DownOutlined className={style['app-comp-expense-manage-common-house-info-icon']} />
          }
        </div>
        {
          !isShowInfo || this.renderHouseInfo()
        }
      </div>
    );
  }
}

function mapStateToProps({ expenseHouseContract }) {
  return { expenseHouseContract };
}

export default connect(mapStateToProps)(HouseInfo);
