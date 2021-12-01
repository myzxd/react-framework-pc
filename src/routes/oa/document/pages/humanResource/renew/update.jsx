/**
 * 人事类 - 合同续签 - 编辑
 */
import React, { useEffect, useState } from 'react';
import { Input, Form } from 'antd';
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import {
  CommonSelectContractCycle,
  CommonSelectCompanies,
} from '../../../../../../components/common';
import {
  PageUpload, PageFormButtons,
  ComponentRenderFlowNames,
} from '../../../components';
import {
  showPlainText,
  showDate,
  showDateAfter,
  dotOptimal,
} from '../../../../../../application/utils';
import {
  ThirdCompanyState,
} from '../../../../../../application/define';
import ExamineFlow from '../../../components/form/flow';

// 表单布局
const FormLayout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

function RenewUpdate({
  query = {}, fetchData, clearData, dataSource = {}, update,
  examineFlowInfo = [],
}) {
  const { id } = query;
  // form的ref
  const [form] = Form.useForm();

  // 加载详情数据
  useEffect(() => {
    fetchData(id);
    return () => clearData();
  }, [fetchData, clearData, id]);

  // 当前选中人的信息
  const [currentJobInfo, setCurrentJobInfo] = useState({});

  // 编辑时给表单初始值
  useEffect(() => {
    if (is.existy(dataSource) && is.not.empty(dataSource)) {
      form.setFieldsValue({
        renewName: dot.get(dataSource, 'creator_info._id'), // 续签人员
        newContractCycle: dot.get(dataSource, 'new_sign_cycle'), // 新合同周期
        newPartA: dot.get(dataSource, 'new_contract_belong_info._id'), // 新合同甲方
        note: dot.get(dataSource, 'note'), // 备注
        assets: PageUpload.getInitialValue(dataSource, 'asset_infos'), // 附件
      });
      setCurrentJobInfo({
        major_job_info: { // 岗位信息
          name: showPlainText(dataSource, 'job_info.name'), // 岗位
          rank: showPlainText(dataSource, 'job_info.rank'), // 职级
        },
        major_department_info: { // 部门信息
          name: showPlainText(dataSource, 'department_info.name'), // 部门
        },
        entry_date: dot.get(dataSource, 'entry_date'), // 入职日期
        signed_date: dot.get(dataSource, 'contract_signed_date'), // 合同生效日期
        expired_date: dot.get(dataSource, 'contract_end_date'), // 合同过期日期
        contract_belong_info: dot.get(dataSource, 'contract_belong_info'), // 成本归属
      });
    }
  }, [dataSource, form]);

  // 基本
  const employeeInfoFormItems = [
    {
      key: '1',
      cols: 3,
      items: [
        <Form.Item label="续签人员">
          {showPlainText(dataSource, 'order_employee_info.name')}
        </Form.Item>,
      ],
    },
    {
      key: '2',
      cols: 3,
      items: [
        <Form.Item label="所在部门">
          {showPlainText(currentJobInfo, 'major_department_info.name')}
        </Form.Item>,
        <Form.Item label="岗位">
          {showPlainText(currentJobInfo, 'major_job_info.name')}
        </Form.Item>,
        <Form.Item label="职级">
          {showPlainText(currentJobInfo, 'major_job_info.rank')}
        </Form.Item>,
      ],
    },
    {
      key: '3',
      cols: 3,
      items: [
        <Form.Item label="入职日期">
          {showDate(currentJobInfo, 'entry_date')}
        </Form.Item>,
      ],
    },
  ];

  // 合同信息
  const contractInfoFormItems = [
    {
      key: '1',
      cols: 3,
      items: [
        <Form.Item label="现行合同开始时间">
          {showDate(currentJobInfo, 'signed_date')}
        </Form.Item>,
        <Form.Item label="现行合同结束时间">
          {showDate(currentJobInfo, 'expired_date')}
        </Form.Item>,
        <Form.Item label="现行合同甲方">
          {showPlainText(currentJobInfo, 'contract_belong_info.name')}
        </Form.Item>,
        <Form.Item label="新合同开始时间">
          {showDateAfter(currentJobInfo, 'expired_date')}
        </Form.Item>,
        <Form.Item
          label="新合同期限"
          name="newContractCycle"
          rules={[{ required: true, message: '请选择' }]}
        >
          <CommonSelectContractCycle />
        </Form.Item>,
        <Form.Item
          label="新合同结束时间"
          shouldUpdate={
            (prevValues, curValues) => prevValues.newContractCycle !== curValues.newContractCycle
          }
        >
          {
            ({ getFieldValue }) => {
              const cycle = getFieldValue('newContractCycle');
              const signAt = currentJobInfo.expired_date;
              if (!cycle || !signAt) return '--';
              return moment(signAt, 'YYYYMMDD').add(cycle, 'y')
                .format('YYYY-MM-DD');
            }
          }
        </Form.Item>,
        <Form.Item
          label="新合同甲方"
          name="newPartA"
          rules={[{ required: true, message: '请选择' }]}
        >
          <CommonSelectCompanies
            initialCompanies={dotOptimal(currentJobInfo, 'contract_belong_info', {})}
            isElectronicSign=""
            state={ThirdCompanyState.on}
            type={3}
          />
        </Form.Item>,
      ],
    },
    {
      key: '2',
      cols: 1,
      items: [
        <Form.Item
          name="note"
          label="备注"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
        >
          <Input.TextArea />
        </Form.Item>,
      ],
    },
    {
      key: '3',
      cols: 1,
      items: [
        <Form.Item
          name="assets"
          label="上传附件"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
        >
          <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
        </Form.Item>,
      ],
    },
  ];

  // 保存
  const onUpdate = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    form.validateFields().then(async (values) => {
      // 锁定按钮不可点击
      onLockHook();
      try {
        // 请求接口
        const ok = await update({
          id, // 续签申请ID
          ...values, // 表单值
          expiredDate: currentJobInfo.expired_date, // 合同到期时间
          onErrorCallback: onUnlockHook,
        });

        if (ok) {
          // 提交成功回调
          onDoneHook();
        } else {
          // 解锁按钮
          onUnlockHook();
        }
      } catch (e) {
        // 解锁按钮
        onUnlockHook();
      }
    });
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form {...FormLayout} form={form}>
      {/* 审批信息 */}
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          isDetail
          flowId={query.flow_id}
          accountId={dot.get(dataSource, 'creator_info._id', undefined)}
          departmentId={dot.get(dataSource, 'creator_department_info._id', undefined)}
          specialAccountId={dot.get(dataSource, 'creator_info._id', undefined)}
        />
      </CoreContent>

      {/* 渲染续签人员信息 */}
      <CoreContent title="续签人员信息">
        {
          employeeInfoFormItems.map(({ key, cols, items }) => (
            <CoreForm key={key} cols={cols} items={items} />
          ))
        }
      </CoreContent>
      {/* 渲染合同信息 */}
      <CoreContent title="合同信息">
        {
          contractInfoFormItems.map(({ key, cols, items }) => (
            <CoreForm key={key} cols={cols} items={items} />
          ))
        }
      </CoreContent>
      {/* 渲染操作 */}
      <PageFormButtons showUpdate query={query} onUpdate={onUpdate} />
    </Form>
  );
}

const mapStateToProps = ({ humanResource: { renewDetail }, oaCommon: { examineFlowInfo } }) => ({
  dataSource: renewDetail, // 续签申请详情
  examineFlowInfo,
});

const mapDispatchToProps = dispatch => ({
  // 获取续签申请详情
  fetchData: id => dispatch({
    type: 'humanResource/fetchRenewOrderDetail',
    payload: { id },
  }),
  // 清空续签申请详情
  clearData: () => dispatch({
    type: 'humanResource/reduceRenewDetail',
    payload: {},
  }),
  // 编辑续签申请
  update: payload => dispatch({
    type: 'humanResource/updateRenewOrder',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RenewUpdate);
