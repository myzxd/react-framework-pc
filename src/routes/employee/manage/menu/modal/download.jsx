/**
 * 员工档案 - 搜索 - 下载弹窗
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import { ExclamationCircleFilled } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Modal, Alert, Radio, Checkbox, Tooltip } from 'antd';

import { CommonSelectSuppliers, CommonSelectPlatforms, CommonSelectDistricts, CommonSelectCities } from '../../../../../components/common';
import { DeprecatedCoreForm, CoreContent } from '../../../../../components/core';
import { system } from '../../../../../application';
import ComponentTeam from '../components/codeTeam';
import ComponentTeamType from '../components/codeTeamType';
import { SupplierState, OaApplicationFlowRegulation, StaffTeamRank } from '../../../../../application/define';

const codeFlag = system.isShowCode(); // 判断是否是code

function DownloadModal(props) {
  const [fields, setFields] = useState({
    platforms: '',                             // 平台
    suppliers: '',                             // 供应商(页面组件选中使用)
    cities: '',                                // 城市(页面组件选中使用)
    districts: '',                             // 商圈
  });
  const [citySpelling, setCitySpelling] = useState('');
  const [filterDisable, setFilterDisable] = useState(true); // 是否过滤禁用的商圈

  const { onHideModal } = props;

  // 重置数据
  const onReset = () => {
    const params = {
      platforms: '',            // 平台
      suppliers: '',            // 供应商(页面组件选中使用)
      cities: '',               // 城市(页面组件选中使用)
      districts: '',            // 商圈
      filterDistricts: OaApplicationFlowRegulation.is,      // 是否过滤禁用商圈数据
      filterArchives: OaApplicationFlowRegulation.is,       // 是否过滤解约档案
    };
    setFields(params);
    // 重置表单
    props.form.resetFields();
  };

   // 隐藏弹窗
  const onCancel = () => {
    if (onHideModal) {
      onHideModal();
    }
    // 重置数据
    onReset();
  };

   // 提交
  const onSubmit = (e) => {
    const { fileType } = props;
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { platforms, suppliers, cities, districts, filterDistricts, filterArchives, staffTeamRank, codeTeamType, codeTeam } = values;
      const params = {
        staffTeamRank,        // 团队中的身份
        platforms: [platforms],            // 平台
        suppliers,            // 供应商(页面组件选中使用)
        cities,               // 城市(页面组件选中使用)
        districts,            // 商圈
        fileType,             // 档案类型
        filterDistricts,      // 是否过滤禁用商圈数据
        filterArchives,       // 是否过滤解约档案
        codeTeamType,         // team类型
        codeTeam,             // team信息
      };
      props.dispatch({ type: 'employeeManage/downloadStaffContractTeam', payload: params });
      if (onHideModal) {
        onHideModal();
      }
      // 重置数据
      onReset();
    });
  };

  // 更换平台
  const onChangePlatforms = (e) => {
    const { form } = props;
    fields.platforms = e;
    fields.suppliers = [];
    fields.cities = [];
    fields.districts = [];
    setFields(fields);
    setCitySpelling([]);

    // 清空选项
    form.setFieldsValue({ suppliers: [] });
    form.setFieldsValue({ cities: [] });
    form.setFieldsValue({ districts: [] });
  };

   // 更换供应商
  const onChangeSuppliers = (e) => {
    const { form } = props;
    fields.suppliers = e;
    fields.cities = [];
    fields.districts = '';
    setFields(fields);
    setCitySpelling([]);

    // 清空选项
    form.setFieldsValue({ cities: [] });
    form.setFieldsValue({ districts: [] });
  };

  // 更换城市
  const onChangeCity = (e, options) => {
    const { form } = props;
    const citySpell = options.map(option => dot.get(option, 'props.spell', []));
    // 保存城市参数
    fields.cities = e;
    fields.districts = [];
    setFields(fields);
    setCitySpelling(citySpell);
    form.setFieldsValue({ districts: [] });
  };

  // 更换区域
  const onChangeDistrict = (e) => {
    fields.districts = e;
    setFields(fields);
  };

  // 归属team类型
  const onChangeCodeTeamType = () => {
    const { form } = props;
    // 清空team类型
    form.setFieldsValue({ codeTeam: undefined });
  };

  // 是否改变过滤商圈
  const onFilterDistricts = (e) => {
    const { form } = props;
    // 是否过滤商圈禁用的数据
    setFilterDisable(e.target.value);
    // 当过滤商圈更改的时候,清空商圈数据
    form.setFieldsValue({ districts: [] });
  };

// 渲染提示信息
  const renderPromptInfo = () => {
    return (
      <CoreContent style={{ backgroundColor: '#FFF' }}>
        <Alert message="导出的excel会根据成员加入的团队（工作信息）来展示信息！请关注任务列表的状态，及时进行下载！" type="warning" showIcon />
      </CoreContent>
    );
  };

  // 渲染添加标签的表单
  const renderCreateForm = () => {
    const { getFieldDecorator, getFieldValue } = props.form;
    const { platforms, suppliers } = fields;
    const formItems = [
      {
        label: '团队中的身份',
        form: getFieldDecorator('staffTeamRank', { initialValue: [StaffTeamRank.first], rules: [{ required: true, message: '请选择' }] })(
          <Checkbox.Group>
            <Checkbox value={StaffTeamRank.first}>{StaffTeamRank.description(StaffTeamRank.first)}</Checkbox>
            <Checkbox value={StaffTeamRank.second}>{StaffTeamRank.description(StaffTeamRank.second)}</Checkbox>
          </Checkbox.Group>,
        ),
      },
      {
        label: '平台',
        form: getFieldDecorator('platforms', { rules: [{ required: true, message: '请选择平台' }], initialValue: undefined })(
          <CommonSelectPlatforms namespace="export" allowClear showSearch optionFilterProp="children" placeholder="请选择平台" onChange={onChangePlatforms} />,
        ),
      }, {
        label: '供应商',
        form: getFieldDecorator('suppliers', { rules: [{ required: false, message: '请选择供应商' }], initialValue: undefined })(
          <CommonSelectSuppliers namespace="export" showArrow mode="multiple" state={SupplierState.enable} isExpenseModel enableSelectAll allowClear showSearch optionFilterProp="children" platforms={platforms} placeholder="请选择供应商" onChange={onChangeSuppliers} />,
        ),
      }, {
        label: '城市',
        form: getFieldDecorator('cities', { rules: [{ required: false, message: '请选择城市' }], initialValue: undefined })(
          <CommonSelectCities namespace="export" isExpenseModel enableSelectAll showArrow allowClear mode="multiple" showSearch optionFilterProp="children" placeholder="请选择城市" platforms={platforms} suppliers={suppliers} onChange={onChangeCity} />,
        ),
      }, {
        label: '过滤停用商圈',
        form: getFieldDecorator('filterDistricts', { rules: [{ required: true, message: '是否过滤停用商圈' }], initialValue: OaApplicationFlowRegulation.is })(
          <Radio.Group name="radiogroup" onChange={onFilterDistricts}>
            <Radio value={OaApplicationFlowRegulation.is}>{OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.is)}</Radio>
            <Radio value={OaApplicationFlowRegulation.no}>{OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.no)}</Radio>
          </Radio.Group>,
        ),
      }, {
        label: '商圈',
        form: getFieldDecorator('districts', { rules: [{ required: false, message: '请选择商圈' }], initialValue: undefined })(
          <CommonSelectDistricts
            allowClear
            showSearch
            mode="multiple"
            enableSelectAll
            optionFilterProp="children"
            placeholder="请选择商圈"
            platforms={platforms}
            suppliers={suppliers}
            cities={citySpelling}
            filterDisable={filterDisable}
            onChange={onChangeDistrict}
          />,
        ),
      },
      {
        label: '过滤已退出成员',
        form: getFieldDecorator('filterArchives', { rules: [{ required: true, message: '是否过滤解约档案' }], initialValue: OaApplicationFlowRegulation.is })(
          <Radio.Group name="radiogroup">
            <Radio value={OaApplicationFlowRegulation.is}>{OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.is)}</Radio>
            <Radio value={OaApplicationFlowRegulation.no}>{OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.no)}</Radio>
          </Radio.Group>,
        ),
      },
    ];


    // 判断是否是code系统
    if (codeFlag) {
      formItems.unshift(
        {
          label: (<span><Tooltip
            overlayStyle={{ maxWidth: 300 }}
            title="不选择TEAM类型默认导出为全量的TEAM类型数据！"
          ><ExclamationCircleFilled style={{ color: '#faad14' }} /></Tooltip> TEAM类型</span>),
          form: getFieldDecorator('codeTeamType')(
            <ComponentTeamType
              placeholder="请选择归属team类型"
              showSearch
              showArrow
              mode="multiple"
              allowClear
              optionFilterProp="children"
              onChange={onChangeCodeTeamType}
            />,
            ),
        },
        {
          label: (<span><Tooltip
            overlayStyle={{ maxWidth: 300 }}
            title="不选择TEAM信息默认导出为全量的TEAM信息数据！"
          ><ExclamationCircleFilled style={{ color: '#faad14' }} /></Tooltip> TEAM信息</span>),
          form: getFieldDecorator('codeTeam')(
            <ComponentTeam
              placeholder="请选择TEAM信息"
              codeTeamType={getFieldValue('codeTeamType')}
              showSearch
              namespace="downloadModal"
              mode="multiple"
              showArrow
              allowClear
              optionFilterProp="children"
            />,
            ),
        },
      );
    }

    const layout = { labelCol: { span: 5 }, wrapperCol: { span: 15 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  };

  const { isShowModal } = props;
  return (
    <Modal title="导出" visible={isShowModal} onOk={onSubmit} onCancel={onCancel} okText="确定" cancelText="取消">
      {/* 渲染提示信息 */}
      {renderPromptInfo()}
      <Form>
        {renderCreateForm()}
      </Form>
    </Modal>
  );
}

DownloadModal.propTypes = {
  isShowModal: PropTypes.bool, // 弹窗是否可见
  onHideModal: PropTypes.func, // 隐藏弹窗的回调函数
};
DownloadModal.defaultProps = {
  isShowModal: false,          // 弹窗是否可见
  onHideModal: () => {},       // 隐藏弹窗的回调函数
};
function mapStateToProps({ employeeManage }) {
  return { employeeManage };
}
export default connect(mapStateToProps)(Form.create()(DownloadModal));
