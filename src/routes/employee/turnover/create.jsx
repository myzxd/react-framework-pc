/**
 * 人员管理 - 人员异动管理 - 申请单
 */
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
import { EmployeeTurnoverThemeTag, Gender } from '../../../application/define';

import AuditModal from './components/modal/audit';

import style from './style.css';

const { TextArea } = Input;
const { Option } = Select;

// 保存类型
const SaveType = {
  create: 10,
  update: 20,
};
function Create(props) {
  // 是否显示弹窗
  const [isShowModal, setIsShowModal] = useState(false);
  // 生效时间
  const [effectDate, setEffectDate] = useState(undefined);
  // 人员异动id
  const [turnoverId, setTurnoverId] = useState(undefined);
  // 保存类型
  const [saveType, setSaveType] = useState(SaveType.create);


  useEffect(() => {
    // 重置人员列表数据
    return () => {
      props.dispatch({ type: 'employeeManage/resetEmployeesAll' });
    };
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

  // 保存
  const onSubmit = (params) => {
    // 保存类型、人员移动id
    props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { fileList } = values; // 上传的文件
      const data = dot.get(props, 'employeesAll.data', []); // 人员列表数据
      let employeeId; // 人员id
      // 判断人员列表数据是否有值
      if (is.not.empty(data) && is.existy(data)) {
        employeeId = data[0]._id;
      } else {
        employeeId = undefined;
      }
      const payload = {
        ...values,
        ...params,
        employeeId, // 人员id
        effectDate, // 期望生效时间
        fileList, // 附件列表
        id: turnoverId, // 人员异动id
      };
      // 新建
      saveType === SaveType.create && props.dispatch({ type: 'employeeTurnover/createEmployeeTurnover', payload });

      // 保存
      saveType === SaveType.update && props.dispatch({ type: 'employeeTurnover/updateEmployeeTurnover', payload });
    });
  };

  // 显示审批弹窗
  const onApproval = (result) => {
    setIsShowModal(true);
    setTurnoverId(dot.get(result, 'record._id')); // 人员异动id
    setSaveType(SaveType.update);                 // 更新保存类型
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

  // 关闭提审弹窗的回调
  const onHideModal = () => {
    setIsShowModal(false);
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

  // 渲染姓名
  const renderName = (data) => {
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
      return '--';
    }
  };

  // 渲染身份证号码
  const renderIdentityCardId = (data) => {
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
      return '--';
    }
  };

  // 渲染性别
  const renderGender = (data) => {
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
      return '--';
    }
  };

  // 更改期望生效时间
  const onChangeExpectDate = (date, dateString) => {
    // 生效时间
    setEffectDate(dateString);
  };

  // 渲染岗位信息
  const renderApplicationInfo = () => {
    const { getFieldDecorator } = props.form;
    const data = dot.get(props, 'employeesAll.data', []); // 人员列表数据
    const formItems = [
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 5 } },
        label: '调岗人员',
        form: getFieldDecorator('postIdCard', {
          initialValue: undefined,
          rules: [{ required: true, validator: asyncValidateIdCardNumber, message: '您输入的劳动者身份证号有误，请重新输入' }],
        })(
          <Input placeholder="请输入调岗人员身份证号码" onChange={onChangePostIdCard} />,
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
          initialValue: undefined,
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
          initialValue: undefined,
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
          initialValue: undefined,
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
          initialValue: undefined,
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
          initialValue: undefined,
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
          initialValue: null,
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
          initialValue: undefined,
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
          initialValue: undefined,
          rules: [{ required: true, message: '请输入备注' }],
        })(
          <TextArea
            placeholder="请输入备注"
            rows={4}
          />,
      ),
      },
    ];

    return (
      <CoreContent title="调岗申请单">
        <DeprecatedCoreForm items={formItems} cols={3} />
        <UploadFile domain="staff" form={props.form} />
      </CoreContent>
    );
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

  // 渲染提审弹窗
  const renderAuditModal = () => {
    return <AuditModal onHideModal={onHideModal} isShowModal={isShowModal} turnoverId={turnoverId} />;
  };

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

function mapStateToProps({ employeeTurnover, employeeManage: { employeesAll } }) {
  return { employeeTurnover, employeesAll };
}

export default connect(mapStateToProps)(Form.create()(Create));
