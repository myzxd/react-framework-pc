/**
 * 房屋管理/新建(编辑)/房屋信息
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
  Input,
  InputNumber,
} from 'antd';
import {
  CoreContent,
  DeprecatedCoreForm,
  CoreSelect,
  CoreFinder,
} from '../../../../../../components/core';
import CoreUpload from '../../../../components/uploadAmazon';
import { ExpenseHouseContractState, ExpenseHouseContractUsage, ExpenseHouseContractHouseSource } from '../../../../../../application/define/index';
import style from './style.css';

const { TextArea } = Input;
const { Option } = CoreSelect;
// 附件的form字段
const attachmentKey = 'attachments';
const { CoreFinderList } = CoreFinder;

class HouseInfo extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object, // 默认数据
    disabled: PropTypes.bool, // 是否禁用
    isUpdate: PropTypes.bool, // 是否为编辑合同
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
    disabled: false, // 是否禁用
    isUpdate: false, // 是否为合同编辑
    fileName: '', // 预览文件的名称
  };
  static getDerivedStateFromProps(prevProps, oriState) {
    const { isCreateRenew, houseContractDetail: prevData = {} } = prevProps;
    const { houseContractDetail = undefined, isUpload = false } = oriState;
    if (houseContractDetail === undefined && Object.keys(prevData).length > 0) {
      // 房屋状态、历史合同id
      const { fromContractId = undefined, state = undefined, attachments = [] } = prevData;

      // 草稿状态下的续签合同不继承附件
      const fileList = (isCreateRenew || (state === ExpenseHouseContractState.pendding && fromContractId)) && isUpload === false
        ? []
        : attachments;
      return { fileList, isUpload: true };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      isUpload: false,
      fileList: dot.get(props, 'houseContractDetail.attachments', []),                      // 文件列表
      fileType: null,
      fileUrl: null,
      visible: false,
    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const { fileList = [] } = this.state;
    const list = fileList;
    list.push(e);
    this.setState({
      fileList: list,
    });
    this.props.form.setFieldsValue({ [attachmentKey]: list });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const { fileList = [] } = this.state;
    fileList.splice(index, 1);
    this.setState({
      fileList,
    });
    this.props.form.setFieldsValue({ [attachmentKey]: fileList });
  }

  // 设置预览参数
  onUploadFileSuccess = (type, url, name) => {
    this.setState({ fileName: name, fileType: type, fileUrl: url, visible: true });
  }

  disabledDate = (current) => {
    const { houseContractDetail = {} } = this.props;
    const {
      contractEndDate,
    } = houseContractDetail;

    return current && current < moment(String(contractEndDate)).add(1, 'days');
  }

// 预览组件
  renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const data = value.map((item) => {
        return { key: item };
      });
      return (
        <CoreFinderList data={data} enableDownload={false} enableRemove onRemove={this.onDeleteFile} />
      );
    }
    return <React.Fragment />;
  };
  // 渲染附件
  renderUpload = () => {
    const { disabled } = this.props;
    const { fileList = [] } = this.state;
    if (disabled) {
      return fileList.map((item, index) => {
        return (
          <p key={index}>{item}</p>
        );
      });
    }
    return (
      <div>
        <CoreUpload
          domain="cost"
          namespace={this.private.namespace}
          onSuccess={this.onUploadSuccess}
          onFailure={this.onUploadFailure}
        />
        {
          this.renderCorePreview(fileList)
        }
      </div>
    );
  }

  // 渲染房屋地址
  renderAddress = () => {
    const {
      houseContractDetail = {},
      disabled,
      isUpdate,
      form = {},
    } = this.props;

    const { getFieldDecorator } = form;
    // 房屋地址
    const { houseAddress } = houseContractDetail;

    // 房屋地址存在 && 合同编辑 && 可禁用
    const isDisabled = disabled && houseAddress && isUpdate;

    const formItems = [
      {
        label: '房屋地址',
        form: getFieldDecorator('address', {
          initialValue: houseAddress,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input placeholder="请输入房屋地址" disabled={isDisabled} />,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  // 渲染房屋基本信息
  renderBaseInfo = () => {
    const {
      houseContractDetail = {},
      disabled,
      isCreateRenew,
      isUpdate,
      form = {},
    } = this.props;

    const { getFieldDecorator } = form;

    const {
      pcUsage,
      area,
      contractStartDate,
      contractEndDate,
      landlordName, // 房东姓名
      fromContractId, // 历史合同id
      state,
      houseSource,
    } = houseContractDetail;

    let contractDate = [];

    // 续签新合同不继承寄合同的合同租期
    if (contractStartDate && !isCreateRenew) {
      contractDate.push(moment(String(contractStartDate), 'YYYY-MM-DD'));
    }
    // 续签新合同不继承寄合同的合同租期
    if (contractEndDate && !isCreateRenew) {
      contractDate.push(moment(String(contractEndDate), 'YYYY-MM-DD'));
    }

    if (fromContractId && state === ExpenseHouseContractState.pendding) {
      contractDate = [];
    }

    // 房东姓名存在 && 可禁用 && 合同编辑
    const isDisabled = disabled && landlordName && isUpdate;

    const formItems = [
      {
        label: '房东姓名',
        form: getFieldDecorator('landlordName', {
          initialValue: landlordName,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input placeholder="请输入房东姓名" disabled={isDisabled} />,
        ),
      },
      {
        label: '用途',
        form: getFieldDecorator('usage', {
          initialValue: pcUsage,
          rules: [{
            required: true,
            message: '请选择用途',
          }],
        })(
          <CoreSelect
            placeholder="请选择用途"
            mode="multiple"
            showArrow
            disabled={disabled}
          >
            <Option value={ExpenseHouseContractUsage.office}>{ExpenseHouseContractUsage.description(ExpenseHouseContractUsage.office)}</Option>
            <Option value={ExpenseHouseContractUsage.dormitory}>{ExpenseHouseContractUsage.description(ExpenseHouseContractUsage.dormitory)}</Option>
            <Option value={ExpenseHouseContractUsage.warehouse}>{ExpenseHouseContractUsage.description(ExpenseHouseContractUsage.warehouse)}</Option>
            <Option value={ExpenseHouseContractUsage.charging}>{ExpenseHouseContractUsage.description(ExpenseHouseContractUsage.charging)}</Option>
            <Option value={ExpenseHouseContractUsage.other}>{ExpenseHouseContractUsage.description(ExpenseHouseContractUsage.other)}</Option>
          </CoreSelect>,
        ),
      },
      {
        label: '房屋面积(㎡)',
        form: getFieldDecorator('area', {
          initialValue: area,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={1}
            disabled={disabled}
          />,
        ),
      },
      {
        label: '房屋来源',
        form: getFieldDecorator('source', {
          initialValue: houseSource ? houseSource : ExpenseHouseContractHouseSource.rent,
          rules: [{
            required: true,
            message: '请选择房屋来源',
          }],
        })(
          <CoreSelect placeholder="请选择房屋来源" disabled={disabled}>
            <Option value={ExpenseHouseContractHouseSource.rent}>{ExpenseHouseContractHouseSource.description(ExpenseHouseContractHouseSource.rent)}</Option>
            <Option value={ExpenseHouseContractHouseSource.acquisition}>{ExpenseHouseContractHouseSource.description(ExpenseHouseContractHouseSource.acquisition)}</Option>
            <Option value={ExpenseHouseContractHouseSource.other}>{ExpenseHouseContractHouseSource.description(ExpenseHouseContractHouseSource.other)}</Option>
          </CoreSelect>,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 9,
      },
      wrapperCol: {
        span: 15,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
        style={{ marginLeft: -4 }}
      />
    );
  }

  // 渲染其他信息
  renderExtraInfo = () => {
    const { houseContractDetail = {}, disabled, form = {} } = this.props;
    const { getFieldDecorator } = form;
    const {
      note,
    } = houseContractDetail;
    const formItems = [
      {
        label: '备注',
        form: getFieldDecorator('note', {
          initialValue: note,
          rules: [{
            required: false,
          }],
        })(
          <TextArea form={this.props.form} disabled={disabled} />,
        ),
      },
      {
        label: '上传附件',
        form: (
          <div>{this.renderUpload()}</div>
        ),
      },
    ];
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };
    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  // 渲染隐藏的表单
  renderHiddenForm = () => {
    const { form = {}, houseContractDetail = {} } = this.props;
    const { attachments: fileList = [] } = houseContractDetail;

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator(attachmentKey, { initialValue: fileList })(<Input hidden />),
      },
    ];
    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    return (
      <DeprecatedCoreForm
        className={style['app-comp-expense-house-contract-from-hidden']}
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }


  render = () => {
    return (
      <CoreContent title="房屋信息">

        {/* 渲染首行 */}
        {/* {this.renderFirstLineInfo()} */}

        {/* 渲染房屋地址 */}
        {this.renderAddress()}

        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染其他 */}
        {this.renderExtraInfo()}

        {/* 渲染隐藏表单 */}
        {this.renderHiddenForm()}

      </CoreContent>
    );
  }
}
export default connect()(HouseInfo);

