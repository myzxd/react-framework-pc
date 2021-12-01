// 选择民族
import React from 'react';
import { CoreSelect } from '../../core';

const Option = CoreSelect.Option;

// 数据定义
const Nations = [
  { name: '汉族' },
  { name: '壮族' },
  { name: '满族' },
  { name: '回族' },
  { name: '苗族' },
  { name: '维吾尔族' },
  { name: '土家族' },
  { name: '彝族' },
  { name: '蒙古族' },
  { name: '藏族' },
  { name: '布依族' },
  { name: '侗族' },
  { name: '瑶族' },
  { name: '朝鲜族' },
  { name: '白族' },
  { name: '哈尼族' },
  { name: '哈萨克族' },
  { name: '黎族' },
  { name: '傣族' },
  { name: '畲族' },
  { name: '傈僳族' },
  { name: '仡佬族' },
  { name: '东乡族' },
  { name: '高山族' },
  { name: '拉祜族' },
  { name: '水族' },
  { name: '佤族' },
  { name: '纳西族' },
  { name: '羌族' },
  { name: '土族' },
  { name: '仫佬族' },
  { name: '锡伯族' },
  { name: '柯尔克孜族' },
  { name: '达斡尔族' },
  { name: '景颇族' },
  { name: '毛南族' },
  { name: '撒拉族' },
  { name: '布朗族' },
  { name: '塔吉克族' },
  { name: '阿昌族' },
  { name: '普米族' },
  { name: '鄂温克族' },
  { name: '怒族' },
  { name: '京族' },
  { name: '基诺族' },
  { name: '德昂族' },
  { name: '保安族' },
  { name: '俄罗斯族' },
  { name: '裕固族' },
  { name: '乌孜别克族' },
  { name: '门巴族' },
  { name: '鄂伦春族' },
  { name: '独龙族' },
  { name: '塔塔尔族' },
  { name: '赫哲族' },
  { name: '珞巴族' },
];

const CommonSelectNations = (props) => {
  // 选项
  const options = Nations.map((nation, index) => {
    return <Option key={index} value={nation.name}>{nation.name}</Option>;
  });

  // 默认传递所有上级传入的参数
  return (
    <CoreSelect {...props} placeholder="请选择民族">
      {options}
    </CoreSelect>
  );
};

export default CommonSelectNations;
