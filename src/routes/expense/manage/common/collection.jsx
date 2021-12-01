/**
 * 费用单收款信息组件
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  CheckCircleOutlined,
} from '@ant-design/icons';

import { DeprecatedCoreForm, CoreContent } from '../../../../components/core';
import CollectionItem from './collectionItem';
import style from './styles.less';
import { ExpenseCollectionType, PayModeEnumer, Unit } from '../../../../application/define';
import { isProperIdCardNumber } from '../../../../application/utils';

const reg = new RegExp('^[1][3,4,5,6,7,8,9][0-9]{9}$');

class Collection extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  // 校验金额集合
  onValidatorBankListMoney = (rule, value, callback) => {
    const totalMoney = Number(this.props.totalMoney || 0).toFixed(2);
    if (value) {
      value.forEach((v, i) => {
        if (!v.card_name || !v.bank_details || !v.card_num || typeof v.money !== 'number') {
          callback(`第${i + 1}行内容: 收款人，开户支行，收款账户，金额，身份证号码请填写完整`);
          return true;
        }
        if (v.payment === PayModeEnumer.idCard && !v.id_card_no) {
          callback('请输入证件号码');
          return true;
        }

        if (v.payment === PayModeEnumer.idCard && !isProperIdCardNumber(v.id_card_no)) {
          callback('请输入正确的身份证号');
          return true;
        }
        if (v.card_phone) {
          if (!reg.test(v.card_phone)) {
            callback(`第${i + 1}行内容: 手机号格式错误`);
            return true;
          }
        }
      });
    }
    // 金额汇总
    const bankMoneys = value.map(item => Number(item.money || 0));
    // 金额之和
    const moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
    // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    if (Number(calculationMoney) !== 0) {
      callback('收款信息金额与费用总金额不一致');
      return;
    }
    callback();
  }

  // 渲染主体
  renderContent = () => {
    const {
      form = {},
      isClassName,
      isHouse,
      detail = {},
    } = this.props;
    const { getFieldDecorator } = form;
    const data = dot.get(detail, 'payeeList', []).length === 0 ?
      [{ payee_type: ExpenseCollectionType.onlineBanking, num: 1 }] :
      dot.get(detail, 'payeeList', []).map(v => ({ ...v, flag: true }));
    const payeeList = data.map((v, i) => {
      const item = { ...v };
      // 判断金额类型
      if (typeof v.money === 'number') {
        item.money = Unit.exchangePriceToYuan(v.money);
      }
      item.num = i + 1; // 唯一key
      return item;
    });
    const formItems = [
      {
        label: '',
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: getFieldDecorator('bankList', {
          rules: [{ validator: this.onValidatorBankListMoney }],
          initialValue: payeeList,
        })(
          <CollectionItem {...this.props} />,
        ),
      },
    ];
    // 判断是否是房屋模块
    if (isHouse) {
      return (
        <DeprecatedCoreForm items={formItems} />
      );
    }
    return (
      <CoreContent
        title="支付信息"
        className={isClassName ? style['app-comp-expense-manage-collection-adjust'] : style['app-comp-expense-manage-collection']}
      >
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

  // 计算金额
  renderCalculationMoney = () => {
    const { form = {} } = this.props;
    const totalMoney = Number(this.props.totalMoney || 0).toFixed(2);
    const bankList = form.getFieldValue('bankList');
    // 金额汇总
    const bankMoneys = bankList.map(item => Number(item.money || 0));
    // 金额之和
    let moneys = 0;
    if (bankMoneys.length > 0) {
      moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
    }
    // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    return (
      <div style={{ textAlign: 'center' }}>
        <span>费用总金额：{totalMoney}元</span>
        <span style={{ marginLeft: 20 }}>当前合计金额：{moneys}元</span>
        {
          Number(calculationMoney) === 0 ? (
            <CheckCircleOutlined
              style={{ marginLeft: 20, color: '#52c41a' }}
            />) : (
              <span style={{ marginLeft: 20 }}>差额：<span
                style={{ color: 'red' }}
              >{calculationMoney}</span> 元</span>
            )
        }
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        {/* 渲染每项 */}
        {this.renderContent()}
        {/* 计算金额 */}
        {this.renderCalculationMoney()}
      </React.Fragment>
    );
  }
}

function mapStateToProps({ expenseCostOrder: { collection } }) {
  return { collection };
}

export default connect(mapStateToProps)(Collection);
