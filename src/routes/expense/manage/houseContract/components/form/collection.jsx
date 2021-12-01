/**
 * 费用单收款信息组件
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

import { DeprecatedCoreForm } from '../../../../../../components/core';

const Option = Select.Option;

class Collection extends Component {
  static propTypes = {
    collection: PropTypes.object, // 收款历史输入记录
    form: PropTypes.object.isRequired,
    detail: PropTypes.object, // 费用单数据
    label: PropTypes.object, // label
    placeholder: PropTypes.object,
    disabled: PropTypes.bool,
    formName: PropTypes.object,
    layout: PropTypes.object,
    namespace: PropTypes.string,
  }

  static defaultProps = {
    collection: {},
    form: {},
    detail: {},
    label: {},
    placeholder: {},
    disabled: false,
    formName: {},
    layout: {},
    namespace: '',
  }

  static getDerivedStateFromProps(prevProps, oriState) {
    const { collection = {} } = prevProps;
    const { collection: oriData = undefined } = oriState;
    if (oriData === undefined && Object.keys(collection).length > 0) {
      const {
        cardName = [],
        cardNum = [],
        bankName = [],
      } = collection;

      return { cardNameData: cardName, cardNumData: cardNum, bankNameData: bankName, collection };
    }

    return null;
  }

  constructor() {
    super();
    this.state = {
      collection: undefined,
      cardNameData: [],
      cardNumData: [],
      bankNameData: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'expenseCostOrder/fetchCollection',
      payload: {},
    });
  }

  componentWillUnmount() {
    // 重置数据
    this.props.dispatch({
      type: 'expenseCostOrder/resetCollection',
      payload: {},
    });
  }

  // 收款人onSearch
  onSearchCardName = (val) => {
    const { collection = {} } = this.props;
    const { cardName = [] } = collection;
    if (!cardName.find(item => item === val)) {
      this.setState({
        cardNameData: [...cardName, val],
      });
    }
  }

  // 收款账户onSearch
  onSearchCardNum = (val) => {
    const { collection = {} } = this.props;
    const { cardNum = [] } = collection;
    if (!cardNum.find(item => item === val)) {
      this.setState({
        cardNumData: [...cardNum, val],
      });
    }
  }

  // 开户行onSearch
  onSearchBankName = (val) => {
    const { collection = {} } = this.props;
    const { bankName = [] } = collection;
    if (!bankName.find(item => item === val)) {
      this.setState({
        bankNameData: [...bankName, val],
      });
    }
  }

  // 收款人onChange
  onChangeCardNum = (val) => {
    const { form = {}, collection = {}, namespace } = this.props;
    const { setFieldsValue } = form;
    const {
      originalBankName = [], // 原始支行
      originalCardNum = [], // 原始账号
    } = collection;

    // 原始数据获取最新对应关系
    const key = originalCardNum.findIndex(i => i === val);

    namespace === 'rent' && originalBankName[key] && setFieldsValue({ rentBankName: originalBankName[key] });

    namespace === 'agent' && originalBankName[key] && setFieldsValue({ agentBankName: originalBankName[key] });

    namespace === 'pledge' && originalBankName[key] && setFieldsValue({ pledgeBankName: originalBankName[key] });
  }

  render() {
    const {
      form = {},
      detail = {},
      label = {},
      placeholder = {},
      disabled,
      formName = {},
      layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } },
    } = this.props;
    const { getFieldDecorator } = form;

    const {
      cardNameData = [], // 收款人数据
      cardNumData = [], // 收款账户数据
      bankNameData = [], // 开户支行数据
    } = this.state;

    const {
      cardNameLabel = '收款人',
      cardNumLabel = '收款账户',
      bankNameLabel = '开户支行',
    } = label;

    const {
      cardNamePlace = '请填写收款人',
      cardNumPlace = '请填写收款账号',
      bankNamePlace = '请填写开户支行',
    } = placeholder;

    const {
      cardNameForm = 'payee',
      cardNumForm = 'payeeAccount',
      bankNameForm = 'bankName',
    } = formName;

    // 收款信息
    const formItems = [
      {
        label: cardNameLabel,
        form: getFieldDecorator(cardNameForm, {
          initialValue: dot.get(detail, 'payeeInfo.card_name', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select
            showSearch
            placeholder={cardNamePlace}
            onSearch={this.onSearchCardName}
            style={{ width: '100%' }}
            disabled={disabled}
          >
            {
              cardNameData.map((name, nameKey) => {
                return <Option key={nameKey} value={name}>{name}</Option>;
              })
            }
          </Select>,
          ),
      }, {
        label: cardNumLabel,
        form: getFieldDecorator(cardNumForm, {
          initialValue: dot.get(detail, 'payeeInfo.card_num', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select
            showSearch
            placeholder={cardNumPlace}
            onSearch={this.onSearchCardNum}
            onChange={this.onChangeCardNum}
            style={{ width: '100%' }}
            disabled={disabled}
          >
            {
              cardNumData.map((num, nameKey) => {
                return <Option key={nameKey} value={num}>{num}</Option>;
              })
            }
          </Select>,
          ),
      }, {
        label: bankNameLabel,
        form: getFieldDecorator(bankNameForm, {
          initialValue: dot.get(detail, 'payeeInfo.bank_details', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select
            placeholder={bankNamePlace}
            showSearch
            onSearch={this.onSearchBankName}
            style={{ width: '100%' }}
            disabled={disabled}
          >
            {
              bankNameData.map((bank, nameKey) => {
                return <Option key={nameKey} value={bank}>{bank}</Option>;
              })
            }
          </Select>,
          ),
      },
    ];


    return <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />;
  }
}

function mapStateToProps({ expenseCostOrder: { collection } }) {
  return { collection };
}

export default connect(mapStateToProps)(Collection);
