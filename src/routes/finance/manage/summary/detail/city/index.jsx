/**
 * 结算汇总,城市结算明细 - Finance/Manage/Summary/Detail/City
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import is from 'is_js';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Table, Popconfirm, message, Alert, Empty } from 'antd';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { SalaryPaymentState, Unit, SalarySummaryState } from '../../../../../../application/define';
import Operate from '../../../../../../application/define/operate';
import Search from './search';
import styles from './style/index.less';

class IndexPage extends Component {
  static propTypes = {
    salaryRecords: PropTypes.object,
    salaryRecordsInfo: PropTypes.object,
  };

  static defaultProps = {
    salaryRecords: {},
    salaryRecordsInfo: {},
  };

  constructor(props) {
    super();
    const { id, canDelay, states, platformCode } = props.location.query;
    this.state = {
      selectedRowKeys: [],  // 选择要操作的数据keys
      recordId: id,         // 数据id
      states,               // 审核状态
      platformCode,         // 获取平台
      canDelay: canDelay === '1',       // 是否能执行缓发
    };
    this.private = {
      searchParams: {},   // 搜索的参数
    };
  }

  // 搜索
  onSearch = (data) => {
    const params = data;
    const { city, recordId } = this.state;
    params.cities = [city];
    params.recordId = recordId;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    // 保存搜索的参数
    this.private.searchParams = params;

    // 调用搜索
    this.props.dispatch({ type: 'financeSummaryManage/fetchSalaryCityStatement', payload: params });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

  // 修改条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 缓发撤回
  onUpdateSalaryMarkNormal = (id) => {
    const params = {
      ids: [id],
    };
    this.props.dispatch({ type: 'financeSummaryManage/updateSalaryMarkNormal', payload: params });
  }

  // 批量缓发
  onUpdateSalaryMarkDelay = () => {
    const { selectedRowKeys } = this.state;

    // 判断数据是否为空
    if (selectedRowKeys.length === 0) {
      return message.error('请选择要缓发的数据');
    }
    const params = {
      ids: selectedRowKeys,
    };
    this.props.dispatch({ type: 'financeSummaryManage/updateSalaryMarkDelay', payload: params });

    // 重置选择数据
    this.setState({
      selectedRowKeys: [],
    });
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { salaryRecordsInfo = {} } = this.props;
    const { recordId } = this.state;
    if (is.not.empty(salaryRecordsInfo)) {
      const props = {
        recordId,
        supplier: dot.get(salaryRecordsInfo, 'supplier_id', undefined),
        platform: dot.get(salaryRecordsInfo, 'platform_code', undefined),
        city: dot.get(salaryRecordsInfo, 'city_spelling', undefined),
        workType: dot.get(salaryRecordsInfo, 'work_type', undefined),
        supplierName: dot.get(salaryRecordsInfo, 'supplier_name', undefined),
        platformName: dot.get(salaryRecordsInfo, 'platform_name', undefined),
        cityName: dot.get(salaryRecordsInfo, 'city_name', undefined),
        onSearch: this.onSearch,
      };
      return <Search {...props} />;
    }
  }
  // 渲染归属日期
  renderAttributionDate = () => {
    const { salaryRecordsInfo = {} } = this.props;
    const startDate = dot.get(salaryRecordsInfo, 'start_date', '--');
    const endDate = dot.get(salaryRecordsInfo, 'end_date', '--');
    return `${startDate} ~ ${endDate}`;
  }

  // 渲染缓发
  renderDelayed = () => {
    const { states, canDelay } = this.state;
    if (Operate.canOperateFinanceManageSummaryDelay() && canDelay) {
      if (SalarySummaryState.waiting === Number(states) || SalarySummaryState.reject === Number(states)) {
        return (
          <Popconfirm title="确定执行操作？" onConfirm={this.onUpdateSalaryMarkDelay} okText="确定" cancelText="取消">
            <Button type="primary" className="app-global-mgr10" >缓发</Button>
          </Popconfirm>
        );
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  // 渲染饿了吗汇总信息
  renderEleSummayInfo = () => {
    const { salaryRecordsInfo = {} } = this.props;
    const formItems = [
      {
        form: `雇佣主体: ${dot.get(salaryRecordsInfo.summary_data, '雇佣主体', '--')}`,
      },
      {
        form: `项目: ${dot.get(salaryRecordsInfo.summary_data, '项目', '--')}`,
      },
      {
        form: `主体: ${dot.get(salaryRecordsInfo.summary_data, '主体', '--')}`,
      },
      {
        form: `城市: ${dot.get(salaryRecordsInfo.summary_data, '城市', '--')}`,
      },
      {
        form: `服务费归属日期: ${this.renderAttributionDate()}`,
      },
      {
        form: `服务费计算日期: ${dot.get(salaryRecordsInfo, 'last_executed_date', '--')}`,
      },
      {
        form: `成本中心: ${dot.get(salaryRecordsInfo.summary_data, '成本中心', '--')}`,
      },
      {
        form: `人数: ${dot.get(salaryRecordsInfo.summary_data, '人数', '--')}`,
      },
      {
        form: `招聘费用预测(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '招聘费用预测')) || '--'}`,
      },
      {
        form: `单量: ${dot.get(salaryRecordsInfo.summary_data, '完成单量', '--')}`,
      },
      {
        form: `服务费调节类补款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '薪资调节类补款')) || '--'}`,
      },
      {
        form: `内荐费(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '内荐费')) || '--'}`,
      },
      {
        form: `押金返还(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '押金返还')) || '--'}`,
      },
      {
        form: `平台奖励(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '平台奖励')) || '--'}`,
      },
      {
        form: `临时性结算汇总(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '临时性结算')) || '--'}`,
      },
      {
        form: `工伤保险扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '工伤险扣款')) || '--'}`,
      },
      {
        form: `平台雇主险扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '平台雇主险扣款')) || '--'}`,
      },
      {
        form: `电动车扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '电动车扣款')) || '--'}`,
      },
      {
        form: `电动车租金扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '电动车租金扣款')) || '--'}`,
      },
      {
        form: `电动车押金扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '电动车押金扣款')) || '--'}`,
      },
      {
        form: `装备押金(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '装备押金扣款')) || '--'}`,
      },
      {
        form: `装备扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '装备扣款')) || '--'}`,
      },
      {
        form: `应发工资(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '应发工资')) || '--'}`,
      },
      {
        form: `社保扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '社保扣款')) || '0.00'}`,
      },
      {
        form: `个人所得税(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '个人所得税')) || '--'}`,
      },
      {
        form: `实发工资(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '实发工资')) || '--'}`,
      },
      {
        form: `三方手续费汇总(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '手续费')) || '--'}`,
      },
      {
        form: `综合实发工资(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '实发工资')) || '--'}`,
      },
    ];
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
    return (
      <CoreContent title="所选城市汇总" style={{ backgroundColor: '#FAFAFA' }}>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染美团汇总信息
  renderMeituanSummayInfo = () => {
    const { salaryRecordsInfo = {} } = this.props;
    const formItems = [
      {
        form: `雇佣主体: ${dot.get(salaryRecordsInfo.summary_data, '雇佣主体', '--')}`,
      },
      {
        form: `项目: ${dot.get(salaryRecordsInfo.summary_data, '项目', '--')}`,
      },
      {
        form: `主体: ${dot.get(salaryRecordsInfo.summary_data, '主体', '--')}`,
      },
      {
        form: `城市: ${dot.get(salaryRecordsInfo.summary_data, '城市', '--')}`,
      },
      {
        form: `服务费归属日期: ${this.renderAttributionDate()}`,
      },
      {
        form: `服务费计算日期: ${dot.get(salaryRecordsInfo, 'last_executed_date', '--')}`,
      },
      {
        form: `成本中心: ${dot.get(salaryRecordsInfo.summary_data, '成本中心', '--')}`,
      },
      {
        form: `人数: ${dot.get(salaryRecordsInfo.summary_data, '人数', '--')}`,
      },
      {
        form: `招聘费用预测(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '招聘费用预测')) || '--'}`,
      },
      {
        form: `单量: ${dot.get(salaryRecordsInfo.summary_data, '完成单量', '--')}`,
      },
      {
        form: `服务费调节类补款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '薪资调节类补款', 0)) || '--'}`,
      },
      {
        form: `平台奖励(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '平台奖励', 0)) || '--'}`,
      },
      {
        form: `内荐费(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '内荐费', 0)) || '--'}`,
      },
      {
        form: `押金返还（6月前）(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '押金返还（6月前）', 0)) || '--'}`,
      },
      {
        form: `押金返还（6月后）(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '押金返还（6月后）', 0)) || '--'}`,
      },
      {
        form: `现金内荐费扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '现金内荐费扣款', 0)) || '--'}`,
      },
      {
        form: `兼职工资扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '兼职工资扣款', 0)) || '--'}`,
      },
      {
        form: `临时性结算扣回(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '临时性结算扣回', 0)) || '--'}`,
      },
      {
        form: `工伤保险扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '工伤险扣款', 0)) || '--'}`,
      },
      {
        form: `平台雇主险扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '平台雇主险扣款', 0)) || '--'}`,
      },
      {
        form: `电动车扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '电动车扣款', 0)) || '--'}`,
      },
      {
        form: `电动车租金扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '电动车租金扣款', 0)) || '--'}`,
      },
      {
        form: `电动车押金扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '电动车押金扣款', 0)) || '--'}`,
      },
      {
        form: `装备押金扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '装备押金扣款', 0)) || '--'}`,
      },
      {
        form: `装备扣款(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '装备扣款', 0)) || '--'}`,
      },
      {
        form: `应发工资(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '应发工资', 0)) || '--'}`,
      },
      {
        form: `社保扣款(个人）(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '社保扣款(个人）', 0)) || '--'}`,
      },
      {
        form: `个人所得税(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '个人所得税', 0)) || '--'}`,
      },
      {
        form: `手续费(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '手续费', 0)) || '--'}`,
      },
      {
        form: `实发工资(元): ${Unit.exchangePriceToMathFormat(dot.get(salaryRecordsInfo.summary_data, '实发工资', 0)) || '--'}`,
      },
    ];
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
    return (
      <CoreContent title="所选城市汇总" style={{ backgroundColor: '#FAFAFA' }}>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染美团内容列表
  renderMeituanContent = () => {
    const { salaryRecords: dataSource = {} } = this.props;
    const { selectedRowKeys, canDelay } = this.state;
    // 添加table显示字段
    const { page = 1 } = this.private.searchParams;

    const columns = [
      {
        title: '主体',
        dataIndex: ['sheet_data_info', 'data', '主体'],
        key: 'sheet_data_info.data.主体',
        width: 100,
        fixed: 'left',
        render: text => text || '--',
      }, {
        title: '城市',
        dataIndex: ['sheet_data_info', 'data', '城市'],
        key: 'sheet_data_info.data.城市',
        width: 80,
        fixed: 'left',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '商圈',
        dataIndex: ['sheet_data_info', 'data', '商圈'],
        key: 'sheet_data_info.data.商圈',
        width: 120,
        fixed: 'left',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '雇佣主体',
        dataIndex: ['sheet_data_info', 'data', '雇佣主体'],
        key: 'sheet_data_info.data.雇佣主体',
        render: text => text || '--',
      }, {
        title: '项目',
        dataIndex: ['sheet_data_info', 'data', '项目'],
        key: 'sheet_data_info.data.项目',
        render: text => text || '--',
      }, {
        title: '成本中心',
        dataIndex: ['sheet_data_info', 'data', '成本中心'],
        key: 'sheet_data_info.data.成本中心',
        width: 100,
        render: text => text || '--',
      }, {
        title: '商圈ID',
        dataIndex: ['sheet_data_info', 'data', '商圈ID'],
        key: 'sheet_data_info.data.商圈ID',
        render: text => text || '--',
      }, {
        title: 'boss人员ID',
        dataIndex: ['sheet_data_info', 'data', 'boss员工ID'],
        key: 'sheet_data_info.data.boss员工ID',
        render: text => text || '--',
      }, {
        title: '骑士类型',
        dataIndex: ['sheet_data_info', 'data', '骑士类型'],
        key: 'sheet_data_info.data.骑士类型',
        render: text => text || '--',
      }, {
        title: '人员ID',
        dataIndex: ['sheet_data_info', 'data', '人员ID'],
        key: 'sheet_data_info.data.人员ID',
        render: text => text || '--',
      }, {
        title: '本人姓名',
        dataIndex: ['sheet_data_info', 'data', '本人姓名'],
        key: 'sheet_data_info.data.本人姓名',
        render: text => text || '--',
      }, {
        title: '本人身份证号码',
        dataIndex: ['sheet_data_info', 'data', '本人身份证号码'],
        key: 'sheet_data_info.data.本人身份证号码',
        render: text => text || '--',
      }, {
        title: '收款人是否为本人',
        dataIndex: ['sheet_data_info', 'data', '收款人是否为本人'],
        key: 'sheet_data_info.data.收款人是否为本人',
        render: text => text || '--',
      }, {
        title: '收款方式ID',
        dataIndex: ['sheet_data_info', 'data', '收款方式ID'],
        key: 'sheet_data_info.data.收款方式ID',
        render: text => text || '--',
      }, {
        title: '收款人姓名',
        dataIndex: ['sheet_data_info', 'data', '收款人姓名'],
        key: '收款人姓名',
        render: text => text || '--',
      }, {
        title: '收款人身份证号码',
        dataIndex: ['sheet_data_info', 'data', '收款人身份证号码'],
        key: 'sheet_data_info.data.收款人身份证号码',
        render: text => text || '--',
      }, {
        title: '收款银行卡号',
        dataIndex: ['sheet_data_info', 'data', '收款银行卡号'],
        key: 'sheet_data_info.data.收款银行卡号',
        render: text => text || '--',
      }, {
        title: '收款开户银行',
        dataIndex: ['sheet_data_info', 'data', '收款开户银行'],
        key: 'sheet_data_info.data.收款开户银行',
        render: text => text || '--',
      }, {
        title: '开户行所在地',
        dataIndex: ['sheet_data_info', 'data', '开户行所在地'],
        key: 'sheet_data_info.data.开户行所在地',
        render: text => text || '--',
      }, {
        title: '本人手机号',
        dataIndex: ['sheet_data_info', 'data', '本人手机号'],
        key: 'sheet_data_info.data.本人手机号',
        render: text => text || '--',
      }, {
        title: '入职日期',
        dataIndex: ['sheet_data_info', 'data', '入职日期'],
        key: 'sheet_data_info.data.入职日期',
        render: text => text || '--',
      }, {
        title: '离职日期',
        dataIndex: ['sheet_data_info', 'data', '离职日期'],
        key: 'sheet_data_info.data.离职日期',
        render: text => text || '--',
      }, {
        title: '人员状态',
        dataIndex: ['sheet_data_info', 'data', '人员状态'],
        key: 'sheet_data_info.data.人员状态',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '招聘来源',
        dataIndex: ['sheet_data_info', 'data', '招聘来源'],
        key: 'sheet_data_info.data.招聘来源',
        render: text => text || '--',
      }, {
        title: '招聘费用预测',
        dataIndex: ['sheet_data_info', 'data', '招聘费用预测'],
        key: 'sheet_data_info.data.招聘费用预测',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      }, {
        title: '出勤天数',
        dataIndex: ['sheet_data_info', 'data', '出勤天数'],
        key: 'sheet_data_info.data.出勤天数',
        render: text => text || '--',
      }, {
        title: '有效出勤',
        dataIndex: ['sheet_data_info', 'data', '有效出勤'],
        key: 'sheet_data_info.data.有效出勤',
        render: text => text || '--',
      }, {
        title: '工资标准',
        dataIndex: ['sheet_data_info', 'data', '工资标准'],
        key: 'sheet_data_info.data.工资标准',
        render: (text) => {
          return text ? Unit.exchangePriceToMathFormat(text) : '--';
        },
      }, {
        title: '出勤工资',
        dataIndex: ['sheet_data_info', 'data', '出勤工资'],
        key: 'sheet_data_info.data.出勤工资',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      }, {
        title: '全勤奖',
        dataIndex: ['sheet_data_info', 'data', '全勤奖'],
        key: 'sheet_data_info.data.全勤奖',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      }, {
        title: '完成单量',
        dataIndex: ['sheet_data_info', 'data', '完成单量'],
        key: 'sheet_data_info.data.完成单量',
        render: text => text || '--',
      }, {
        title: '保底单量',
        dataIndex: ['sheet_data_info', 'data', '保底单量'],
        key: 'sheet_data_info.data.保底单量',
        render: text => text || '--',
      }, {
        title: '美团单量提成（总）',
        dataIndex: ['sheet_data_info', 'data', '美团单量提成（总）'],
        key: 'sheet_data_info.data.美团单量提成（总）',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      }, {
        title: '特殊时段订单单量',
        dataIndex: ['sheet_data_info', 'data', '特殊时段订单单量'],
        key: 'sheet_data_info.data.特殊时段订单单量',
        render: text => text || '--',
      }, {
        title: '特殊时段订单提成',
        dataIndex: ['sheet_data_info', 'data', '特殊时段订单提成'],
        key: 'sheet_data_info.data.特殊时段订单提成',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '外单单量',
        dataIndex: ['sheet_data_info', 'data', '外单单量'],
        key: 'sheet_data_info.data.外单单量',
        render: text => text || '--',
      },
      {
        title: '外单提成',
        dataIndex: ['sheet_data_info', 'data', '外单提成'],
        key: 'sheet_data_info.data.外单提成',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '好评单量',
        dataIndex: ['sheet_data_info', 'data', '好评单量'],
        key: 'sheet_data_info.data.好评单量',
        render: text => text || '--',
      },
      {
        title: '好评奖励',
        dataIndex: ['sheet_data_info', 'data', '好评奖励'],
        key: 'sheet_data_info.data.好评奖励',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '考核出勤/单量补贴',
        dataIndex: ['sheet_data_info', 'data', '考核出勤/单量补贴'],
        key: 'sheet_data_info.data.考核出勤/单量补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '综合排名补贴',
        dataIndex: ['sheet_data_info', 'data', '综合排名补贴'],
        key: 'sheet_data_info.data.综合排名补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '季节性补贴',
        dataIndex: ['sheet_data_info', 'data', '季节性补贴'],
        key: 'sheet_data_info.data.季节性补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '大额订单补贴',
        dataIndex: ['sheet_data_info', 'data', '大额订单补贴'],
        key: 'sheet_data_info.data.大额订单补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '距离补贴',
        dataIndex: ['sheet_data_info', 'data', '距离补贴'],
        key: 'sheet_data_info.data.距离补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '车辆补贴',
        dataIndex: ['sheet_data_info', 'data', '车辆补贴'],
        key: 'sheet_data_info.data.车辆补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '充电补贴',
        dataIndex: ['sheet_data_info', 'data', '充电补贴'],
        key: 'sheet_data_info.data.充电补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '社保补贴',
        dataIndex: ['sheet_data_info', 'data', '社保补贴'],
        key: 'sheet_data_info.data.社保补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '星级绩效',
        dataIndex: ['sheet_data_info', 'data', '星级绩效'],
        key: 'sheet_data_info.data.星级绩效',
        render: text => text || '--',
      },
      {
        title: '岗位补贴',
        dataIndex: ['sheet_data_info', 'data', '岗位补贴'],
        key: 'sheet_data_info.data.岗位补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '奖金',
        dataIndex: ['sheet_data_info', 'data', '奖金'],
        key: 'sheet_data_info.data.奖金',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '服务费调节类补款',
        dataIndex: ['sheet_data_info', 'data', '薪资调节类补款'],
        key: 'sheet_data_info.data.薪资调节类补款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '平台奖励',
        dataIndex: ['sheet_data_info', 'data', '平台奖励'],
        key: 'sheet_data_info.data.平台奖励',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '现金内推荐费',
        dataIndex: ['sheet_data_info', 'data', '现金内荐费'],
        key: 'sheet_data_info.data.现金内荐费',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '兼职工资',
        dataIndex: ['sheet_data_info', 'data', '兼职工资'],
        key: 'sheet_data_info.data.兼职工资',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '临时性结算汇总',
        dataIndex: ['sheet_data_info', 'data', '临时性结算汇总'],
        key: 'sheet_data_info.data.临时性结算汇总',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '内荐费',
        dataIndex: ['sheet_data_info', 'data', '内荐费'],
        key: 'sheet_data_info.data.内荐费',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '押金返还(6月前)',
        dataIndex: ['sheet_data_info', 'data', '押金返还（6月前）'],
        key: 'sheet_data_info.data.押金返还（6月前）',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '押金返还(6月后)',
        dataIndex: ['sheet_data_info', 'data', '押金返还（6月后）'],
        key: 'sheet_data_info.data.押金返还（6月后）',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '社保扣款(企业)',
        dataIndex: ['sheet_data_info', 'data', '社保扣款（企业）'],
        key: 'sheet_data_info.data.社保扣款（企业）',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '电动车扣款',
        dataIndex: ['sheet_data_info', 'data', '电动车扣款'],
        key: 'sheet_data_info.data.电动车扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '电动车租金扣款',
        dataIndex: ['sheet_data_info', 'data', '电动车租金扣款'],
        key: 'sheet_data_info.data.电动车租金扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '电动车押金扣款',
        dataIndex: ['sheet_data_info', 'data', '电动车押金扣款'],
        key: 'sheet_data_info.data.电动车押金扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '装备扣款',
        dataIndex: ['sheet_data_info', 'data', '装备扣款'],
        key: 'sheet_data_info.data.装备扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '装备押金扣款',
        dataIndex: ['sheet_data_info', 'data', '装备押金扣款'],
        key: 'sheet_data_info.data.装备押金扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '工伤险扣款',
        dataIndex: ['sheet_data_info', 'data', '工伤险扣款'],
        key: 'sheet_data_info.data.工伤险扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '平台雇主险扣款',
        dataIndex: ['sheet_data_info', 'data', '平台雇主险扣款'],
        key: 'sheet_data_info.data.平台雇主险扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '美团罚款',
        dataIndex: ['sheet_data_info', 'data', '美团罚款'],
        key: 'sheet_data_info.data.美团罚款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '餐损扣款',
        dataIndex: ['sheet_data_info', 'data', '餐损扣款'],
        key: 'sheet_data_info.data.餐损扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '星火履约扣款',
        dataIndex: ['sheet_data_info', 'data', '星火履约扣款'],
        key: 'sheet_data_info.data.星火履约扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '房屋扣款',
        dataIndex: ['sheet_data_info', 'data', '房屋扣款'],
        key: 'sheet_data_info.data.房屋扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '水电费扣款',
        dataIndex: ['sheet_data_info', 'data', '水电费扣款'],
        key: 'sheet_data_info.data.水电费扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '城市扣款',
        dataIndex: ['sheet_data_info', 'data', '城市扣款'],
        key: 'sheet_data_info.data.城市扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '管理费扣款',
        dataIndex: ['sheet_data_info', 'data', '管理费扣款'],
        key: 'sheet_data_info.data.管理费扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '应发工资',
        dataIndex: ['sheet_data_info', 'data', '应发工资'],
        key: 'sheet_data_info.data.应发工资',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '社保扣款(个人)',
        dataIndex: ['sheet_data_info', 'data', '社保扣款(个人）'],
        key: 'sheet_data_info.data.社保扣款(个人）',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '个人所得税',
        dataIndex: ['sheet_data_info', 'data', '个人所得税'],
        key: 'sheet_data_info.data.个人所得税',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '房屋水电费代扣款',
        dataIndex: ['sheet_data_info', 'data', '房屋水电费代扣款'],
        key: 'sheet_data_info.data.房屋水电费代扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '房屋水电费补款',
        dataIndex: ['sheet_data_info', 'data', '房屋水电费补款'],
        key: 'sheet_data_info.data.房屋水电费补款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '平台奖励扣款',
        dataIndex: ['sheet_data_info', 'data', '平台奖励扣款'],
        key: 'sheet_data_info.data.平台奖励扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '现金内推荐费扣款',
        dataIndex: ['sheet_data_info', 'data', '现金内荐费扣款'],
        key: 'sheet_data_info.data.现金内荐费扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '兼职工资扣款',
        dataIndex: ['sheet_data_info', 'data', '兼职工资扣款'],
        key: 'sheet_data_info.data.兼职工资扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '临时性结算扣回',
        dataIndex: ['sheet_data_info', 'data', '临时性结算扣回'],
        key: 'sheet_data_info.data.临时性结算扣回',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '手续费',
        dataIndex: ['sheet_data_info', 'data', '手续费'],
        key: 'sheet_data_info.data.手续费',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '实发工资',
        dataIndex: ['sheet_data_info', 'data', '实发工资'],
        key: 'sheet_data_info.data.实发工资',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '服务费发放状态',
        dataIndex: 'pay_salary_state',
        key: 'pay_salary_state',
        render: (text) => { return text ? SalaryPaymentState.description(text) : '--'; },
      },
      {
        title: '发放账户',
        dataIndex: ['sheet_data_info', 'data', '发放账户'],
        key: 'sheet_data_info.data.发放账户',
        render: (text) => { return text || '--'; },
      },
      {
        title: '备注',
        dataIndex: ['sheet_data_info', 'data', '备注'],
        key: 'sheet_data_info.data.备注',
        render: (text) => { return text || '--'; },
      },
      {
        title: '调前应发',
        dataIndex: ['sheet_data_info', 'data', '调前应发'],
        key: 'sheet_data_info.data.调前应发',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '调前实发',
        dataIndex: ['sheet_data_info', 'data', '调前实发'],
        key: 'sheet_data_info.data.调前实发',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '单成本',
        dataIndex: ['sheet_data_info', 'data', '单成本'],
        key: 'sheet_data_info.data.单成本',
        render: (text) => { return Unit.exchangePriceToMathFormat(text) || '--'; },
      },
      {
        title: '操作',
        dataIndex: '操作',
        key: '操作',
        width: 100,
        fixed: 'right',
        render: (text, record) => {
          // 如果状态是缓发，则显示撤回缓发
          if (record.pay_salary_state === SalaryPaymentState.delayed) {
            return (<div>
              <a target="_blank" href={`/#/Finance/Manage/Summary/Detail/Knight?id=${record._id}`} rel="noopener noreferrer">查看</a>
              {/* 权限操作 可缓发的角色可撤回 */}
              {
                Operate.canOperateFinanceManageSummaryDelay() ? <a className={styles['app-comp-finance-boss-SDC-deloy']} onClick={this.onUpdateSalaryMarkNormal.bind(this, record._id)}>撤回标记</a> : ''
              }
            </div>);
          } else {
            return <a target="_blank" href={`/#/Finance/Manage/Summary/Detail/Knight?id=${record._id}`} rel="noopener noreferrer">查看</a>;
          }
        },
      },
    ];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };

    // 服务费查询列表，批量缓发按钮(城市经理，城市助理) && 能够进行缓发操作（历史注释）
    let rowSelection;
    // 2018-04-17: 所有勾选改功能的角色都可操作批量缓发。
    if (Operate.canOperateFinanceManageSummaryDelay() && canDelay) {
      rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
          this.setState({
            selectedRowKeys: selectedKeys,
          });
        },
      };
    }

    return (
      <CoreContent>
        <div className="app-global-mgb10">
          {/* 渲染缓发按钮 */}
          {this.renderDelayed()}
        </div>
        {/* 数据 */}
        <Table rowKey={record => record._id} rowSelection={rowSelection} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: 8000 }} />
      </CoreContent>
    );
  }

  // 渲染饿了吗内容列表
  renderElmaContent = () => {
    const { salaryRecords: dataSource = {} } = this.props;
    const { selectedRowKeys, canDelay } = this.state;
    // 添加table显示字段
    const { page = 1 } = this.private.searchParams;
    const columns = [
      {
        title: '主体',
        dataIndex: ['sheet_data_info', 'data', '主体'],
        key: 'sheet_data_info.data.主体',
        width: 100,
        fixed: 'left',
        render: text => text || '--',
      }, {
        title: '城市',
        dataIndex: ['sheet_data_info', 'data', '城市'],
        key: 'sheet_data_info.data.城市',
        width: 80,
        fixed: 'left',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '商圈',
        dataIndex: ['sheet_data_info', 'data', '商圈'],
        key: 'sheet_data_info.data.商圈',
        width: 120,
        fixed: 'left',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '雇佣主体',
        dataIndex: ['sheet_data_info', 'data', '雇佣主体'],
        key: 'sheet_data_info.data.雇佣主体',
        render: text => text || '--',
      }, {
        title: '项目',
        dataIndex: ['sheet_data_info', 'data', '项目'],
        key: 'sheet_data_info.data.项目',
        render: text => text || '--',
      }, {
        title: '成本中心',
        dataIndex: ['sheet_data_info', 'data', '成本中心'],
        key: 'sheet_data_info.data.成本中心',
        render: text => text || '--',
      }, {
        title: '商圈ID',
        dataIndex: ['sheet_data_info', 'data', '商圈ID'],
        key: 'sheet_data_info.data.商圈ID',
        render: text => text || '--',
      }, {
        title: 'boss人员ID',
        dataIndex: ['sheet_data_info', 'data', 'boss员工ID'],
        key: 'sheet_data_info.data.boss员工ID',
        render: text => text || '--',
      }, {
        title: '骑士类型',
        dataIndex: ['sheet_data_info', 'data', '骑士类型'],
        key: 'sheet_data_info.data.骑士类型',
        render: text => text || '--',
      }, {
        title: '人员ID',
        dataIndex: ['sheet_data_info', 'data', '人员ID'],
        key: 'sheet_data_info.data.人员ID',
        render: text => text || '--',
      }, {
        title: '本人姓名',
        dataIndex: ['sheet_data_info', 'data', '本人姓名'],
        key: 'sheet_data_info.data.本人姓名',
        render: text => text || '--',
      }, {
        title: '本人身份证号码',
        dataIndex: ['sheet_data_info', 'data', '本人身份证号码'],
        key: 'sheet_data_info.data.本人身份证号码',
        render: text => text || '--',
      }, {
        title: '收款人是否为本人',
        dataIndex: ['sheet_data_info', 'data', '收款人是否为本人'],
        key: 'sheet_data_info.data.收款人是否为本人',
        render: text => text || '--',
      }, {
        title: '收款人姓名',
        dataIndex: ['sheet_data_info', 'data', '收款人姓名'],
        key: '收款人姓名',
        render: text => text || '--',
      }, {
        title: '收款人身份证号码',
        dataIndex: ['sheet_data_info', 'data', '收款人身份证号码'],
        key: 'sheet_data_info.data.收款人身份证号码',
        render: text => text || '--',
      }, {
        title: '收款银行卡号',
        dataIndex: ['sheet_data_info', 'data', '收款银行卡号'],
        key: 'sheet_data_info.data.收款银行卡号',
        render: text => text || '--',
      }, {
        title: '收款开户银行',
        dataIndex: ['sheet_data_info', 'data', '收款开户银行'],
        key: 'sheet_data_info.data.收款开户银行',
        render: text => text || '--',
      }, {
        title: '开户行所在地',
        dataIndex: ['sheet_data_info', 'data', '开户行所在地'],
        key: 'sheet_data_info.data.开户行所在地',
        render: text => text || '--',
      }, {
        title: '本人手机号',
        dataIndex: ['sheet_data_info', 'data', '本人手机号'],
        key: 'sheet_data_info.data.本人手机号',
        render: text => text || '--',
      }, {
        title: '人员职位',
        dataIndex: ['sheet_data_info', 'data', '人员职位'],
        key: 'sheet_data_info.data.人员职位',
        render: text => text || '--',
      }, {
        title: '入职日期',
        dataIndex: ['sheet_data_info', 'data', '入职日期'],
        key: 'sheet_data_info.data.入职日期',
        render: text => text || '--',
      }, {
        title: '离职日期',
        dataIndex: ['sheet_data_info', 'data', '离职日期'],
        key: 'sheet_data_info.data.离职日期',
        render: text => text || '--',
      }, {
        title: '人员状态',
        dataIndex: ['sheet_data_info', 'data', '人员状态'],
        key: 'sheet_data_info.data.人员状态',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '招聘来源',
        dataIndex: ['sheet_data_info', 'data', '招聘来源'],
        key: 'sheet_data_info.data.招聘来源',
        render: text => text || '--',
      }, {
        title: '招聘费用预测',
        dataIndex: ['sheet_data_info', 'data', '招聘费用预测'],
        key: 'sheet_data_info.data.招聘费用预测',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      }, {
        title: '出勤天数',
        dataIndex: ['sheet_data_info', 'data', '出勤天数'],
        key: 'sheet_data_info.data.出勤天数',
        render: text => text || '--',
      }, {
        title: '有效出勤',
        dataIndex: ['sheet_data_info', 'data', '有效出勤'],
        key: 'sheet_data_info.data.有效出勤',
        render: text => text || '--',
      }, {
        title: '病假天数',
        dataIndex: ['sheet_data_info', 'data', '病假天数'],
        key: 'sheet_data_info.data.病假天数',
        render: text => text || '--',
      }, {
        title: '工资标准',
        dataIndex: ['sheet_data_info', 'data', '工资标准'],
        key: 'sheet_data_info.data.工资标准',
        render: (text) => {
          return Unit.exchangePriceToMathFormat(text) || '--';
        },
      }, {
        title: '出勤工资',
        dataIndex: ['sheet_data_info', 'data', '出勤工资'],
        key: 'sheet_data_info.data.出勤工资',
        render: (text) => {
          return Unit.exchangePriceToMathFormat(text) || '--';
        },
      }, {
        title: '全勤奖',
        dataIndex: ['sheet_data_info', 'data', '全勤奖'],
        key: 'sheet_data_info.data.全勤奖',
        render: (text) => {
          return Unit.exchangePriceToMathFormat(text) || '--';
        },
      }, {
        title: '完成单量',
        dataIndex: ['sheet_data_info', 'data', '完成单量'],
        key: 'sheet_data_info.data.完成单量',
        render: text => text || '--',
      }, {
        title: '准时单量',
        dataIndex: ['sheet_data_info', 'data', '准时单量'],
        key: 'sheet_data_info.data.准时单量',
        render: text => text || '--',
      }, {
        title: '单量提成',
        dataIndex: ['sheet_data_info', 'data', '单量提成'],
        key: 'sheet_data_info.data.单量提成',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      }, {
        title: '超时单量',
        dataIndex: ['sheet_data_info', 'data', '超时单量'],
        key: 'sheet_data_info.data.超时单量',
        render: text => text || '--',
      }, {
        title: '超时单量提成',
        dataIndex: ['sheet_data_info', 'data', '超时单量提成'],
        key: 'sheet_data_info.data.超时单量提成',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      }, {
        title: '超时单量扣款',
        dataIndex: ['sheet_data_info', 'data', '超时单量扣款'],
        key: 'sheet_data_info.data.超时单量扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '午高峰单/夜班单/早餐单',
        dataIndex: ['sheet_data_info', 'data', '午高峰单/夜班单/早餐单'],
        key: 'sheet_data_info.data.午高峰单/夜班单/早餐单',
        render: text => text || '--',
      },
      {
        title: '午高峰/夜班单/早餐单提成/补贴',
        dataIndex: ['sheet_data_info', 'data', '午高峰/夜班单/早餐单提成/补贴'],
        key: 'sheet_data_info.data.午高峰/夜班单/早餐单提成/补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '好评单量',
        dataIndex: ['sheet_data_info', 'data', '好评单量'],
        key: 'sheet_data_info.data.好评单量',
        render: text => text || '--',
      },
      {
        title: '好评奖励',
        dataIndex: ['sheet_data_info', 'data', '好评奖励'],
        key: 'sheet_data_info.data.好评奖励',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '差评单量',
        dataIndex: ['sheet_data_info', 'data', '差评单量'],
        key: 'sheet_data_info.data.差评单量',
        render: text => text || '--',
      },
      {
        title: '差评扣款',
        dataIndex: ['sheet_data_info', 'data', '差评扣款'],
        key: 'sheet_data_info.data.差评扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '车辆补贴',
        dataIndex: ['sheet_data_info', 'data', '车辆补贴'],
        key: 'sheet_data_info.data.车辆补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '充电补贴',
        dataIndex: ['sheet_data_info', 'data', '充电补贴'],
        key: 'sheet_data_info.data.充电补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '单量补贴',
        dataIndex: ['sheet_data_info', 'data', '单量补贴'],
        key: 'sheet_data_info.data.单量补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '其他补贴',
        dataIndex: ['sheet_data_info', 'data', '其他补贴'],
        key: 'sheet_data_info.data.其他补贴',
        render: text => text || '--',
      },
      {
        title: '岗位补贴',
        dataIndex: ['sheet_data_info', 'data', '岗位补贴'],
        key: 'sheet_data_info.data.岗位补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '夜班补贴',
        dataIndex: ['sheet_data_info', 'data', '夜班补贴'],
        key: 'sheet_data_info.data.夜班补贴',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '奖金',
        dataIndex: ['sheet_data_info', 'data', '奖金'],
        key: 'sheet_data_info.data.奖金',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '服务费调节类补款',
        dataIndex: ['sheet_data_info', 'data', '薪资调节类补款'],
        key: 'sheet_data_info.data.薪资调节类补款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '平台奖励',
        dataIndex: ['sheet_data_info', 'data', '平台奖励'],
        key: 'sheet_data_info.data.平台奖励',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '现金内推荐费',
        dataIndex: ['sheet_data_info', 'data', '现金内推荐费'],
        key: 'sheet_data_info.data.现金内推荐费',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '兼职工资',
        dataIndex: ['sheet_data_info', 'data', '兼职工资'],
        key: 'sheet_data_info.data.兼职工资',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '临时性结算',
        dataIndex: ['sheet_data_info', 'data', '临时性结算'],
        key: 'sheet_data_info.data.临时性结算',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '内荐费',
        dataIndex: ['sheet_data_info', 'data', '内荐费'],
        key: 'sheet_data_info.data.内荐费',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '押金返还',
        dataIndex: ['sheet_data_info', 'data', '押金返还'],
        key: 'sheet_data_info.data.押金返还',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '电动车扣款',
        dataIndex: ['sheet_data_info', 'data', '电动车扣款'],
        key: 'sheet_data_info.data.电动车扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '电动车租金扣款',
        dataIndex: ['sheet_data_info', 'data', '电动车租金扣款'],
        key: 'sheet_data_info.data.电动车租金扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '电动车押金扣款',
        dataIndex: ['sheet_data_info', 'data', '电动车押金扣款'],
        key: 'sheet_data_info.data.电动车押金扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '装备扣款',
        dataIndex: '装备扣款1',
        key: '装备扣款1',
        render: (text, record) => {
          const sheetDataInfo = dot.get(record, 'sheet_data_info', {});
          const sheetDataInfoData = dot.get(sheetDataInfo, 'data', {});
          return Unit.exchangePriceToMathFormat(sheetDataInfoData.装备扣款) || '--';
        },
      },
      {
        title: '装备押金扣款',
        dataIndex: ['sheet_data_info', 'data', '装备押金扣款'],
        key: 'sheet_data_info.data.装备押金扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '工伤险扣款',
        dataIndex: ['sheet_data_info', 'data', '工伤险扣款'],
        key: 'sheet_data_info.data.工伤险扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '平台雇主险扣款',
        dataIndex: ['sheet_data_info', 'data', '平台雇主险扣款'],
        key: 'sheet_data_info.data.平台雇主险扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '平台罚款',
        dataIndex: ['sheet_data_info', 'data', '平台罚款'],
        key: 'sheet_data_info.data.平台罚款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '线下违规扣款',
        dataIndex: ['sheet_data_info', 'data', '线下违规扣款'],
        key: 'sheet_data_info.data.线下违规扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '管理费',
        dataIndex: ['sheet_data_info', 'data', '管理费'],
        key: 'sheet_data_info.data.管理费',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '房屋扣款',
        dataIndex: ['sheet_data_info', 'data', '房屋扣款'],
        key: 'sheet_data_info.data.房屋扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '水电扣款',
        dataIndex: ['sheet_data_info', 'data', '水电扣款'],
        key: 'sheet_data_info.data.水电扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '城市扣款',
        dataIndex: ['sheet_data_info', 'data', '城市扣款'],
        key: 'sheet_data_info.data.城市扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '其它扣款',
        dataIndex: ['sheet_data_info', 'data', '其他扣款'],
        key: 'sheet_data_info.data.其他扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '应发工资',
        dataIndex: ['sheet_data_info', 'data', '应发工资'],
        key: 'sheet_data_info.data.应发工资',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '税前工资',
        dataIndex: ['sheet_data_info', 'data', '税前工资'],
        key: 'sheet_data_info.data.税前工资',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '个人所得税',
        dataIndex: ['sheet_data_info', 'data', '个人所得税'],
        key: 'sheet_data_info.data.个人所得税',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '房屋费代扣款',
        dataIndex: ['sheet_data_info', 'data', '房屋费代扣款'],
        key: 'sheet_data_info.data.房屋费代扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '房屋费代补款',
        dataIndex: ['sheet_data_info', 'data', '房屋费代补款'],
        key: 'sheet_data_info.data.房屋费代补款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '水电费扣款',
        dataIndex: ['sheet_data_info', 'data', '水电费扣款'],
        key: 'sheet_data_info.data.水电费扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '水电费补款',
        dataIndex: ['sheet_data_info', 'data', '水电费补款'],
        key: 'sheet_data_info.data.水电费补款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '装备扣款',
        dataIndex: '装备扣款2',
        key: '装备扣款2',
        render: (text, record) => {
          const sheetDataInfo = dot.get(record, 'sheet_data_info', {});
          const sheetDataInfoData = dot.get(sheetDataInfo, 'data', {});
          return Unit.exchangePriceToMathFormat(sheetDataInfoData.装备扣款) || '--';
        },
      },
      {
        title: '装备补款',
        dataIndex: ['sheet_data_info', 'data', '装备补款'],
        key: 'sheet_data_info.data.装备补款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '平台奖励扣款',
        dataIndex: ['sheet_data_info', 'data', '平台奖励扣款'],
        key: 'sheet_data_info.data.平台奖励扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '现金内荐费扣款',
        dataIndex: ['sheet_data_info', 'data', '现金内荐费扣款'],
        key: 'sheet_data_info.data.现金内荐费扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '兼职工资扣款',
        dataIndex: ['sheet_data_info', 'data', '兼职工资扣款'],
        key: 'sheet_data_info.data.兼职工资扣款',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '装备扣款（借款核销）',
        dataIndex: ['sheet_data_info', 'data', '装备扣款（借款核销）'],
        key: 'sheet_data_info.data.装备扣款（借款核销）',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '手续费',
        dataIndex: ['sheet_data_info', 'data', '手续费'],
        key: 'sheet_data_info.data.手续费',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '实发工资',
        dataIndex: ['sheet_data_info', 'data', '实发工资'],
        key: 'sheet_data_info.data.实发工资',
        render: text => text || '--',
      },
      {
        title: '服务费发放状态',
        dataIndex: 'pay_salary_state',
        key: 'pay_salary_state',
        render: (text) => { return text ? SalaryPaymentState.description(text) : '--'; },
      },
      {
        title: '发放账户',
        dataIndex: ['sheet_data_info', 'data', '发放账户'],
        key: 'sheet_data_info.data.发放账户',
        render: text => text || '--',
      },
      {
        title: '备注',
        dataIndex: ['sheet_data_info', 'data', '备注'],
        key: 'sheet_data_info.data.备注',
        render: text => text || '--',
      },
      {
        title: '调前应发',
        dataIndex: ['sheet_data_info', 'data', '调前应发'],
        key: 'sheet_data_info.data.调前应发',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '调前实发',
        dataIndex: ['sheet_data_info', 'data', '调前实发'],
        key: 'sheet_data_info.data.调前实发',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '单成本',
        dataIndex: ['sheet_data_info', 'data', '单成本'],
        key: 'sheet_data_info.data.单成本',
        render: text => Unit.exchangePriceToMathFormat(text) || '--',
      },
      {
        title: '操作',
        dataIndex: '操作',
        key: '操作',
        width: 100,
        fixed: 'right',
        render: (text, record) => {
          // 如果状态是缓发，则显示撤回缓发
          if (record.pay_salary_state === SalaryPaymentState.delayed) {
            return (<div>
              <a target="_blank" href={`/#/Finance/Manage/Summary/Detail/Knight?id=${record._id}`} rel="noopener noreferrer">查看</a>
              {/* 权限操作 可缓发的角色可撤回 */}
              {
                Operate.canOperateFinanceManageSummaryDelay() ? <a className={styles['app-comp-finance-boss-SDC-deloy']} onClick={this.onUpdateSalaryMarkNormal.bind(this, record._id)}>撤回标记</a> : ''
              }
            </div>);
          } else {
            return <a target="_blank" href={`/#/Finance/Manage/Summary/Detail/Knight?id=${record._id}`} rel="noopener noreferrer">查看</a>;
          }
        },
      },
    ];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };

    // 服务费查询列表，批量缓发按钮(城市经理，城市助理) && 能够进行缓发操作（历史注释）
    let rowSelection;
    // 2018-04-17: 所有勾选改功能的角色都可操作批量缓发。
    if (Operate.canOperateFinanceManageSummaryDelay() && canDelay) {
      rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
          this.setState({
            selectedRowKeys: selectedKeys,
          });
        },
      };
    }

    return (
      <CoreContent>
        <div className="app-global-mgb10" >
          {/* 渲染缓发按钮 */}
          {this.renderDelayed()}
        </div>
        {/* 数据 */}
        <Table rowKey={record => record._id} rowSelection={rowSelection} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: 8000 }} />
      </CoreContent>
    );
  }

  render() {
    const { renderSearch, renderMeituanContent, renderElmaContent, renderEleSummayInfo, renderMeituanSummayInfo } = this;
    const { platformCode } = this.state;
    if (platformCode === 'meituan') {
      return (
        <div>
          {/* 渲染搜索框 */}
          {renderSearch()}

          <Alert showIcon message="请确保查看的商圈存在骑士和有效的服务费规则，若没有则不显示结算单。" type="info" />
          <br />

          {/* 渲染汇总信息 */}
          {renderMeituanSummayInfo()}

          { /* 渲染美团内容 */}
          {renderMeituanContent()}
        </div>
      );
    } else if (platformCode === 'elem') {
      return (
        <div>
          {/* 渲染搜索框 */}
          {renderSearch()}

          <Alert showIcon message="请确保查看的商圈存在骑士和有效的服务费规则，若没有则不显示结算单。" type="info" />
          <br />

          {/* 渲染汇总信息 */}
          {renderEleSummayInfo()}

          { /* 渲染饿了吗内容 */}
          {renderElmaContent()}
        </div>
      );
    }
    return (<Empty />);
  }
}

function mapStateToProps({ financeSummaryManage: { salaryRecords, salaryRecordsInfo } }) {
  return { salaryRecords, salaryRecordsInfo };
}

export default connect(mapStateToProps)(Form.create()(IndexPage));
