/**
 * 员工档案 - 员工详情 - 合同tab
 */
import moment from 'moment';
import React from 'react';
import {
  Form,
  Button,
} from 'antd';
import {
  CoreForm,
  CorePhotosAmazon,
  CoreContent,
} from '../../../../../../components/core';
import {
  SignContractType,
  TimeCycle,
  ContractType,
  StaffTag,
  StaffSate,
  StaffType,
} from '../../../../../../application/define';
import { utils } from '../../../../../../application';

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const formOneLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

const ContractInfo = ({
  newContractInfo = {}, // 员工合同详情
  onBack,
  employeeDetail = {}, // 员工档案详情
}) => {
  const {
    sign_type: signType, // 签约类型
    current_start_at: currentStateAt, // 当前合同生效日期
    sign_cycle: signCycle,
    sign_cycle_unit: signCycleUnit,
    current_end_at: currentEndAt, // 当前合同结束日期
    contract_belong_info: contractBelongInfo, // 合同甲方
    contract_type: contractType, // 合同类型
    // 合同照片
    contract_photo_list: contractPhotoList,
    contract_photo_url_list: contractPhotoUrlList,
  } = newContractInfo;

  const {
    state, // 员工状态
    employee_type: employeeType, // 员工类型
    signed_date: employeeSignedDate, // 首合同生效日期
  } = employeeDetail;

  // 员工标签（过滤出历史数据中，‘兼职’数据）
  const workLabel = utils.dotOptimal(employeeDetail, 'work_label', []).filter(w => w !== StaffTag.partTime);

  // 上传图片
  const renderPhoto = (namespace, value = {}) => {
    if (!Array.isArray(value.keys)
      || !Array.isArray(value.urls)
      || value.keys.length < 1
      || value.urls.length < 1
    ) {
      return (
        <div
          style={{
            width: 104,
            height: 104,
            backgroundColor: '#eee',
            textAlign: 'center',
            lineHeight: '104px',
          }}
        >
          暂无
        </div>
      );
    }
    return (
      <CorePhotosAmazon
        isDisplayMode
        value={value}
        namespace={namespace}
        domain="staff"
      />
    );
  };


  const items = [
    <Form.Item
      label="签约类型"
      {...formLayout}
    >
      {signType ? SignContractType.description(signType) : '--'}
    </Form.Item>,
    <Form.Item
      label="首合同生效日期"
      {...formLayout}
    >
      {employeeSignedDate ? moment(String(employeeSignedDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="当前合同生效日期"
      {...formLayout}
    >
      {currentStateAt ? moment(String(currentStateAt)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="签约周期"
      {...formLayout}
    >
      {
        signCycle && signCycleUnit ?
          `${signCycle}${TimeCycle.description(signCycleUnit)}`
          : '--'
      }
    </Form.Item>,
    <Form.Item
      label="当前合同结束日期"
      {...formLayout}
    >
      {currentEndAt ? moment(String(currentEndAt)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="合同甲方"
      {...formLayout}
    >
      {(contractBelongInfo && contractBelongInfo.name) || '--'}
    </Form.Item>,
    <Form.Item
      label="合同类型"
      {...formLayout}
    >
      {contractType ? ContractType.description(contractType) : '--'}
    </Form.Item>,
    <Form.Item
      label="合同编号"
      {...formLayout}
    >
      {newContractInfo.contract_no || '--'}
    </Form.Item>,
    <Form.Item
      label="员工状态"
      {...formLayout}
    >
      {
        state ?
          StaffSate.description(state) : '--'
      }
    </Form.Item>,
    <Form.Item
      label="员工类型"
      {...formLayout}
    >
      {
        employeeType ?
          StaffType.description(employeeType) : '--'
      }
    </Form.Item>,
    <Form.Item
      label="员工标签"
      {...formLayout}
    >
      {
        Array.isArray(workLabel) && workLabel.length > 0 ?
          workLabel.map(i => StaffTag.description(i)).join('、')
          : '--'
      }
    </Form.Item>,
    {
      span: 24,
      render: (
        <Form.Item
          label="合同照片"
          {...formOneLayout}
        >
          {renderPhoto('contract_photo_list', {
            keys: contractPhotoList ? contractPhotoList : [],
            urls: contractPhotoUrlList ? contractPhotoUrlList : [],
          })}
        </Form.Item>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <CoreContent title="合同/协议信息">
            <Form
              className="affairs-flow-basic"
            >
              <CoreForm items={items} />
            </Form>
          </CoreContent>
        </div>
        <div
          className={style['contract-tab-scroll-button']}
        >
          <Button
            onClick={onBack}
          >返回</Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ContractInfo;
