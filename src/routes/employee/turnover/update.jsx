/**
 * 人员管理 - 人员异动管理 - 编辑
 */
import moment from 'moment';
import dot from 'dot-prop';
import React, { useEffect, useState } from 'react';
import is from 'is_js';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Select, Input, DatePicker, message } from 'antd';
import { connect } from 'dva';

import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import UploadFile from '../../expense/manage/components/uploadAmazonFile';
import { asyncValidateIdCardNumber } from '../../../application/utils';
import { EmployeeTurnoverThemeTag, Gender, EmployeeTurnoverApplyState } from '../../../application/define';

import AuditModal from './components/modal/audit';

import style from './style.css';

const { TextArea } = Input;
const { Option } = Select;

function Update(props) {
  // 是否显示弹窗
  const [isShowModal, setIsShowModal] = useState(false);
  // 生效时间
  const [effectDate, setEffectDate] = useState(undefined);

  useEffect(() => {
    const { dispatch, location: { query: { id } } } = props;
    // 人员id不等于undefined调取人员移动详情接口
    if (id !== undefined) {
      dispatch({
        type: 'employeeTurnover/fetchEmployeeTurnoverDetail',
        payload: { id },
      });
    }
  }, []);

  // 修改身份证号码
  const onChangePostIdCard = async (value) => {
    const idCardConst = 18; // 身份证号码位数
    // 身份证号码的长度等于18位的时候调取人员接口
    if (value.target.value.length === idCardConst) {
      const result = await props.dispatch({
        type: 'employeeManage/fetchEmployees',
        payload: { identityCardId: value.target.value, state: [1, 100, 101, 102, 103] },
      });
      if (dot.get(result, 'data', []).length === 0) return message.error('请输入劳动者身份证号');
    }
  };

   // 渲染姓名
  const renderName = (data) => {
    const { employeeTurnoverDetail } = props; // 详情数据
    // 判断是否有人员列表数据
    if (is.not.empty(data) && is.existy(data)) {
      return (
        <div>
          {
            data.map((item, index) => {
              return (
                <span key={index}>{item.name}</span>
              );
            })
          }
        </div>
      );
    } else {
      return (
        <span>{dot.get(employeeTurnoverDetail, 'changed_staff_info.name', undefined) || '--'}</span>
      );
    }
  };

   // 渲染身份证号码
  const renderIdentityCardId = (data) => {
    const { employeeTurnoverDetail } = props; // 详情数据
    // 判断是否有人员列表数据
    if (is.not.empty(data) && is.existy(data)) {
      return (
        <div>
          {
            data.map((item, index) => {
              return (
                <span key={index}>{item.identity_card_id}</span>
              );
            })
          }
        </div>
      );
    } else {
      return (
        <span>{dot.get(employeeTurnoverDetail, 'changed_staff_info.identity_card_id', undefined) || '--'}</span>
      );
    }
  };

  // 渲染性别
  const renderGender = (data) => {
    const { employeeTurnoverDetail } = props; // 详情数据
    // 判断是否有人员列表数据
    if (is.not.empty(data) && is.existy(data)) {
      return (
        <div>
          {
            data.map((item, index) => {
              return (
                <span key={index}>{Gender.description(item.gender_id)}</span>
              );
            })
          }
        </div>
      );
    } else {
      return (
        <span>{dot.get(employeeTurnoverDetail, 'changed_staff_info') ? Gender.description(dot.get(employeeTurnoverDetail, 'changed_staff_info.gender_id')) : '--'}</span>
      );
    }
  };

  // 更改期望生效时间
  const onChangeExpectDate = (date, dateString) => {
    setEffectDate(dateString); // 生效时间
  };

  // 主题标签自定义校验
  const onVerify = (rule, value, callback) => {
    const themeTagLength = '5'; // 主题标签长度
    // 判断主题标签是否有值
    if (is.not.empty(value) && is.existy(value)) {
      // 主题标签长度不能超过5
      if (value.length <= themeTagLength) {
        callback();
        return;
      }
      callback('最多可以输入五个主题标签');
    }
    callback('请选择主题标签');
  };

   // 渲染岗位信息
  const renderApplicationInfo = () => {
    const { getFieldDecorator } = props.form;
    const { employeeTurnoverDetail } = props; // 详情信息
    const data = dot.get(props, 'employeesAll.data', []); // 人员列表数据
    const formItems = [
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 5 } },
        label: '调岗人员',
        form: getFieldDecorator('postIdCard', {
          initialValue: dot.get(employeeTurnoverDetail, 'changed_staff_info.identity_card_id', undefined),
          rules: [{ required: true, validator: asyncValidateIdCardNumber, message: '您输入的劳动者身份证号有误，请重新输入' }],
        })(
          <Input
            placeholder="请输入调岗人员身份证号码"
            disabled={dot.get(employeeTurnoverDetail, 'state') === EmployeeTurnoverApplyState.pendding ? false : true} // 判断状态是否为草稿,如果为草稿可以编辑
            onChange={onChangePostIdCard}
          />,
        ),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '姓名',
        form: getFieldDecorator('name', { initialValue: undefined })(
          <div>{renderName(data)}</div>,
        ),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '身份证号码',
        form: getFieldDecorator('idCard', { initialValue: undefined })(
          <div>{renderIdentityCardId(data)}</div>,
        ),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '性别',
        form: getFieldDecorator('gender', {
          initialValue: undefined,
        })(
          <div>{renderGender(data)}</div>,
        ),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '所属部门',
        form: getFieldDecorator('department', {
          initialValue: dot.get(employeeTurnoverDetail, 'department', undefined),
          rules: [
            { required: false, message: '请输入所属部门' },
            { pattern: /^[^\s]+$/g, message: '格式不正确，不能包含空格' },
            { max: 16, message: '输入的长度为1-16个字符' }],
        })(
          <Input placeholder="请输入所属部门" />,
        ),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '岗位名称',
        form: getFieldDecorator('postName', {
          initialValue: dot.get(employeeTurnoverDetail, 'station', undefined),
          rules: [{ required: true, message: '请输入岗位名称' }, { pattern: /^[\u4e00-\u9fa5a-zA-Z-z]+$/g, message: '只能输入字母,汉字' }, { max: 16, message: '输入的长度为1-16个字符' }],
        })(
          <Input placeholder="请输入岗位名称" />,
        ),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '调岗原因',
        form: getFieldDecorator('postWhy', {
          initialValue: dot.get(employeeTurnoverDetail, 'change_reason', undefined),
          rules: [{ required: true, message: '请输入调岗原因' }],
        })(
          <TextArea
            placeholder="请输入调岗原因"
            rows={4}
          />,
        ),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '调岗后部门',
        form: getFieldDecorator('afterDepartment', {
          initialValue: dot.get(employeeTurnoverDetail, 'adjusted_department', undefined),
          rules: [
            { required: false, message: '请输入调岗后部门' },
            { pattern: /^[^\s]+$/g, message: '格式不正确，不能包含空格' },
            { max: 16, message: '输入的长度为1-16个字符' }],
        })(
          <Input placeholder="请输入调岗后部门" />,
        ),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '调岗后岗位',
        form: getFieldDecorator('postAfterName', {
          initialValue: dot.get(employeeTurnoverDetail, 'adjusted_station', undefined),
          rules: [{ required: true, message: '请输入调岗后岗位' }, { pattern: /^[\u4e00-\u9fa5a-zA-Z-z]+$/g, message: '只能输入字母,汉字' }, { max: 16, message: '输入的长度为1-16个字符' }],
        })(
          <Input placeholder="请输入调岗后岗位" />,
        ),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '期望生效时间',
        form: getFieldDecorator('expectDate', {
          initialValue: dot.get(employeeTurnoverDetail, 'active_at') ? moment(`${dot.get(employeeTurnoverDetail, 'active_at')}`, 'YYYY-MM-DD') : null,
          rules: [{ required: true, message: '请选择期望生效时间' }],
        })(
          <DatePicker onChange={onChangeExpectDate} />,
        ),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '主题标签',
        form: getFieldDecorator('themeTag', {
          initialValue: dot.get(employeeTurnoverDetail, 'theme_tags', undefined),
          rules: [{ required: true, validator: onVerify }],
        })(
          <Select mode="tags" style={{ width: '100%' }} placeholder="请输入主题标签" >
            <Option value={EmployeeTurnoverThemeTag.promotion}>{EmployeeTurnoverThemeTag.description(EmployeeTurnoverThemeTag.promotion)}</Option>
            <Option value={EmployeeTurnoverThemeTag.demotion}>{EmployeeTurnoverThemeTag.description(EmployeeTurnoverThemeTag.demotion)}</Option>
            <Option value={EmployeeTurnoverThemeTag.level}>{EmployeeTurnoverThemeTag.description(EmployeeTurnoverThemeTag.level)}</Option>
          </Select>,
        ),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '备注',
        form: getFieldDecorator('note', {
          initialValue: dot.get(employeeTurnoverDetail, 'note', undefined),
          rules: [{ required: true, message: '请输入备注' }],
        })(
          <TextArea
            placeholder="请输入备注"
            rows={4}
          />,
        ),
      },
    ];
    // 附件命列表
    const fileList = dot.get(employeeTurnoverDetail, 'file_url_list', []).map(item => item.file_name);
    // 附件url列表
    const fileListUrl = dot.get(employeeTurnoverDetail, 'file_url_list', []).map(item => item.file_url);
    return (
      <CoreContent title="调岗申请单">
        <DeprecatedCoreForm items={formItems} cols={3} />
        <UploadFile domain="staff" form={props.form} fileList={fileList} fileListUrl={fileListUrl} />
      </CoreContent>
    );
  };

    // 显示审批弹窗
  const onApproval = () => { setIsShowModal(true); };

   // 保存
  const onSubmit = (params) => {
    const { id } = props.location.query; // 人员异动id
    const { employeeTurnoverDetail } = props; // 详情数据
    const data = dot.get(props, 'employeesAll.data', []); // 人员列表数据
    props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { fileList } = values; // 上传的文件
      let employeeId; // 人员id
      // 判断人员列表数据是否有值
      if (is.not.empty(data) && is.existy(data)) {
        employeeId = data[0]._id;
      } else {
        employeeId = dot.get(employeeTurnoverDetail, 'changed_staff_info._id', undefined); // 员工id
      }
      const payload = {
        ...values,
        ...params,
        employeeId, // 人员id
        effectDate, // 期望生效时间
        fileList, // 附件列表
        id, // 人员异动id
      };
      props.dispatch({
        type: 'employeeTurnover/updateEmployeeTurnover',
        payload,
      });
    });
  };

   // 保存并提交审核
  const onSaveAndAdd = (e) => {
    e.preventDefault();
    onSubmit({
      onSuccessCallback: onApproval, // 创建成功后审批弹窗,弹出
    });
  };

   // 点击保存
  const onSave = (e) => {
    e.preventDefault();
    onSubmit({
      onSuccessCallback: () => { window.location.href = '/#/Employee/Turnover'; },
    });
  };
   // 返回首页
  const renderHose = () => {
    return (
      <CoreContent style={{ textAlign: 'center' }}>
        <Button type="primary" className={style['app-comp-employee-turnover-create-submit']} onClick={onSaveAndAdd}>保存并提交审核</Button>
        <Button onClick={() => { window.location.href = '/#/Employee/Turnover'; }}>返回</Button>
        <Button type="primary" className={style['app-comp-employee-turnover-create-save']} onClick={onSave}>保存</Button>
      </CoreContent>
    );
  };

   // 关闭提审弹窗的回调
  const onHideModal = () => {
    setIsShowModal(false);
  };
  // 渲染提审弹窗
  const renderAuditModal = () => {
    const { location: { query: { id } } } = props; // 获取人员异动id
    return <AuditModal onHideModal={onHideModal} isShowModal={isShowModal} turnoverId={id} />;
  };

  const { employeeTurnoverDetail } = props; // 详情信息
  if (Object.keys(employeeTurnoverDetail).length === 0) return null;

  return (
    <div>
      {/* 申请单信息 */}
      {renderApplicationInfo()}
      {/* 返回首页 */}
      {renderHose()}
      {/* 渲染提审弹窗 */}
      {renderAuditModal()}
    </div>
  );
}

function mapStateToProps({ employeeTurnover: { employeeTurnoverDetail }, employeeManage: { employeesAll } }) {
  return { employeeTurnoverDetail, employeesAll };
}

export default connect(mapStateToProps)(Form.create()(Update));
