/**
 * 表单按钮组件 - 表单创建/编辑按钮
 */
import React from 'react';
import PageUpdateButtons from './update';
import PageSubmitButtons from './submit';

/**
* @param showUpdate  是否显示更新按钮，默认false
* @param onSubmit    提交数据（回调函数返回审批流参数）
* @param onUpdate    更新数据
* @example :
onSubmit = (onDoneHook) =>{
  // 提交完成, 调用钩子函数后自动跳转
  onDoneHook()
}
onUpdate = (onDoneHook) => {
  // 提交完成, 调用钩子函数后自动跳转
  onDoneHook()
}
<PageFormButtons showUpdate={flag} query={props.query} onSubmit={onSubmit} onUpdate={onUpdate} />
*/

function PageFormButtons(props) {
  // 渲染更新按钮
  if (props.showUpdate === true) {
    return (
      <PageUpdateButtons query={props.query} onUpdate={props.onUpdate} />
    );
  }

  // 渲染创建按钮
  return (
    <PageSubmitButtons query={props.query} onSave={props.onSave} onSubmit={props.onSubmit} />
  );
}

export default PageFormButtons;
