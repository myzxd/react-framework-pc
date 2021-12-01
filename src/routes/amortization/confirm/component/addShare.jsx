/**
 * 摊销管理 - 摊销确认表 - 添加分摊数据modal
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import moment from 'moment';
import React, { useState, useRef } from 'react';
import {
  Button,
  Modal,
  Table,
  Form,
  Radio,
  Tooltip,
  message,
} from 'antd';
import {
  Unit,
  CodeApproveOrderPayState,
  ExpenseExamineOrderProcessState,
  CodeRecordBillRedPushState,
  CodeCostCenterType,
} from '../../../../application/define';
import {
  CoreContent,
  CoreSearch,
} from '../../../../components/core';

import Subject from '../../component/subject'; // 科目名称（code系统）
import Scenes from '../../component/scenes'; // 场景（code系统）
import Platform from '../../component/platform'; // 平台（code系统）
import MainBody from '../../component/mainBody'; // 主体（code系统）
import Project from '../../component/project'; // 项目（code系统）

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const AddShare = ({
  dispatch,
  recordList = {},
  getAmortizationList,
}) => {
  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
  });

  // form
  const [form, setForm] = useState({});
  // modal visible
  const [visible, setVisible] = useState(false);
  // table loading
  const [loading, setLoading] = useState(false);
  // selectedRowKeys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // button loading
  const [btnLoading, setBtnLoading] = useState(false);
  // 科目类型
  const [costCenterType, setCostCenterType] = useState(CodeCostCenterType.code);

  // 获取记录明细list
  const getRecordList = () => {
    // 设置列表loading
    setLoading(true);

    // 重置上次查询数据
    dispatch({ type: 'costAmortization/resetRecordList' });

    dispatch({
      type: 'costAmortization/getRecordList',
      payload: {
        ...searchVal.current,
        setLoading: () => setLoading(false),
      },
    });
  };

  // 科目类型onChange
  const onChangeReportType = (v) => {
    form && form.setFieldsValue({ subject: undefined });
    setCostCenterType(v.target.value);
  };

  // onCancel
  const onCancel = () => {
    // 重置selectedRowKeys
    setSelectedRowKeys([]);
    // 隐藏表单
    setVisible(false);
    form.resetFields();
  };

  // onSearch
  const onSearch = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
    };
    // 清空selectedRowKeys
    setSelectedRowKeys([]);

    // 重新获取数据
    getRecordList();
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };

    // 清空selectedRowKeys
    setSelectedRowKeys([]);

    // 重新获取数据
    getRecordList();
  };

  // 确认添加
  const onSubmit = async () => {
    setBtnLoading(true);
    const res = await dispatch({
      type: 'costAmortization/onAddShareList',
      payload: { ids: selectedRowKeys },
    });

    if (res && res.zh_message) {
      setBtnLoading(false);
      return message.error(res.zh_message);
    }

    if (res && res.result) {
      message.success('请求成功');

      // 清空selectedRowKeys
      setSelectedRowKeys([]);

      // 重新获取费用单数据
      getRecordList();

      // 获取摊销列表
      getAmortizationList && getAmortizationList();

      setBtnLoading(false);

      // 隐藏表单
      setVisible(false);
    }
  };

  // search
  const renderSearch = () => {
    // 公共select属性
    const commonSelectProps = {
      placeholder: '请选择',
      allowClear: true,
      mode: 'multiple',
      optionFilterProp: 'children',
    };

    const items = [
      <Form.Item
        label="科目类型"
        name="reportType"
        {...formLayout}
      >
        <Radio.Group onChange={onChangeReportType}>
          <Radio
            value={CodeCostCenterType.code}
          >{CodeCostCenterType.description(CodeCostCenterType.code)}</Radio>
          <Radio
            value={CodeCostCenterType.team}
          >{CodeCostCenterType.description(CodeCostCenterType.team)}</Radio>
        </Radio.Group>
      </Form.Item>,
      <Form.Item
        label="科目名称"
        name="subject"
        {...formLayout}
      >
        <Subject
          {...commonSelectProps}
          costCenterType={costCenterType}
          namespace={`${CodeCostCenterType.description(costCenterType)}_data`}
        />
      </Form.Item>,
      <Form.Item
        label="场景"
        name="scenes"
        {...formLayout}
      >
        <Scenes {...commonSelectProps} />
      </Form.Item>,
      <Form.Item
        label="平台"
        name="platform"
        {...formLayout}
      >
        <Platform {...commonSelectProps} />
      </Form.Item>,
      <Form.Item
        label="主体"
        name="body"
        {...formLayout}
      >
        <MainBody {...commonSelectProps} />
      </Form.Item>,
      <Form.Item
        label="项目"
        name="project"
        {...formLayout}
      >
        <Project {...commonSelectProps} />
      </Form.Item>,
    ];

    const sProps = {
      items,
      onSearch,
      onReset: onSearch,
      onHookForm: hForm => setForm(hForm),
      initialValues: {
        reportType: CodeCostCenterType.code, // 提报日期
      },
    };

    return (
      <CoreContent className="affairs-flow-basic">
        <CoreSearch {...sProps} />
      </CoreContent>
    );
  };

  // 渲染标签
  const renderTags = (tagsList, type) => {
    // 标签数据大于三个
    if (Array.isArray(tagsList) && tagsList.length > 3) {
      const title = type === 'inspect' ?
        tagsList.map(t => t.name).join(' 、 ')
        : tagsList.map(t => t).join(' 、 ');
      return (
        <Tooltip title={title}>
          <div>
            {
              type === 'inspect' ?
                tagsList.slice(0, 3).map(t => t.name).join(' 、 ')
                : tagsList.slice(0, 3).map(t => t).join(' 、 ')
            }...</div>
        </Tooltip>
      );
    }

    // 标签数据小于三个
    if (Array.isArray(tagsList) && tagsList.length <= 3 && tagsList.length > 0) {
      return (
        <div>
          {
            type === 'inspect' ?
              tagsList.map(t => t.name).join('、')
              : tagsList.map(t => t).join('、')
          }
        </div>
      );
    }

    return '--';
  };

  // table
  const renderTable = () => {
    const { data = [], _meta: meta = {} } = recordList;
    const columns = [
      {
        title: '费用单',
        dataIndex: '_id',
        fixed: 'left',
        width: 120,
        render: text => text || '--',
      },
      {
        title: '审批单',
        dataIndex: 'oa_order_id',
        fixed: 'left',
        width: 120,
        render: text => text || '--',
      },
      {
        title: '主题标签',
        dataIndex: 'theme_label_list',
        width: 120,
        render: text => renderTags(text),
      },
      {
        title: '科目名称',
        dataIndex: 'biz_account_info',
        width: 200,
        render: (text = {}) => {
          const { name, ac_code: code } = text;
          return (
            <span>
              {name || '--'}
              {code ? `(${code})` : ''}
            </span>
          );
        },
      },
      {
        title: '核算中心',
        dataIndex: 'cost_center_type',
        width: 120,
        render: (text, rec) => {
          let type = '--';
          // code
          if (text === CodeCostCenterType.code) {
            type = dot.get(rec, 'biz_code_info.name', '--');
          }

          // team
          if (text === CodeCostCenterType.team) {
            type = dot.get(rec, 'biz_team_info.name', '--');
          }

          return type;
        },
      },
      {
        title: '发票抬头',
        dataIndex: 'invoice_title',
        width: 200,
        render: text => text || '--',
      },
      {
        title: '付款金额',
        dataIndex: 'payment_total_money',
        width: 120,
        render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '--'),
      },
      {
        title: '红冲金额',
        dataIndex: 'total_tax_amount_amount',
        width: 120,
        render: (text, rec) => {
          const { bill_red_push_state: billRedPushState } = rec;
          // 已红冲，红冲金额为税金
          if (billRedPushState === CodeRecordBillRedPushState.right) {
            return (text ? Unit.exchangePriceCentToMathFormat(text) : Unit.exchangePriceCentToMathFormat(0));
          }
          // 否则为0
          return Unit.exchangePriceCentToMathFormat(0);
        },
      },
      {
        title: '单据状态',
        dataIndex: 'state',
        width: 100,
        render: text => (text ? ExpenseExamineOrderProcessState.description(text) : '--'),
      },
      {
        title: '付款状态',
        dataIndex: 'paid_state',
        width: 100,
        render: text => (text ? CodeApproveOrderPayState.description(text) : '--'),
      },
      {
        title: '提报时间',
        dataIndex: 'submit_at',
        width: 160,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '付款时间',
        dataIndex: 'paid_at',
        width: 160,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
    ];

    // rowSelection
    const rowSelection = {
      selectedRowKeys,
      columnWidth: 60,
      onChange: val => setSelectedRowKeys(val),
    };

    // pagination
    const pagination = {
      current: meta.page || 1,
      defaultPageSize: 30,
      pageSize: meta.page_size || 30,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: onChangePage,
      onShowSizeChange: onChangePage,
      showTotal: showTotal => `总共${showTotal}条`,
      total: meta.result_count,
      pageSizeOptions: ['10', '20', '30', '40'],
    };

    return (
      <CoreContent
        title="费用记录明细"
        style={{ marginBottom: 0, paddingBottom: 0 }}
      >
        <Table
          rowKey={(re, key) => re._id || key}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          rowSelection={rowSelection}
          bordered
          loading={loading}
          scroll={{ y: 150, x: 1700 }}
        />
      </CoreContent>
    );
  };

  // modal
  const renderModal = () => {
    return (
      <Modal
        title="添加分摊数据"
        visible={visible}
        okText="确认添加"
        width="70%"
        okButtonProps={{
          disabled: selectedRowKeys.length < 1,
        }}
        onOk={onSubmit}
        confirmLoading={btnLoading}
        style={{
          maxHeight: '600px',
          // overflowY: 'scroll',
          paddingBottom: 0,
          top: '55px',
        }}
        onCancel={onCancel}
      >
        {/* search */}
        {renderSearch()}
        {/* table */}
        {renderTable()}
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {renderModal()}
      <Button
        type="primary"
        onClick={() => setVisible(true)}
      >添加分摊数据</Button>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  costAmortization: { recordList },
}) => {
  return { recordList };
};

export default connect(mapStateToProps)(AddShare);
