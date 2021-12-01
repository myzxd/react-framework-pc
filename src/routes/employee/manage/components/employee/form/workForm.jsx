/**
 * 员工档案 - 创建 - 工作信息tab
 */
import _ from 'lodash';
import dot from 'dot-prop';
import React, {
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Form,
  Button,
  Select,
  Row,
  Col,
  message,
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  FileType,
  EmployeePageSetp,
} from '../../../../../../application/define';
import { CoreForm } from '../../../../../../components/core';
import DepAndPostItem from './depAndPostItems';

import style from './style.less';

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const { Option } = Select;

const WorkForm = forwardRef(({
  fileType = FileType.staff,
  setTabKey,
  onChangeTabKeys,
  departmentTree, // 部门树
  employeeId, // 员工id
  dispatch,
  employeeDetail = {}, // 员工详情
  onSave, // 编辑保存
  onBack, // 返回
}, ref) => {
  const [form] = Form.useForm();

  const { default: dataSource = [] } = departmentTree;
  // generateTree
  const generateTree = (treeNodes = []) => {
    return treeNodes.map((i) => {
      if (i.node) {
        return {
          title: i.node.name,
          value: i.node._id,
          key: i.node._id,
          children: generateTree(i.leaf),
        };
      }
    });
  };

  // 部门树
  const treeData = generateTree(dataSource);

  // 部门岗位
  const renderDepartmentForm = () => {
    return (
      <Form.List
        name="department_job_relation_list"
      >
        {
          (fields, { add, remove }) => {
            const initVal = {
              department_id: undefined,
              major_job_id: undefined,
              department_job_relation_id: undefined,
              job_flag: false,
              is_organization: true,
            };
            return (
              <React.Fragment>
                {
                  fields.map((field, fieldKey) => {
                    return (
                      <Row key={fieldKey}>
                        <DepAndPostItem
                          departmentTree={treeData}
                          form={form}
                          field={field}
                          fieldKey={fieldKey}
                        />
                        <Col span={2}>
                          {
                            fields.length > 1 ?
                              (
                                <Button
                                  onClick={() => remove(field.name)}
                                  shape="circle"
                                  icon={<MinusOutlined />}
                                  style={{ marginRight: 10 }}
                                />
                              ) : ''
                          }
                          {
                            fieldKey === fields.length - 1
                              ? (
                                <Button
                                  onClick={() => add(initVal)}
                                  shape="circle"
                                  icon={<PlusOutlined />}
                                />
                              ) : ''
                          }
                        </Col>
                      </Row>
                    );
                  })
                }
              </React.Fragment>
            );
          }
        }
      </Form.List>
    );
  };

  const items = [
    <Form.Item
      label="档案类型"
      name="profile_type"
      rules={[
        { required: true, message: '请选择档案类型' },
      ]}
      {...formLayout}
    >
      <Select placeholder="请选择档案类型">
        {
          fileType === FileType.second && (
            <Option
              value={FileType.second}
            >{FileType.description(FileType.second)}</Option>
          )
        }
        {
          fileType === FileType.staff && (
            <Option
              value={FileType.staff}
            >{FileType.description(FileType.staff)}</Option>
          )
        }
      </Select>
    </Form.Item>,
  ];

  // 暴露ref
  useImperativeHandle(ref, () => form);

  // 上一步
  const onUpStep = () => {
    setTabKey(EmployeePageSetp.basic);
  };

  // 下一步
  const onDownStep = () => {
    form.validateFields().then((values = {}) => {
      const {
        department_job_relation_list: departmentList = [],
      } = values;

      // 关联的部门岗位关系id（去重）
      const relationList = _.uniqWith(
        departmentList.map(i => i.department_job_relation_id),
        _.isEqual,
      );

      // 是否为主岗
      const jobFlagList = departmentList.map(i => i.job_flag);

      if (!jobFlagList.includes(true)) {
        return message.error('请设置主岗');
      }

      // 判断是否有重复的部门岗位
      if (relationList.length !== departmentList.length) {
        return message.error('选择的部门和岗位不能重复');
      }
      setTabKey(EmployeePageSetp.contract);
      onChangeTabKeys(EmployeePageSetp.contract);
      // 表单校验，跳转第一个报错字段
    }).catch((error) => {
      form.scrollToField(
        error.errorFields[0].name,
        {
          behavior: actions => actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
        },
      );
    });
  };

  // 提交
  const onUpdate = () => {
    form.validateFields().then((values) => {
      const {
        department_job_relation_list: departmentList = [],
      } = values;

      // 关联的部门岗位关系id（去重）
      const relationList = _.uniqWith(
        departmentList.map(i => i.department_job_relation_id),
        _.isEqual,
      );

      // 是否为主岗
      const jobFlagList = departmentList.map(i => i.job_flag);

      if (!jobFlagList.includes(true)) {
        return message.error('请设置主岗');
      }

      // 判断是否有重复的部门岗位
      if (relationList.length !== departmentList.length) {
        return message.error('选择的部门和岗位不能重复');
      }

      onSave && onSave(values);
      // 表单校验，跳转第一个报错字段
    }).catch((error) => {
      form.scrollToField(
        error.errorFields[0].name,
        {
          behavior: actions => actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
        },
      );
    });
  };

  // 创建页操作
  const renderCreateOperation = () => {
    return (
      <div
        className={style['contract-tab-scroll-button']}
      >
        <Button
          onClick={() => form.setFieldsValue(getInitivalValues())}
          style={{
            marginRight: 10,
          }}
        >重置</Button>
        <Button
          onClick={onUpStep}
          type="primary"
          style={{
            marginRight: 10,
          }}
        >上一步</Button>
        <Button
          onClick={onDownStep}
          type="primary"
        >下一步</Button>
      </div>
    );
  };

  // 编辑页操作
  const renderUpdateOperation = () => {
    return (
      <div
        className={style['contract-tab-scroll-button']}
      >
        <Button
          onClick={onBack}
          style={{
            marginRight: 10,
          }}
        >返回</Button>
        <Button
          onClick={() => form.setFieldsValue(getInitivalValues())}
          style={{
            marginRight: 10,
          }}
        >重置</Button>
        <Button
          onClick={onUpdate}
          type="primary"
        >提交</Button>
      </div>
    );
  };

  // 获取默认值
  const getInitivalValues = () => {
    // 副岗
    const deputyPost = dot.get(employeeDetail, 'pluralism_department_job_relation_list', []).map(deputy => (
      {
        department_id: dot.get(deputy, 'department_info._id'),
        major_job_id: dot.get(deputy, 'job_info._id'),
        department_job_relation_id: deputy._id,
        job_flag: false,
        is_organization: true,
      }
    ));

    // 默认部门岗位value
    const initDepartment = [
      {
        department_id: dot.get(employeeDetail, 'department_job_relation_info.department_info._id'),
        major_job_id: dot.get(employeeDetail, 'department_job_relation_info.job_info._id'),
        department_job_relation_id: dot.get(employeeDetail, 'department_job_relation_info._id'),
        job_flag: true,
        is_organization: dot.get(employeeDetail, 'is_organization'),
      },
      ...deputyPost,
    ];

    // initialValues
    const initialValues = {
      department_job_relation_list: employeeDetail.department_job_relation_info ? initDepartment : [{
        department_id: undefined,
        major_job_id: undefined,
        department_job_relation_id: undefined,
        job_flag: true,
        is_organization: true,
      }],
      profile_type: employeeDetail.profile_type || FileType.staff,
    };
    return initialValues;
  };

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <Form
            form={form}
            initialValues={getInitivalValues()}
            className="affairs-flow-basic"
          >
            <CoreForm items={items} />
            {renderDepartmentForm()}
          </Form>
        </div>
        {
        employeeId ?
          renderUpdateOperation()
          : renderCreateOperation()
      }
      </div>
    </React.Fragment>
  );
});

export default WorkForm;
