/**
 * 员工档案 - 部门岗位 - form,list - item
 **/
import React, { useState, useRef, useEffect } from 'react';

import {
  Form,
  Col,
  Switch,
  message,
} from 'antd';

import { cryptoRandomString } from '../../../../../../application/utils';
import Department from '../../other/department';
import Post from '../../other/post';
import Operate from '../../../../../../application/define/operate';

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const formSwitchLayout = { labelCol: { span: 14 }, wrapperCol: { span: 8 } };

const DepAndPostItem = ({
  form,
  field,
  fieldKey,
  departmentTree, // 部门树
}) => {
  const intervalRef = useRef(cryptoRandomString(32));
  // 部门&岗位form list表单值
  const formVal = form.getFieldValue('department_job_relation_list') || [];
  // 当前部门&岗位form item值
  const curVal = formVal[fieldKey] || {};

  // 当前选择的部门id
  const [departmentId, setDepartmentId] = useState();

  useEffect(() => {
    if (curVal && curVal.department_id) {
      setDepartmentId(curVal.department_id);
      return;
    }
    setDepartmentId();
  }, [curVal]);

  // 部门onChange
  const onChangeDepartment = (val) => {
    setDepartmentId(val);
    const updateFormVal = [...formVal];
    updateFormVal[fieldKey].department_id = val;
    updateFormVal[fieldKey].department_job_relation_id = undefined;
    updateFormVal[fieldKey].major_job_id = undefined;
    form.setFieldsValue({ department_job_relation_list: updateFormVal });
  };

  // 岗位onChanage
  const onChangePost = (val, option = {}) => {
    const updateFormVal = [...formVal];
    const jobId = option.props ? option.props.job_id : undefined;
    updateFormVal[fieldKey].department_job_relation_id = val;
    updateFormVal[fieldKey].major_job_id = jobId;
    form.setFieldsValue({ department_job_relation_list: updateFormVal });
  };

  // 设置主岗
  const onChangeLord = (val) => {
    // 要更新的form values
    let updateFormVal = [
      ...formVal,
    ];
    if (!curVal.department_job_relation_id) {
      updateFormVal[fieldKey] = {
        ...curVal,
        job_flag: false,
      };
      form.setFieldsValue({ department_job_relation_list: updateFormVal });
      return message.error('请选择岗位');
    }

    if (val) {
      updateFormVal = updateFormVal.map((v) => {
        return {
          ...v,
          job_flag: false,
        };
      });
      updateFormVal[fieldKey] = {
        ...curVal,
        job_flag: val,
      };
    } else {
      updateFormVal[fieldKey] = {
        ...curVal,
        job_flag: val,
      };
    }
    form.setFieldsValue({ department_job_relation_list: updateFormVal });
  };

  // 占编onChanage
  const onChageAccountedFor = (val) => {
    const updateFormVal = [...formVal];
    updateFormVal[fieldKey].is_organization = !val;
    form.setFieldsValue({ department_job_relation_list: updateFormVal });
  };

  return (
    <React.Fragment>
      <Col span={8}>
        <Form.Item
          label="所属部门"
          name={[field.name, 'department_id']}
          fieldKey={[field.fieldKey, fieldKey]}
          rules={[
            { required: true, message: '请选择部门' },
          ]}
          {...formLayout}
        >
          <Department
            departmentTree={departmentTree}
            onChange={onChangeDepartment}
          />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          label="岗位"
          name={[field.name, 'department_job_relation_id']}
          fieldKey={[field.fieldKey, fieldKey]}
          rules={[
            { required: true, message: '请选择岗位' },
          ]}
          {...formLayout}
        >
          <Post
            onChange={onChangePost}
            departmentId={departmentId}
            namespace={intervalRef.current}
          />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          label="设置为主岗位"
          name={[field.name, 'job_flag']}
          fieldKey={[field.fieldKey, fieldKey]}
          {...formSwitchLayout}
        >
          <Switch
            checked={curVal.job_flag || false}
            onChange={onChangeLord}
          />
        </Form.Item>
      </Col>
      {
        (curVal.job_flag && Operate.canOperateEmployeeCreateIsOrganization()) && (
          <Col span={4}>
            <Form.Item
              label="不计入占编数统计"
              name={[field.name, 'is_organization']}
              fieldKey={[field.fieldKey, fieldKey]}
              {...formSwitchLayout}
            >
              <Switch
                onChange={onChageAccountedFor}
                checked={!curVal.is_organization || false}
              />
            </Form.Item>
          </Col>
        )
      }
    </React.Fragment>
  );
};

export default DepAndPostItem;
