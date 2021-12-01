/**
 * 员工档案 - 创建 - 职业生涯tab
 */
import moment from 'moment';
import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Button,
  Form,
  DatePicker,
  Row,
  Col,
  Input,
  Collapse,
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';
import {
  EmployeePageSetp,
} from '../../../../../../application/define';

import style from './style.less';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const CareerForm = forwardRef(({
  setTabKey, // 设置当前tab jey
  onChangeTabKeys, // 设置可操作tab key
  onSubmit, // 提交
  employeeId, // 员工id
  dispatch,
  employeeDetail = {}, // 员工详情
  onSave, // 编辑保存
  onBack, // 返回
}, ref) => {
  const [form] = Form.useForm();

  useEffect(() => {
    Object.keys(employeeDetail).length > 0 && (
      form.resetFields()
    );
  }, [form, employeeDetail]);

  // 暴露ref
  useImperativeHandle(ref, () => form);

  // 预计转正日期
  const disabledDateRegularDate = (cur) => {
    const entryDate = form.getFieldValue('entry_date');
    return cur && cur < moment(entryDate).endOf('day');
  };

  // 上一步
  const onUpStep = async () => {
    setTabKey(EmployeePageSetp.contract);
    onChangeTabKeys(EmployeePageSetp.contract);
  };

  // 下一步
  const onDownStep = () => {
    form.validateFields().then(() => {
      setTabKey(EmployeePageSetp.welfare);
      onChangeTabKeys(EmployeePageSetp.welfare);
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

  // 入职日期disabled
  const disabledDateEntryDate = (c) => {
    return c > moment().endOf('day');
  };

  // 入职日期onChange
  const onChangeEntryDate = (d) => {
    if (d) {
      form.setFieldsValue({ regular_date: moment(d).add(3, 'M').subtract(1, 'd') });
    } else {
      form.setFieldsValue({ regular_date: undefined });
    }
  };

  const growUpItems = [
    <Form.Item
      label="入职日期"
      name="entry_date"
      rules={[
        { required: true, message: '请选择入职日期' },
      ]}
      {...formLayout}
    >
      <DatePicker
        disabledDate={disabledDateEntryDate}
        onChange={onChangeEntryDate}
      />
    </Form.Item>,
    <Form.Item
      label="预计转正日期"
      name="regular_date"
      initialValue={employeeDetail.regular_date ? moment(String(employeeDetail.regular_date)) : undefined}
      rules={[
        { required: true, message: '请选择转正日期' },
      ]}
      {...formLayout}
    >
      <DatePicker
        disabledDate={disabledDateRegularDate}
      />
    </Form.Item>,
  ];
  // 判断是否显示实际转正日期
  if (employeeDetail.actual_regular_date) {
    growUpItems.push(
      <Form.Item
        label="实际转正日期"
        {...formLayout}
      >
        {moment(String(employeeDetail.actual_regular_date)).format('YYYY-MM-DD')}
      </Form.Item>,
    );
  }

  // 工作经历
  const renderWorkList = () => {
    return (
      <Form.List
        name="work_experience"
      >
        {
          (fields, { add, remove }) => (
            <React.Fragment>
              {
                fields.map((field, fieldKey) => (
                  <Row key={fieldKey}>
                    <Col span={8}>
                      <Form.Item
                        label="工作单位"
                        name={[field.name, 'employer']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <Input placeholder="请输入工作单位" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="曾任职岗位"
                        name={[field.name, 'position']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <Input placeholder="请输入职位" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="证明人姓名"
                        name={[field.name, 'certifier_name']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <Input placeholder="请输入证明人姓名" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="证明人电话"
                        name={[field.name, 'proof_phone']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <Input placeholder="请输入证明人电话" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="工作时间"
                        name={[field.name, 'work_time']}
                        fieldKey={[field.fieldKey, fieldKey]}
                        {...formLayout}
                      >
                        <RangePicker />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      {
                        fields.length > 1 ?
                          (
                            <Button
                              onClick={() => remove(field.name)}
                              shape="circle"
                              icon={<MinusOutlined />}
                              style={{ margin: '0 4px' }}
                            />
                          ) : ''
                      }
                      {
                        fieldKey === fields.length - 1
                          ? (
                            <Button
                              onClick={() => add({
                                employer: undefined, // 工作单位
                                position: undefined, // 曾任职岗位
                                certifier_name: undefined, // 证明人姓名
                                proof_phone: undefined, // 证明人电话
                                work_time: undefined, // 工作时间
                              })}
                              shape="circle"
                              icon={<PlusOutlined />}
                            />
                          ) : ''
                      }
                    </Col>
                  </Row>
                ))
              }
            </React.Fragment>
         )
        }
      </Form.List>
    );
  };

  // 创建页操作
  const renderCreateOperation = () => {
    return (
      <div
        className={style['contract-tab-scroll-button']}
      >
        <Button
          onClick={() => form.resetFields()}
          style={{
            marginRight: 10,
          }}
        >重置</Button>
        <Button
          onClick={() => onUpStep()}
          type="primary"
          style={{
            marginRight: 10,
          }}
        >上一步</Button>
        <Button
          onClick={() => onDownStep()}
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
          onClick={() => form.resetFields()}
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

  const initialWorkTime = Array.isArray(employeeDetail.work_experience) && employeeDetail.work_experience.length > 0 ?
    employeeDetail.work_experience.map(w => ({
      employer: w.employer,
      position: w.position,
      certifier_name: w.certifier_name,
      proof_phone: w.proof_phone,
      work_time: w.work_start_time && w.work_end_time ?
        [moment(String(w.work_start_time)), moment(String(w.work_end_time))]
        : undefined,
    }))
    : [{
      employer: undefined, // 工作单位
      position: undefined, // 曾任职岗位
      certifier_name: undefined, // 证明人姓名
      proof_phone: undefined, // 证明人电话
      work_time: undefined, // 工作时间
    }];

  const initialValues = {
    entry_date: employeeDetail.entry_date ? moment(String(employeeDetail.entry_date)) : undefined, // 入职日期
    // regular_date: employeeDetail.regular_date ? moment(String(employeeDetail.regular_date)) : undefined, // 预计转正日期
    work_experience: initialWorkTime,
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
            className="affairs-flow-basic"
            initialValues={initialValues}
          >
            <CoreContent title="在职记录">
              <CoreForm items={growUpItems} />
            </CoreContent>
            <Collapse>
              <Panel header="工作经历">
                {renderWorkList()}
              </Panel>
            </Collapse>
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

export default CareerForm;
