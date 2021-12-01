/**
 * 人员管理 - 人员档案 - 劳动者档案 - content
 */
import React, { useState } from 'react';
import {
  Form,
  Select,
  Input,
  Button,
} from 'antd';
import {
  CoreSearch,
  CoreContent,
} from '../../../../components/core';
import {
  CommonSelectCompanies,
  CommonSelectPlatforms,
  CommonSelectSuppliers,
  CommonSelectCities,
  CommonSelectDistricts,
} from '../../../../components/common';
import { system } from '../../../../application';
import Operate from '../../../../application/define/operate';

import DownloadModal from '../menu/modal/download.jsx';
import ComponentTeam from '../menu/components/codeTeam';
import ComponentTeamType from '../menu/components/codeTeamType';


const { Option } = Select;

// const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };

const codeFlag = system.isShowCode(); // 判断是否是code

const Search = ({
  onSearch,
}) => {
  // form
  const [form, setForm] = useState({});
  // 导出弹窗visible
  const [visible, setVisible] = useState(false);

  // 公共select属性
  const commonSelectProps = {
    placeholder: '请选择',
    allowClear: true,
    mode: 'multiple',
    optionFilterProp: 'children',
  };

  // 公共参数
  const items = [
    <Form.Item
      label="平台"
      name="platforms"
    >
      <CommonSelectPlatforms
        showArrow
        namespace="second-platforms"
        onChange={() => (form && form.setFieldsValue({
          suppliers: undefined,
          cities: undefined,
          districts: undefined,
        }))}
        {...commonSelectProps}
      />
    </Form.Item>,
    <Form.Item
      noStyle
      key="suppliers-wrap"
      shouldUpdate={(prevV, curV) => prevV.platforms !== curV.platforms}
    >
      {
        ({ getFieldValue }) => {
          // 平台
          const platforms = getFieldValue('platforms');
          return (
            <Form.Item label="供应商" name="suppliers">
              <CommonSelectSuppliers
                showArrow
                namespace="second-platforms"
                platforms={platforms}
                onChange={() => (form && form.setFieldsValue({
                  cities: undefined,
                  districts: undefined,
                }))}
                {...commonSelectProps}
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      noStyle
      key="cities-wrap"
      shouldUpdate={(prevV, curV) => (prevV.platforms !== curV.platforms || prevV.suppliers !== curV.suppliers)}
    >
      {
        ({ getFieldValue }) => {
          // 平台
          const platforms = getFieldValue('platforms');
          // 供应商
          const suppliers = getFieldValue('suppliers');
          return (
            <Form.Item label="城市" name="cities">
              <CommonSelectCities
                showArrow
                namespace="second-cities"
                platforms={platforms}
                suppliers={suppliers}
                isExpenseModel
                onChange={() => (form && form.setFieldsValue({
                  districts: undefined,
                }))}
                {...commonSelectProps}
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      noStyle
      key="districts-wrap"
      shouldUpdate={(prevV, curV) => (prevV.platforms !== curV.platforms
        || prevV.suppliers !== curV.suppliers
        || prevV.cities !== curV.cities
      )}
    >
      {
        ({ getFieldValue }) => {
          // 平台
          const platforms = getFieldValue('platforms');
          // 供应商
          const suppliers = getFieldValue('suppliers');
          // 城市
          const cities = getFieldValue('cities');
          return (
            <Form.Item label="商圈" name="districts">
              <CommonSelectDistricts
                showArrow
                namespace="second-districts"
                platforms={platforms}
                suppliers={suppliers}
                cities={cities}
                {...commonSelectProps}
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      label="第三方平台账户ID"
      name="customId"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      noStyle
      key="contractFirstPartyInfo-wrap"
      shouldUpdate={(preV, curV) => (preV.suppliers !== curV.suppliers
        || preV.platforms !== curV.platforms
      )}
    >
      {
        ({ getFieldValue }) => {
          // 供应商
          const suppliers = getFieldValue('suppliers');
          // 平台
          const platforms = getFieldValue('platforms');

          return (
            <Form.Item label="合同甲方" name="contractFirstPartyInfo">
              <CommonSelectCompanies
                showArrow
                isNoState
                suppliers={suppliers}
                platforms={platforms}
                // isElectronicSign={isElectronicSign}
                {...commonSelectProps}
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      label="姓名"
      name="name"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="手机号"
      name="phone"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="身份证号"
      name="identityCardId"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="BOSS人员ID"
      name="bossMemberId"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="风控检测状态"
      name="windControl"
    >
      <Select
        placeholder="请选择"
        allowClear
      >
        <Option
          value={false}
          style={{ color: 'green' }}
        >通过</Option>
        <Option
          value
          style={{ color: 'red' }}
        >
          未通过
        </Option>
      </Select>
    </Form.Item>,
  ];

  // 判断是否是code系统
  if (codeFlag) {
    items[items.length] = (
      <Form.Item
        label="TEAM类型"
        name="codeTeamType"
      >
        <ComponentTeamType
          showArrow
          onChange={() => (form && form.setFieldsValue({ codeTeam: undefined }))}
          {...commonSelectProps}
        />
      </Form.Item>
    );

    items[items.length] = (
      <Form.Item
        noStyle
        key="codeTeam-wrap"
        shouldUpdate={(prevV, curV) => prevV.codeTeamType !== curV.codeTeamType}
      >
        {
          ({ getFieldValue }) => {
            const codeTeamType = getFieldValue('codeTeamType');
            return (
              <Form.Item label="TEAM信息" name="codeTeam">
                <ComponentTeam
                  showArrow
                  namespace="secondSearch"
                  codeTeamType={codeTeamType}
                  {...commonSelectProps}
                />
              </Form.Item>
            );
          }
        }
      </Form.Item>
    );
  }

  // 扩展操作（导出）
  const operations = Operate.canOperateEmployeeSearchExportExcel() ?
    (
      <Button
        type="primary"
        onClick={() => setVisible(true)}
      >导出EXCEL</Button>
    ) : null;

  const sProps = {
    items,
    operations,
    onSearch,
    onReset: onSearch,
    onHookForm: hForm => setForm(hForm),
  };

  // 导出弹窗
  const renderDownloadModal = () => {
    if (!visible) return;
    return (
      <DownloadModal
        onHideModal={() => setVisible(false)}
        isShowModal={visible}
        fileType="second"
      />
    );
  };

  return (
    <CoreContent className="affairs-flow-basic">
      <CoreSearch {...sProps} />

      {/* 导出弹窗 */}
      {renderDownloadModal()}
    </CoreContent>
  );
};

export default Search;
