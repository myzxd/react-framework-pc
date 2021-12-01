/**
 * 审批管理 - 流程审批 - 考勤管理 - 加班管理 - 加班单详情 - 加班信息
 */
import moment from 'moment';
import React from 'react';
import dot from 'dot-prop';
import {
  CoreContent,
  DeprecatedCoreForm,
  CoreFinder,
} from '../../../../../components/core';

import {
  ExpenseOverTimeThemeTag,
} from '../../../../../application/define';

const { CoreFinderList } = CoreFinder;

const OverTimeInfo = (props) => {
  const {
    detail, // 加班单详情
  } = props;

  const {
    tags = [], // 主题标签
    duration = undefined, // 标准工时
    reason = undefined, // 加班事由
    info_address: infoAddress = undefined, // 资料地址
    start_at: startAt = undefined, // 开始时间
    end_at: endAt = undefined, // 结束时间
    working_hours: workingHours = undefined, // 时长
    file_url_list: fileUrlList = [], // 附件
  } = detail;

    // 预览组件
  const renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.file_url')) {
      const data = value.map((item) => {
        return { key: item.file_name, url: item.file_url };
      });
      return (
        <CoreFinderList data={data} enableTakeLatest={false} />
      );
    }
    return '--';
  };

  const formItems = [
    {
      label: '主题标签',
      form: tags.length > 0 ? ExpenseOverTimeThemeTag.description(tags[0]) : '--',
    },
    {
      label: '标准工时',
      form: workingHours || '--',
    },
    {
      label: '资料地址',
      form: infoAddress || '--',
    },
    {
      label: '开始时间',
      form: startAt ? moment(startAt).format('YYYY.MM.DD HH:mm:ss') : '--',
    },
    {
      label: '结束时间',
      form: endAt ? moment(endAt).format('YYYY.MM.DD HH:mm:ss') : '--',
    },
    {
      label: '时长（小时）',
      form: duration || '--',
    },
    {
      label: '加班事由及成果',
      form: (
        <div className="noteWrap">
          {reason || '--'}
        </div>
      ),
    },
    {
      label: '附件',
      form: renderCorePreview(fileUrlList),
    },
  ];

  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

  return (
    <CoreContent title="加班信息">
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    </CoreContent>
  );
};

export default OverTimeInfo;
