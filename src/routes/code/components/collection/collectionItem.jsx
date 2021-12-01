/**
 * 费用单收款信息组件
 * 这个是code/team下的 支付明细 模版
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Radio, InputNumber, Row, Col, Button } from 'antd';
import { connect } from 'dva';

import { Unit, ExpenseCollectionType } from '../../../../application/define';
import CollectionCardNum from './collectionCardNum'; // 收款账户
import CollectionBankDetails from './collectionBankDetails'; // 开户支行
import CollectionCardName from './collectionCardName'; // 收款人
import CollectionCardPhone from './collectionCardPhone'; // 手机号
import styles from './styles.less';


class CollectionItem extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  // 改变收款人
  onChangeCardName = (e, i) => {
    const { value, dispatch, formKey } = this.props;
    // 去空格
    value[i].card_name = String(e).replace(/\s*/g, '');
    value[i].card_phone = undefined;
    value[i].bank_details = undefined;
    value[i].card_num = undefined;
    value[i].flag = false;
    // 清空手机号数据
    dispatch({
      type: 'expenseCostOrder/reduceCollectionCardPhone',
      payload: {
        namespace: `namespaceCardPhone${formKey}${value[i].num}`, // 命名空间
        result: {},
      },
    });
    if (this.props.onChange) {
      // 判断收款人和收款手机号是否有值
      if (value[i].card_phone && e) {
        value[i].loading = true;
        this.props.dispatch({
          type: 'employeeManage/fetchEmployeeDetail',
          payload: {
            phone: value[i].card_phone,
            name: e,
            fileType: 'staff',
            onSuccessCallback: result => this.onSuccessCallback(result, i), // 成功的档案
          } });
      } else {
        value[i].payee_type = ExpenseCollectionType.onlineBanking;
        value[i].payee_employee_id = undefined;
        value[i].flag = false;
        value[i].card_phone = undefined;
      }
      this.props.onChange([...value]);
    }
  }

  // 改变开户行
  onChangeBankName = (e, i) => {
    const { value } = this.props;
    value[i].bank_details = e;
    value[i].card_num = undefined;
    value[i].flag = false;
    if (this.props.onChange) {
      this.props.onChange([...value]);
    }
  }

  // 改变收款账户
  onChangeCardNum = (e, i) => {
    const { value } = this.props;
    value[i].card_num = e;
    value[i].flag = false;
    if (this.props.onChange) {
      this.props.onChange([...value]);
    }
  }

  // 改变金额
  onChangeBankMoney = (e, i) => {
    const { value } = this.props;
    // 判断是否有数据
    if (is.not.existy(e) || is.empty(e)) {
      value[i].money = undefined;
    } else {
      value[i].money = e;
      // 判断金额是否大于最大金额
      if (e > Unit.maxMoney) {
        value[i].money = Unit.maxMoney;
      }
    }
    if (this.props.onChange) {
      this.props.onChange([...value]);
    }
  }

  // 手机号
  onChangePhone = (e, i) => {
    const { value } = this.props;
    value[i].card_phone = e;
    value[i].flag = false;
    if (this.props.onChange) {
      value[i].loading = true;
      // 判断收款人和收款手机号是否有值
      if (value[i].card_name && e) {
        this.props.dispatch({
          type: 'employeeManage/fetchEmployeeDetail',
          payload: {
            phone: e,
            name: value[i].card_name,
            fileType: 'staff',
            onSuccessCallback: result => this.onSuccessCallback(result, i), // 成功的档案
          } });
      }
      this.props.onChange([...value]);
    }
  }

  // 收款方式
  onChangeBankType = (e, i) => {
    const { value } = this.props;
    value[i].payee_type = e.target.value;
    if (this.props.onChange) {
      this.props.onChange([...value]);
    }
  };

    // 成功回调
  onSuccessCallback = (result, i) => {
    const { value } = this.props;
    value[i].loading = false;
    // 判断无数据
    if (is.not.existy(result) || is.empty(result)) {
        // 没数据时，档案id清空，收款类型重置成网银
      value[i].payee_employee_id = undefined;
      value[i].payee_type = ExpenseCollectionType.onlineBanking;
      value[i].flag = false;
      if (this.props.onChange) {
        this.props.onChange([...value]);
      }
      return;
    }
      // 判断有数据
    if (is.existy(result) && is.not.empty(result)) {
      // 修改档案id
      value[i].payee_employee_id = result._id;
      // 自动跳转钱包
      value[i].payee_type = ExpenseCollectionType.wallet;
      value[i].flag = false;
      if (this.props.onChange) {
        this.props.onChange([...value]);
      }
    }
  }

  onCreate = (i) => {
    const { value } = this.props;
    const num = value[i].num + 1;
    if (this.props.onChange) {
      this.props.onChange([...value, { payee_type: ExpenseCollectionType.onlineBanking, num }]);
    }
  }

  onDelete = (key) => {
    const { value } = this.props;
    const filterValue = value.filter((v, i) => i !== key);
    if (this.props.onChange) {
      this.props.onChange([...filterValue]);
    }
  }

  // 渲染每项
  renderItem = (item, i) => {
    const {
      disabled,
      isUpdateRule,
      value = {},
      formKey,
    } = this.props;
    // 收款人
    const cardName = dot.get(item, 'card_name', undefined);
    // 收款信息
    const formItems = [
      {
        label: (<span className={styles['label-required']}>收款人</span>),
        render: (
          <CollectionCardName
            value={cardName}
            namespace={`namespaceCardName${formKey}${item.num}`}
            placeholder="请填写收款人"
            onChange={e => this.onChangeCardName(e, i)}
            style={{ width: '100%' }}
            disabled={isUpdateRule || disabled}
          />
        ),
      },
      {
        label: (
          // 判断收款方式为钱包显示样式
          dot.get(item, 'payee_type', undefined) === ExpenseCollectionType.wallet
          ? <span className={styles['label-required']}>手机号</span> : '手机号'),
        render: (
          <CollectionCardPhone
            value={dot.get(item, 'card_phone', undefined)}
            namespace={`namespaceCardPhone${formKey}${item.num}${cardName}`}
            card_name={cardName}
            disabled={isUpdateRule || disabled}
            onChange={e => this.onChangePhone(e, i)}
            update={value[i].flag}
            placeholder="请输入手机号"
          />
        ),
      },
      {
        label: '收款方式',
        render: (
          <Radio.Group
            value={dot.get(item, 'payee_type', undefined)}
            style={{ display: 'flex' }}
            disabled={isUpdateRule || disabled}
            onChange={e => this.onChangeBankType(e, i)}
          >
            <Radio
              disabled={!dot.get(item, 'payee_employee_id', undefined)}
              value={ExpenseCollectionType.wallet}
            >{ExpenseCollectionType.description(ExpenseCollectionType.wallet)}</Radio>
            <Radio value={ExpenseCollectionType.onlineBanking}>{ExpenseCollectionType.description(ExpenseCollectionType.onlineBanking)}</Radio>
          </Radio.Group>
        ),
      },
      {
        label: (<span className={styles['label-required']}>开户支行</span>),
        render: (
          <CollectionBankDetails
            value={dot.get(item, 'bank_details', undefined)}
            namespace={`namespaceBankDetails${formKey}${item.num}${cardName}`}
            placeholder="请填写开户支行"
            card_name={cardName}
            onChange={e => this.onChangeBankName(e, i)}
            update={item.flag}
            disabled={isUpdateRule || disabled}
          />
        ),
      },
      {
        label: (<span className={styles['label-required']}>收款账户</span>),
        render: (
          <CollectionCardNum
            value={dot.get(item, 'card_num', undefined)}
            namespace={`namespaceCardNum${formKey}${item.num}${cardName}`}
            placeholder="请填写收款账号"
            card_name={cardName}
            bank_details={dot.get(item, 'bank_details', undefined)}
            update={item.flag}
            onChange={e => this.onChangeCardNum(e, i)}
            disabled={isUpdateRule || disabled}
          />
        ),
      },
      {
        label: (<span className={styles['label-required']}>金额(元)</span>),
        render: (
          <InputNumber
            value={dot.get(item, 'money', undefined)}
            style={{ width: '100%' }}
            onChange={e => this.onChangeBankMoney(e, i)}
            precision={2}
            min={0.01}
            max={Unit.maxMoney}
            formatter={Unit.maxMoneyLimitDecimalsFormatter}
            parser={Unit.limitDecimalsParser}
            placeholder="请填写金额"
          />
        ),
      },
    ];
    return (
      <Row key={item.num}>
        <Col span={22}>
          <Row>
            {
              formItems.map((v, j) => {
                return (
                  <Col key={j} span={8} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <Col style={{ textAlign: 'right', marginRight: 10 }} span={8}>{v.label}: </Col>
                    <Col span={14}>{v.render}</Col>
                  </Col>
                );
              })
            }
          </Row>
        </Col>
        <Col span={2}>
          {value.length !== 1 ?
            (<Button
              size="small"
              onClick={() => this.onDelete(i)}
              style={{ marginRight: 10, marginTop: 13 }}
              disabled={isUpdateRule || disabled}
              shape="circle"
              icon={<MinusOutlined />}
            />
          ) : null}
          {/* 最后一位显示添加按钮 */}
          {value.length - 1 === i ?
            (<Button
              size="small"
              style={{ marginTop: 13 }}
              onClick={() => this.onCreate(i)}
              disabled={isUpdateRule || disabled}
              shape="circle"
              icon={<PlusOutlined />}
            />
            ) : null}
        </Col>
      </Row>
    );
  }

  // 渲染内容
  renderContent = () => {
    const { value = [] } = this.props;
    return value.map((item, i) => {
      return this.renderItem(item, i);
    });
  };

  render() {
    return (
      <React.Fragment>
        {/* 渲染内容 */}
        {this.renderContent()}
      </React.Fragment>
    );
  }

}


export default connect()(CollectionItem);
