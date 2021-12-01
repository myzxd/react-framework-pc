/**
 * 人员管理 - 人员异动管理 - 详情
 */
import moment from 'moment';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import is from 'is_js';
import { Button } from 'antd';
import { connect } from 'dva';

import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import {
  EmployeeTurnoverApplyState,
  Gender,
} from '../../../application/define';

import style from './style.css';

function Detail(props) {
  useEffect(() => {
    const { dispatch, location: { query: { id } } } = props;
    dispatch({
      type: 'employeeTurnover/fetchEmployeeTurnoverDetail',
      payload: { id: `${id}` },
    });
  }, []);


  // 渲染主题标签
  const renderThemeTags = (data) => {
    // 判断详情是否有值
    if (is.existy(data) && is.not.empty(data)) {
      const themeTags = dot.get(data, 'theme_tags').join(','); // 主题标签转换
      return (
        <span>{themeTags}</span>
      );
    } else {
      return '--';
    }
  };

    // 渲染附件文件
  const renderFiles = (filesUrl) => {
    return (
      <div>
        {
            filesUrl.map((item, index) => {
              return (
                <p>
                  <a className={style['app-comp-expense-borrowing-info-file']} rel="noopener noreferrer" target="_blank" key={index} href={item.file_url}>{item.file_name}</a>
                </p>
              );
            })
          }
      </div>
    );
  };

   // 渲染岗位信息
  const renderApplicationInfo = () => {
    const { employeeTurnoverDetail } = props; // 详情数据
    const formItems = [
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '申请单状态',
        form: dot.get(employeeTurnoverDetail, 'state', undefined) ? EmployeeTurnoverApplyState.description(dot.get(employeeTurnoverDetail, 'state', undefined)) : '--',
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '姓名',
        form: dot.get(employeeTurnoverDetail, 'changed_staff_info.name', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '身份证号码',
        form: dot.get(employeeTurnoverDetail, 'changed_staff_info.identity_card_id', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '性别',
        form: dot.get(employeeTurnoverDetail, 'changed_staff_info') ? Gender.description(dot.get(employeeTurnoverDetail, 'changed_staff_info.gender_id')) : '--',
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '所属部门',
        form: dot.get(employeeTurnoverDetail, 'department', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '岗位名称',
        form: dot.get(employeeTurnoverDetail, 'station', '--'),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '调岗原因',
        form: dot.get(employeeTurnoverDetail, 'change_reason', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '调岗后部门',
        form: dot.get(employeeTurnoverDetail, 'adjusted_department', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '调岗后岗位',
        form: dot.get(employeeTurnoverDetail, 'adjusted_station', '--'),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '期望生效时间',
        form: dot.get(employeeTurnoverDetail, 'active_at', undefined) ? moment(dot.get(employeeTurnoverDetail, 'active_at')).format('YYYY.MM.DD') : '--',
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '主题标签',
        form: renderThemeTags(employeeTurnoverDetail),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '备注',
        form: dot.get(employeeTurnoverDetail, 'note', '--'),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '附件',
        form: renderFiles(dot.get(employeeTurnoverDetail, 'file_url_list', [])),
      },
    ];

    return (
      <CoreContent title="调岗申请单">
        <DeprecatedCoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  };

   // 返回首页
  const renderHose = () => {
    return (
      <CoreContent style={{ textAlign: 'center' }}>
        <Button onClick={() => { window.location.href = '/#/Employee/Turnover'; }}>返回</Button>
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 申请单信息 */}
      {renderApplicationInfo()}
      {/* 返回首页 */}
      {renderHose()}
    </div>
  );
}

function mapStateToProps({ employeeTurnover: { employeeTurnoverDetail } }) {
  return { employeeTurnoverDetail };
}

export default connect(mapStateToProps)(Detail);
