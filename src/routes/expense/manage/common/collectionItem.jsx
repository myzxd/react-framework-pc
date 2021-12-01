/**
 * 费用单收款信息组件
 */
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Radio, Input, InputNumber, message, Row, Col, Button } from 'antd';
import { connect } from 'dva';

import { ExpenseCollectionType, PayModeEnumer } from '../../../../application/define';
import { system } from '../../../../application';
import { DeprecatedCoreForm } from '../../../../components/core';
import CollectionCardNum from './collectionCardNum'; // 收款账户
import CollectionBankDetails from './collectionBankDetails'; // 开会支行
import CollectionCardName from './collectionCardName'; // 收款人
import CollectionCardPhone from './collectionCardPhone'; // 手机号
import styles from './styles.less';

const systemIdentifierFlag = system.isEnablExpenseCollectionPayeeType();

class CollectionItem extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    label: PropTypes.object, // label
    placeholder: PropTypes.object,
    disabled: PropTypes.bool,
    layout: PropTypes.object,
  }

  static defaultProps = {
    form: {},
    label: {},
    placeholder: {},
    disabled: false,
    layout: { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
  }

  constructor() {
    super();
    this.state = {
    };
  }

  // 改变收款人
  onChangeCardName = (e, i) => {
    const { value } = this.props;
    value[i].card_name = e;
    value[i].card_phone = undefined;
    value[i].bank_details = undefined;
    value[i].card_num = undefined;
    value[i].flag = false;
    if (this.props.onChange) {
      this.props.onChange([...value]);
      // 判断收款人和收款手机号是否有值，判断是否是趣活的
      if (value[i].card_phone && e && systemIdentifierFlag) {
        this.props.dispatch({
          type: 'employeeManage/fetchEmployeeDetail',
          payload: {
            phone: value[i].card_phone,
            name: e,
            fileType: 'staff',
            onSuccessCallback: result => this.onSuccessCallback(result, i), // 成功的档案
          },
        });
      } else {
          // 没数据时，档案id清空，收款类型重置成网银
        value[i].payee_employee_id = undefined;
        value[i].payee_type = ExpenseCollectionType.onlineBanking;
        value[i].flag = false;
        value[i].card_phone = undefined;
        this.props.onChange([...value]);
      }
    }
  }

  // 改变开户行
  onChangeBankName = (e, i) => {
    const { value } = this.props;
    value[i].bank_details = e;
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
    }
    if (this.props.onChange) {
      this.props.onChange([...value]);
    }
  }

  // 收款类型：对公 统一信用代码
  onChangeRentUnifiedCode = (e, i) => {
    const { value } = this.props;
    // 判断是否有数据
    if (is.not.existy(e) || is.empty(e)) {
      value[i].credit_no = undefined;
    } else {
      value[i].credit_no = e.target.value;
    }
    if (this.props.onChange) {
      this.props.onChange([...value]);
    }
  }
  // 收款类型: 对私 身份证号
  onChangeRentIdCard = (e, i) => {
    const { value } = this.props;
     // 判断是否有数据
    if (is.not.existy(e) || is.empty(e)) {
      value[i].id_card_no = undefined;
    } else {
      value[i].id_card_no = e.target.value;
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
      this.props.onChange([...value]);
      // 判断收款人和收款手机号是否有值，判断是否是趣活的
      if (value[i].card_name && e && systemIdentifierFlag) {
        this.props.dispatch({
          type: 'employeeManage/fetchEmployeeDetail',
          payload: {
            phone: e,
            name: value[i].card_name,
            fileType: 'staff',
            onSuccessCallback: result => this.onSuccessCallback(result, i), // 成功的档案
          },
        });
      }
    }
  }

  // 收款方式
  onChangeBankType = (e, i) => {
    const { value, form = {} } = this.props;
    value[i].payee_type = e.target.value;
    if (this.props.onChange) {
      this.props.onChange([...value]);
      form.setFieldsValue({ [`[${i}].bankType`]: e });
    }
  };

  // 收款类型
  onChangeRentPayment =(e, i) => {
    const { value } = this.props;
    value[i].payment = e.target.value;

    // 如果切换到对公 清除存储的身份证号码的值
    if (value[i].id_card_no && value[i].payment === PayModeEnumer.credit) {
      value[i].id_card_no = undefined;
    }
    // 如果切换到对私 清除存储的统一信用代码的值
    if (value[i].credit_no && value[i].payment === PayModeEnumer.idCard) {
      value[i].credit_no = undefined;
    }

    if (this.props.onChange) {
      this.props.onChange([...value]);
    }
  }

  // 成功回调
  onSuccessCallback = (result, i) => {
    const { value } = this.props;
    // 判断无数据
    if (is.not.existy(result) || is.empty(result)) {
      // 没数据时，档案id清空，收款类型重置成网银
      value[i].payee_employee_id = undefined;
      value[i].payee_type = ExpenseCollectionType.onlineBanking;
      value[i].flag = false;
      value[i].card_phone = undefined;
      if (this.props.onChange) {
        this.props.onChange([...value]);
      }
      // 没有时清空
      return message.error('请求错误：没有员工档案，只能选择网银收款');
    }
    // 判断有数据
    if (is.existy(result) && is.not.empty(result)) {
      // 修改档案id
      value[i].payee_employee_id = result._id;
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

  /**
   * 渲染租金下：收款方式 对应的form
   * forms    当前forms数组
   * i        每一项的索引
   * disabled 状态
   * item     每一项
   */
  renderRentCorresponding = (forms, i, disabled, item) => {
    const { value } = this.props;

    if (value[i].payment === PayModeEnumer.idCard) {
      const idNumberForm = {
        label: <span className={styles['label-required']}>身份证号</span>,
        form: (<Input disabled={disabled} value={dot.get(item, 'id_card_no', undefined)} onChange={e => this.onChangeRentIdCard(e, i)} />),
      };
      forms.push(idNumberForm);
    }

    if (value[i].payment === PayModeEnumer.credit) {
      const UnifiedCodeForm = {
        label: '统一信用代码',
        form: (
          <Input disabled={disabled} value={dot.get(item, 'credit_no', undefined)} onChange={e => this.onChangeRentUnifiedCode(e, i)} />
        ),
      };
      forms.push(UnifiedCodeForm);
    }
  }

  // 渲染每项
  renderItem = (item, i) => {
    const {
      label = {},
      placeholder = {},
      disabled,
      isUpdateRule,
      layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
      value = {},
    } = this.props;

    const {
      cardNameLabel = '收款人',
      bankNameLabel = '开户支行',
      cardNumLabel = '收款账户',
    } = label;

    const {
      cardNamePlace = '请填写收款人',
      bankNamePlace = '请填写开户支行',
      cardNumPlace = '请填写收款账号',
    } = placeholder;
    // 收款信息

    const formItems = [
      {
        label: (<span className={styles['label-required']}>{cardNameLabel}</span>),
        form: (
          <CollectionCardName
            namespace={`namespaceCardName${item.num}`}
            value={dot.get(item, 'card_name', undefined)}
            placeholder={cardNamePlace}
            onChange={e => this.onChangeCardName(e, i)}
            style={{ width: '100%' }}
            disabled={isUpdateRule || disabled}
          />
        ),
      },
      {
        label: <span className={styles['label-required']}>{bankNameLabel}</span>,
        form: (
          <CollectionBankDetails
            value={dot.get(item, 'bank_details', undefined)}
            namespace={`namespaceBankDetails${item.num}`}
            placeholder={bankNamePlace}
            card_name={dot.get(item, 'card_name', undefined)}
            onChange={e => this.onChangeBankName(e, i)}
            update={item.flag}
            disabled={isUpdateRule || disabled}
          />
        ),
      },
      {
        label: <span className={styles['label-required']}>{cardNumLabel}</span>,
        form: (
          <CollectionCardNum
            namespace={`namespaceCardNum${item.num}`}
            value={dot.get(item, 'card_num', undefined)}
            placeholder={cardNumPlace}
            card_name={dot.get(item, 'card_name', undefined)}
            bank_details={dot.get(item, 'bank_details', undefined)}
            update={item.flag}
            onChange={e => this.onChangeCardNum(e, i)}
            disabled={isUpdateRule || disabled}
          />
        ),
      },
      {
        label: <span className={styles['label-required']}>金额(元)</span>,
        form: (
          <InputNumber
            value={dot.get(item, 'money', undefined)}
            onChange={e => this.onChangeBankMoney(e, i)}
            precision={2}
            placeholder="请填写金额"
          />
        ),
      },
      {
        label: '收款方式',
        form: (<Radio.Group
          value={dot.get(item, 'payee_type', undefined)}
          disabled={isUpdateRule || disabled}
          onChange={e => this.onChangeBankType(e, i)}
        >
          <Radio value={ExpenseCollectionType.onlineBanking}>{ExpenseCollectionType.description(ExpenseCollectionType.onlineBanking)}</Radio>
          {
            systemIdentifierFlag ? (
              <Radio
                disabled={!dot.get(item, 'payee_employee_id', undefined)}
                value={ExpenseCollectionType.wallet}
              >{ExpenseCollectionType.description(ExpenseCollectionType.wallet)}</Radio>
            ) : null
          }
        </Radio.Group>),
      },
      {
        label: '手机号',
        form: (
          <CollectionCardPhone
            value={dot.get(item, 'card_phone', undefined)}
            namespace={`namespaceCardPhone${item.num}`}
            card_name={dot.get(item, 'card_name', undefined)}
            disabled={isUpdateRule || disabled}
            onChange={e => this.onChangePhone(e, i)}
            update={value[i].flag}
            placeholder="请输入手机号"
          />
        ),
      },
    ];


    if (this.props.isRender) {
      formItems.push({
        label: '收款类型',
        form: (
          <Radio.Group
            value={dot.get(item, 'payment', undefined)}
            disabled={isUpdateRule || disabled}
            onChange={e => this.onChangeRentPayment(e, i)}
          >
            <Radio value={PayModeEnumer.idCard}>{PayModeEnumer.description(PayModeEnumer.idCard)}</Radio>
            <Radio value={PayModeEnumer.credit}>{PayModeEnumer.description(PayModeEnumer.credit)}</Radio>
          </Radio.Group>
        ),
      });
      // disabled状态
      const renderDisable = isUpdateRule || disabled;
      // 渲染租金下对应的收款类型form
      this.renderRentCorresponding(formItems, i, renderDisable, item);
    }


    return (
      <Row align="middle" key={item.num}>
        <Col span={22}>
          <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
        </Col>
        <Col span={2} style={{ marginBottom: 24 }}>
          {/* 最后一位显示添加按钮 */}
          {value.length - 1 === i ?
            (<Button
              style={{ marginRight: 10 }}
              onClick={() => this.onCreate(i)}
              disabled={isUpdateRule || disabled}
              shape="circle"
              icon={<PlusOutlined />}
            />
            ) : null}
          {value.length !== 1 ?
            (<Button
              onClick={() => this.onDelete(i)}
              disabled={isUpdateRule || disabled}
              shape="circle"
              icon={<MinusOutlined />}
            />
            ) : null}
        </Col>
      </Row>
    );
  }

  // 渲染内容
  renderContent = () => {
    const { value } = this.props;
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
