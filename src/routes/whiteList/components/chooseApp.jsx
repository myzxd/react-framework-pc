/**
 *  选择应用终端
 */
import { Radio } from 'antd';
import React from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import { WhiteListTerminalType, WhiteListAddressBookState } from '../../../application/define';

const ChooseApp = ({ form = {}, onDefaultParams }) => {
  // 每当重新选择时需要清除数据
  const onResetDate = (e) => {
    const params = {
      terminal: e.target.value,
    };

    // 通过终端值得改变修改终端默认值
    if (onDefaultParams) {
      onDefaultParams(params);
    }

    // 当终端发生改变清除数据 TODO:@@
    form.setFieldsValue({ addressBook: WhiteListAddressBookState.show });
    form.setFieldsValue({ chat: undefined });
    form.setFieldsValue({ workBench: undefined });
    form.setFieldsValue({ isNeedAudit: undefined });
    form.setFieldsValue({ isTeam: undefined });
    form.setFieldsValue({ isShowInfor: undefined });
  };

  const { getFieldDecorator } = form;
  const formItems = [
    {
      form: getFieldDecorator('terminal', { rules: [{ required: true, message: '请选择应用终端范围' }], initialValue: WhiteListTerminalType.knight })(
        <Radio.Group onChange={onResetDate}>
          <Radio value={WhiteListTerminalType.knight}>{WhiteListTerminalType.description(WhiteListTerminalType.knight)}</Radio>
          <Radio value={WhiteListTerminalType.boss}>{WhiteListTerminalType.description(WhiteListTerminalType.boss)}</Radio>
        </Radio.Group>,
      ),
    },
  ];
  const layout = { labelCol: { span: 10 }, wrapperCol: { span: 10 } };
  return (
    <CoreContent title="选择应用终端" style={{ backgroundColor: '#FAFAFA' }}>
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    </CoreContent>
  );
};

export default ChooseApp;
