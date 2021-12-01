/**
 *  商圈详情
 * 停用详情页 - 启用。 可以修改状态，平台商圈id，商圈名称
 * 筹备中详情页 - 启用。 可以修改状态，平台商圈id，商圈名称
 * 筹备中。 可以修改状态，商圈名称
 * 停用详情页  可以修改状态。
 * 启用详情页  可以修改状态和商圈名称
 */
import is from 'is_js';
import dot from 'dot-prop';
import _ from 'lodash';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select, Button, Tag, message, Table, Tooltip } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';
import { connect } from 'dva';
import moment from 'moment';

import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import {
  CommonSelectPlatforms,
  CommonSelectSuppliers,
  CommonSelectCities,
  CommonSelectScene,
} from '../../../../components/common';
import {
  DistrictState,
  DistrictNoteState,
  DistrictPlatformState,
  DistrictManageMode,         // 商圈来源
  DistrictSource,             // 商圈经营方式
  DistrictDisposeWay,         // 商圈处置方式
} from '../../../../application/define/index';
import {
  utils,
} from '../../../../application';
import ComponentTripartiteId from './components/tripartiteId.jsx';
import Operate from '../../../../application/define/operate.js';
import SetTags from './components/setTag';
import styles from './style/index.less';

const { Option } = Select;
const { TextArea } = Input;

class DistrictDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      supplierId: '',     // 供应商id
      visible: false,
    };
    this.private = {
      searchParams: {
        limit: 30,
        page: 1,
      },
    };
  }

  componentDidMount() {
    this.getDistrictDetail();

    // 标签变更记录
    this.getDistrictTagChangeLog();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'districtTag/resetDistrictTagChangeLog', payload: {} });
  }

  // 隐藏设置标签弹窗
  onCancel = () => {
    this.setState({ visible: false });
  }

  // 设置标签成功回调
  onSuccessCallback = () => {
    this.getDistrictTagChangeLog();
    message.success('操作成功');
    this.getDistrictDetail();
    this.onCancel();
  }

  // 设置标签失败回调
  onFailureCallback = (res) => {
    res.zh_message && message.error(res.zh_message);
    this.onCancel();
  }

  // 商圈详情请求成功回调
  onDetailSuccessCallBack = (res) => {
    const { supplier_id } = res;
    this.setState({
      ...this.state,
      supplierId: supplier_id,
    });
  }

  // 选择商圈状态回调
  onChangeDistrictState = (value) => {
    const { setFieldsValue } = this.props.form;
    const {
      customId,
      name,
      sourceType,
      operationType,
    } = this.props.districtDetail;
    // 获取更多三方id数据
    const tripartiteId = this.getDistrictDetailTripartiteId();
    // 停用时，平台商圈id和商圈名称更改成接口值
    if (Number(value) === DistrictState.disabled) {
      setFieldsValue({ customId });
      setFieldsValue({ name });
      setFieldsValue({ tripartiteId });
      setFieldsValue({ source: sourceType });
      setFieldsValue({ mode: operationType });
    }
    // 筹备中时，平台商圈id清空
    if (Number(value) === DistrictState.preparation) {
      setFieldsValue({ customId: '', tripartiteId: {} });
    }
    // 运营中时，平台商圈id更改成接口值
    if (Number(value) === DistrictState.enable) {
      setFieldsValue({ customId });
      setFieldsValue({ tripartiteId });
    }
    // 待关闭时，平台商圈id更改成接口值
    if (Number(value) === DistrictState.waitClose) {
      setFieldsValue({ customId });
      setFieldsValue({ tripartiteId });
    }
  }

  // 返回上一页
  onBack = () => {
    const { history } = this.props;
    history.push('/Assets/District/Manage');
  }

  // 编辑商圈
  onUpdate = (e) => {
    e.preventDefault();
    const { id } = this.props.location.query;
    this.props.form.validateFields((err, value) => {
      if (err) return;
      const payload = {
        districtId: id,
        changeType: value.changeType,
        onSuccessCallBack: this.onBack,
      };
      const {
        state,
        customId,
        name,
        sourceType,
        operationType,
        remark,
      } = this.props.districtDetail;
      // 判断状态值和初始状态是否相等
      if (Number(state) !== Number(value.state)) {
        payload.state = Number(value.state);
      }
      // 判断平台商圈id和初始平台商圈id是否相等
      if (customId !== value.customId) {
        payload.customId = value.customId;
      }
      // 判断商圈名称和初始商圈名称是否相等
      if (name !== value.name) {
        payload.name = value.name;
      }
      // 处置方式
      if (value.disposeWay) {
        payload.disposeWay = value.disposeWay;
      }
      // 来源
      if (sourceType !== value.source) {
        payload.source = value.source;
      }
      // 经营方式
      if (operationType !== value.mode) {
        payload.mode = value.mode;
      }
      // 判断是否有数据
      if (value.remark) {
        // 状态变更备注
        if (remark !== value.remark) {
          payload.remark = value.remark;
        }
      } else {
        payload.reastRemark = true;
      }

      // 获取更多三方id数据
      const tripartiteId = this.getDistrictDetailTripartiteId();
      // 比较是否相等
      if (!_.isEqual(tripartiteId, value.tripartiteId)) {
        payload.tripartiteId = value.tripartiteId;
      }
      this.props.dispatch({
        type: 'districtManage/updateDistrict',
        payload,
      });
    });
  }

  // 判断平台商圈id是否禁用
  onGetIsCustomIdRequired = () => {
    const { getFieldValue } = this.props.form;
    const districtState = getFieldValue('state');
    return districtState
      ? (Number(districtState) !== DistrictState.enable
      && Number(districtState) !== DistrictState.waitClose) : true;
  }

  // 判断商圈名称是否禁用
  onGetDistrictNameIsDisabled = (state) => {
    const { getFieldValue } = this.props.form;
    const districtState = getFieldValue('state');
    // 商圈状态,停用
    if (Number(state) === DistrictState.disabled) {
      // 商圈状态没值，停用默认true
      return districtState ? Number(districtState) === DistrictState.disabled : true;
      // 默认false
    } else {
      // 商圈状态等于停用
      return districtState ? Number(districtState) === DistrictState.disabled : false;
    }
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.getDistrictTagChangeLog(searchParams);
  }

  // 获取商圈详情
  getDistrictDetail = () => {
    const { id } = this.props.location.query;
    const payload = {
      districtId: id,
      onSuccessCallBack: this.onDetailSuccessCallBack,
    };
    this.props.dispatch({
      type: 'districtManage/fetchDistrictDetail',
      payload,
    });
  }

  // 获取商圈标签变更记录
  getDistrictTagChangeLog = (val = {}) => {
    const { id } = this.props.location.query;
    const {
      searchParams,
    } = this.private;

    const params = {
      ...searchParams,
      ...val,
    };

    this.private.searchParams = { ...params };
    // 标签变更记录
    this.props.dispatch({
      type: 'districtTag/getDistrictTagChangeLog',
      payload: { districtId: id, ...params },
    });
  }

  // 获取更多三方id数据
  getDistrictDetailTripartiteId = () => {
    const districtDetail = dot.get(this.props, 'districtDetail', {});
    const platformStates = Object.values(DistrictPlatformState).filter(v => typeof v !== 'function');
    const tripartiteId = {};
    // 遍历更多平台商圈id
    platformStates.forEach((val) => {
        // 判断更多平台商圈id是否存在
      if (is.existy(districtDetail[val]) && is.not.empty(districtDetail[val])) {
        const tripartiteIdItems = dot.get(tripartiteId, 'items', []);
        tripartiteId.checked = true;
        tripartiteId.items = [
          ...tripartiteIdItems,
          {
            code: val,
            id: districtDetail[val],
            disabled: true,
          }];
      }
    });
    return tripartiteId;
  }
  // 判断是否显示 商圈处置方式
  judgeWay = (state) => {
    const { disabled, waitClose } = DistrictState;
    if (state === disabled || state === waitClose) {
      return true;
    }
    return false;
  }
  // 渲染操作信息
  renderOperateInfo = () => {
    const { id } = this.props.location.query;
    const {
      createdAt,
      operatorInfo,
      updatedAt,
      forbiddenAt,
    } = this.props.districtDetail;
    // 跳转到商圈变更记录
    const titleExt = (<a
      href={`/#/Assets/District/ChangeLog?id=${id}`}
      target="_blank"
      rel="noopener noreferrer"
    >商圈变更记录</a>);
    const formItems = [
      {
        label: '创建时间',
        form: createdAt ? moment(createdAt).format('YYYY-MM-DD HH:mm') : '--',
      }, {
        label: '最新操作人',
        form: operatorInfo && operatorInfo.name ? operatorInfo.name : '--',
      }, {
        label: '停用时间',
        form: forbiddenAt ? moment(forbiddenAt).format('YYYY-MM-DD HH:mm') : '--',
      }, {
        label: '最新操作时间',
        form: updatedAt ? moment(updatedAt).format('YYYY-MM-DD HH:mm') : '--',
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="操作信息" titleExt={titleExt}>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染业务归属
  renderBusinessAttribution = () => {
    const { getFieldDecorator } = this.props.form;
    const { supplierId } = this.state;
    // 添加商圈时cityId为空
    const cityCode = this.props.districtDetail.cityCode;
    const industry = this.props.districtDetail.industryCode;
    const platformCode = this.props.districtDetail.platformCode;
    const formItems = [
      {
        label: '所属场景',
        form: getFieldDecorator('business', {
          initialValue: industry || undefined,
          rules: [{ required: true, message: '请选择所属场景' }],
        })(
          <CommonSelectScene disabled enumeratedType="industry" />,
        ),
      },
      {
        label: '平台',
        form: getFieldDecorator('platformCode', {
          initialValue: platformCode || undefined,
          rules: [{ required: true, message: '请选择平台' }],
        })(
          <CommonSelectPlatforms
            enableSelectAll
            disabled
            allowClear
            showSearch
            placeholder="请选择平台"
          />,
        ),
      },
      {
        label: '供应商',
        form: getFieldDecorator('supplierId', {
          initialValue: supplierId || undefined,
          rules: [{ required: true, message: '请选择供应商' }],
        })(
          <CommonSelectSuppliers
            enableSelectAll
            allowClear
            showSearch
            disabled
            optionFilterProp="children"
            placeholder="请选择供应商"
            platforms={platformCode}
          />,
        ),
      },
      {
        label: '城市',
        form: getFieldDecorator('cityId', {
          initialValue: cityCode || undefined,
          rules: [{ required: true, message: '请选择城市' }],
        })(
          (supplierId && platformCode)
          ? <CommonSelectCities
            enableSelectAll
            allowClear
            isExpenseModel
            showSearch
            disabled
            optionFilterProp="children"
            placeholder="请选择城市"
            suppliers={supplierId}
            platforms={platformCode}
          />
          : <Select disabled />,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title={'业务归属'}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染商圈状态
  renderDistrictState = (state) => {
    // 根据不同初始状态渲染状态选项
    let optionsArr = null;
    const { enable, disabled, preparation, waitClose } = DistrictState;
    switch (state) {
      // 筹备中
      case preparation:
        optionsArr = [enable, preparation, waitClose];
        break;
      // 运营中
      case enable:
        optionsArr = [enable, waitClose];
        break;
      // 待关闭
      case waitClose:
        optionsArr = [waitClose, disabled];
        break;
      // 已关闭
      case disabled:
        optionsArr = [enable, disabled];
        break;
      default:
        optionsArr = [];
        break;
    }
    return (
      <Select placeholder="请选择状态" onChange={this.onChangeDistrictState}>
        {
          optionsArr.map((item, index) => {
            return (
              <Option
                value={item}
                key={index}
              >
                {DistrictState.description(item)}
              </Option>
            );
          })
        }
      </Select>
    );
  }

  // 渲染基本信息
  renderBasicInfo = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { disabled } = DistrictState;
    const districtDetail = dot.get(this.props, 'districtDetail', {});
    const { judgeWay } = this;
    // 添加商圈时customId、name为空
    const customId = districtDetail.customId;
    const state = districtDetail.state;
    const name = districtDetail.name;
    const {
      disposalType,        // 商圈处置方式
      remark,
    } = districtDetail;
    // 获取更多三方id数据
    const tripartiteId = this.getDistrictDetailTripartiteId();
    const { ownerInfo = {} } = districtDetail;
    const districtNameDisabled = this.onGetDistrictNameIsDisabled(state);
    const tripartiteChecked = this.props.form.getFieldValue('tripartiteId') && this.props.form.getFieldValue('tripartiteId').checked; // 是否开启三方平台
    const formItems = [
      {
        label: 'BOSS商圈ID',
        form: <span>{dot.get(districtDetail, 'id', '--')}</span>,
      },
      {
        label: '状态',
        form: getFieldDecorator('state', {
          initialValue: state,
          rules: [{ required: true, message: '请选择状态' }],
        })(
          this.renderDistrictState(state),
        ),
      },
    ];

    // 根据条件显示商圈处置方式
    if (judgeWay(getFieldValue('state'))) {
      formItems.push(
        {
          label: '商圈处置方式',
          form: getFieldDecorator('disposeWay', {
            initialValue: disposalType,
            rules: [{ required: true, message: '请选择处置方式' }],
          })(
            <Select
              placeholder="请选择"
              disabled={
                getFieldValue('state') === disabled
              }
            >
              {utils.transOptions(DistrictDisposeWay, Option)}
            </Select>,
          ),
        },
      );
    }
    const formItemsFixed = [
      {
        label: '商圈名称',
        form: getFieldDecorator('name', {
          initialValue: name,
          rules: [{ required: true, message: '请输入商圈名称' }],
        })(
          <Input placeholder="请输入商圈名称" disabled={districtNameDisabled} />,
        ),
      },
      {
        label: getFieldValue('platformCode') === 'meituan' ? '平台商圈ID（专送）' : '平台商圈ID', // 美团显示专送
        span: 9,
        form: getFieldDecorator('customId', {
          initialValue: customId,
          rules: [{ required: !this.onGetIsCustomIdRequired() && !tripartiteChecked, validator: utils.asyncValidateCustomId }], // 增加关联判断 是否开启三方平台
        })(
          <Input disabled={this.onGetIsCustomIdRequired()} placeholder="请输入商圈ID" />,
        ),
      },
      {
        label: '商圈所有者',
        form: (ownerInfo.staff_info && ownerInfo.staff_info.name) ? ownerInfo.staff_info.name : '--',
      },
      {
        label: '状态调整备注',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 8 } },
        form: getFieldDecorator('remark', {
          initialValue: remark,
        })(
          <TextArea
            autoSize={{ minRows: 2, maxRows: 2 }}
            placeholder="最多输入50个字"
            maxLength={50}
            allowClear
          />,
        ),
      },
    ];
    // 表单商圈id和详情商圈id都存在时，并且不一致才展示修改原因
    if (customId && getFieldValue('customId') &&
      customId !== getFieldValue('customId')) {
      formItemsFixed.splice(2, 0,
        {
          label: '修改原因',
          form: getFieldDecorator('changeType', {
            rules: [{ required: true, message: '请选择修改原因' }],
          })(
            <Select placeholder="请选择修改原因">
              <Option value={`${DistrictNoteState.one}`}>{DistrictNoteState.description(DistrictNoteState.one)}</Option>
              <Option value={`${DistrictNoteState.two}`}>{DistrictNoteState.description(DistrictNoteState.two)}</Option>
            </Select>,
          ),
        },
      );
    }
    formItems.push(...formItemsFixed);

    // 判断平台等于美团并且状态不等于筹备中
    if ((getFieldValue('platformCode') === 'meituan'
        && getFieldValue('state') !== `${DistrictState.preparation}`) &&
        (dot.get(tripartiteId, 'items', []).length > 0 ||
        getFieldValue('state') !== `${DistrictState.disabled}`)) {
      formItems.push(
        {
          label: '三方平台商圈ID（非专送）',
          span: 15,
          layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
          form: getFieldDecorator('tripartiteId', {
            initialValue: tripartiteId,
            rules: [{ required: false, validator: utils.asyncValidateTripartiteId }],
          })(
            <ComponentTripartiteId
              disabledSwitch={dot.get(tripartiteId, 'items', []).length > 0}
              disabled={this.onGetIsCustomIdRequired()}
            />,
          ),
        },
      );
    }
    const titleExt = (
      <span><InfoCircleTwoTone twoToneColor="#FF7700" />  因三方平台ID变更，修改原因请选择“三方平台变更”；因录入信息错误导致修改平台商圈ID，原因请选择“填写有误”</span>
    );
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title={'基本信息'} titleExt={titleExt}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }
  // 额外信息
  renderExtraInfo = () => {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const {
      sourceType,
      operationType,
    } = dot.get(this.props, 'districtDetail', {});
    const { disabled } = DistrictState;
    const formItems = [
      {
        label: '商圈来源',
        form: getFieldDecorator('source', {
          rules: [{ required: true, message: '请选择商圈来源' }],
          initialValue: sourceType,
        })(
          <Select placeholder="请选择" disabled={getFieldValue('state') === disabled}>
            {utils.transOptions(DistrictSource, Option)}
          </Select>,
        ),
      },
      {
        label: '商圈经营方式',
        form: getFieldDecorator('mode', {
          rules: [{ required: true, message: '请选择商圈经营方式' }],
          initialValue: operationType,
        })(
          <Select placeholder="请选择" disabled={getFieldValue('state') === disabled}>
            {utils.transOptions(DistrictManageMode, Option)}
          </Select>,
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent title="额外信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 标签
  renderTags = () => {
    const { districtDetail = {} } = this.props;

    const { labelInfos: data = [], state } = districtDetail;
    // 设置标签
    const titleExt = Operate.canOperateAssectsAdministrationTagSet() && state !== DistrictState.disabled ?
      (<a type="primary" onClick={() => this.setState({ visible: true })}>设置标签</a>)
      : null;

    return (
      <CoreContent title="标签" titleExt={titleExt}>
        {
          data.map((item, key) => <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{item.name}</Tag>)
        }
      </CoreContent>
    );
  }

  renderButton = () => {
    return (
      <div className={styles['app-comp-system-detail-btn-wrap']}>
        <Button onClick={this.onBack}>返回</Button>
        <Button
          type="primary"
          onClick={this.onUpdate}
          className={styles['app-comp-detail-submit-btn']}
        >
          提交
        </Button>
      </div>
    );
  }

  // 弹窗
  renderModal = () => {
    const { visible } = this.state;
    const { districtDetail = {} } = this.props;

    // 标签
    const { labelInfos: data = [] } = districtDetail;

    if (!visible) return;
    // 商圈id
    const { id = undefined } = districtDetail;

    return (
      <SetTags
        visible={visible}
        districtId={id}
        data={data.map(tag => tag._id)}
        onCancel={this.onCancel}
        onSuccessCallback={this.onSuccessCallback}
        onFailureCallback={this.onFailureCallback}
      />
    );
  }

  // 标签变更记录
  renderTagChangLog = () => {
    // const { page } = this.private.searchParams.meta;
    const { districtTagChangeLog = {} } = this.props;
    const { data = [], _meta: meta = {} } = districtTagChangeLog;
    const columns = [
      {
        title: '归属月份',
        dataIndex: 'month',
        key: 'month',
        render: (text) => {
          if (text) {
            return `${String(text).slice(0, 4)}-${String(text).slice(4, 6)}`;
          }
          return '--';
        },
      },
      {
        title: '本月标签',
        dataIndex: 'label_infos',
        key: 'label_infos',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '--';
          }

          // 标签少于三个
          if (text.length <= 3) {
            return text.map(i => i.name).join('、');
          }

          // 气泡
          return (
            <Tooltip title={text.map(item => item.name).join('、')}>
              <span>{dot.get(text, '0.name')}、{dot.get(text, '1.name')}、{dot.get(text, '2.name')}...</span>
            </Tooltip>
          );
        },
      },
      {
        title: '记录时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
    ];

    // 分页
    const pagination = {
      defaultPageSize: 30, // 默认数据条数
      onChange: this.onChangePage, // 切换分页
      showQuickJumper: true, // 显示快速跳转
      showSizeChanger: true, // 显示分页
      onShowSizeChange: this.onChangePage, // 展示每页数据数
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: meta.result_count || 0, // 数据总条数
    };

    return (
      <CoreContent title="标签变更记录">
        <Table
          rowKey={(record, index) => { return record._id || index; }}
          pagination={pagination}
          dataSource={data}
          columns={columns}
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        <Form>
          {/* 渲染操作信息 */}
          {this.renderOperateInfo()}

          {/* 渲染业务归属 */}
          {this.renderBusinessAttribution()}

          {/* 渲染基本信息 */}
          {this.renderBasicInfo()}

          {/* 渲染额外信息 */}
          {this.renderExtraInfo()}

          {/* 渲染标签 */}
          {this.renderTags()}

          {/* 渲染设置标签弹窗 */}
          {this.renderModal()}

          {/* 渲染标签变更记录 */}
          {this.renderTagChangLog()}

          {/* 渲染下方操作按钮 */}
          {this.renderButton()}
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ districtManage: { districtDetail }, districtTag: { districtTagChangeLog } }) {
  return { districtDetail, districtTagChangeLog };
}

export default Form.create()(connect(mapStateToProps)(DistrictDetail));
