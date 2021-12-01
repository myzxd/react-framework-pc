/**
 * 人员管理 - 社保配置管理 - 列表页
 */
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';

import { Table, Button } from 'antd';
import { CoreContent } from '../../../components/core';
import { Unit } from '../../../application/define';

import Operate from '../../../application/define/operate';

import Style from './style.less';
import SocietySearch from './search';

const SocietyIndex = ({ dispatch, societyList = {} }) => {
  // 列表数据
  const { data: dataSource = [] } = societyList;
  // 搜索参数
  const [searchParams, setSearchParams] = useState({});
  // 分页参数
  const [meta, setMeta] = useState({ page: 1, limit: 30 });
  // 请求参数
  useEffect(() => {
    dispatch({
      type: 'society/fetchSocietyList',
      payload: { ...meta, ...searchParams },
    });
    // 销毁时清空列表数据
    return () => dispatch({
      type: 'society/reduceSocietyList',
      payload: {},
    });
  }, [dispatch, searchParams, meta]);

  // 修改分页
  const onChangePage = (page, limit) => {
    setMeta({ page, limit });
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setMeta({ page, limit });
  };

  // 跳转到详情
  const onGoDetail = (id) => {
    window.location.href = `/#/Employee/Society/Detail?id=${id}`;
  };
  // 跳转到编辑
  const onGoUpdate = (id) => {
    window.location.href = `/#/Employee/Society/Update?id=${id}`;
  };


  // 搜索操作
  const onSearch = (params) => {
    // 重置
    if (!params) {
      setSearchParams({});
      setMeta({ page: 1, limit: 30 });
      return false;
    }
    // 非重置操作
    const payload = {
      ...meta,
      ...params,
    };
    setSearchParams(payload);
  };

  // 跳转到新增页面
  const onGoCreatePage = () => {
    window.location.href = '/#/Employee/Society/Create';
  };

  // 渲染列表
  const renderList = () => {
    const transformUnit = (data) => {
      return (data || data === 0) ? Unit.exchangePriceToYuan(data) : undefined;
    };
    // 表格属性
    const columns = [
      {
        title: '方案名称',
        fixed: 'left',
        width: 150,
        key: 'name',
        dataIndex: 'name',
        render: text => text || '--',
      },
      {
        title: '城市',
        fixed: 'left',
        width: 150,
        key: 'splicing_name',
        dataIndex: 'splicing_name',
        render: text => text || '--',
      },
      {
        title: '养老基数下限(元)',
        width: 150,
        key: 'old_age_insurance.lower_limit',
        dataIndex: 'old_age_insurance',
        render: text => transformUnit(text.lower_limit) || '--',
      },
      {
        title: '养老基数上限(元)',
        width: 150,
        key: 'old_age_insurance.upper_limit',
        dataIndex: 'old_age_insurance',
        render: text => transformUnit(text.upper_limit) || '--',
      },
      {
        title: '养老企业比例',
        width: 150,
        key: 'old_age_insurance.company_percent',
        dataIndex: 'old_age_insurance',
        render: text => (text.company_percent ? `${text.company_percent}%` : '--'),
      },
      {
        title: '养老个人比例',
        width: 150,
        key: 'old_age_insurance.person_percent',
        dataIndex: 'old_age_insurance',
        render: text => (text.person_percent ? `${text.person_percent}%` : '--'),
      },
      {
        title: '医疗基数下限(元)',
        width: 150,
        key: 'medical_insurance.lower_limit',
        dataIndex: 'medical_insurance',
        render: text => transformUnit(text.lower_limit) || '--',
      },
      {
        title: '医疗基数上限(元)',
        width: 150,
        key: 'medical_insurance.upper_limit',
        dataIndex: 'medical_insurance',
        render: text => transformUnit(text.upper_limit) || '--',
      },
      {
        title: '医疗企业比例',
        width: 150,
        key: 'medical_insurance.company_percent',
        dataIndex: 'medical_insurance',
        render: text => (text.company_percent ? `${text.company_percent}%` : '--'),
      },
      {
        title: '医疗个人比例',
        width: 150,
        key: 'medical_insurance.person_percent',
        dataIndex: 'medical_insurance',
        render: text => (text.person_percent ? `${text.person_percent}%` : '--'),
      },
      {
        title: '失业基数下限(元)',
        width: 150,
        key: 'unemployment_insurance.lower_limit',
        dataIndex: 'unemployment_insurance',
        render: text => transformUnit(text.lower_limit) || '--',
      },
      {
        title: '失业基数上限(元)',
        width: 150,
        key: 'unemployment_insurance.upper_limit',
        dataIndex: 'unemployment_insurance',
        render: text => transformUnit(text.upper_limit) || '--',
      },
      {
        title: '失业企业比例',
        width: 150,
        key: 'unemployment_insurance.company_percent',
        dataIndex: 'unemployment_insurance',
        render: text => (text.company_percent ? `${text.company_percent}%` : '--'),
      },
      {
        title: '失业个人比例',
        width: 150,
        key: 'unemployment_insurance.person_percent',
        dataIndex: 'unemployment_insurance',
        render: text => (text.person_percent ? `${text.person_percent}%` : '--'),
      },
      {
        title: '工伤基数下限(元)',
        width: 150,
        key: 'occupational_insurance.lower_limit',
        dataIndex: 'occupational_insurance',
        render: text => transformUnit(text.lower_limit) || '--',
      },
      {
        title: '工伤基数上限(元)',
        width: 150,
        key: 'occupational_insurance.upper_limit',
        dataIndex: 'occupational_insurance',
        render: text => transformUnit(text.upper_limit) || '--',
      },
      {
        title: '工伤企业比例',
        width: 150,
        key: 'occupational_insurance.company_percent',
        dataIndex: 'occupational_insurance',
        render: text => (text.company_percent ? `${text.company_percent}%` : '--'),
      },
      {
        title: '工伤个人比例',
        width: 150,
        key: 'occupational_insurance.person_percent',
        dataIndex: 'occupational_insurance',
        render: text => (text.person_percent ? `${text.person_percent}%` : '--'),
      },
      {
        title: '生育基数下限(元)',
        width: 150,
        key: 'birth_insurance.lower_limit',
        dataIndex: 'birth_insurance',
        render: text => transformUnit(text.lower_limit) || '--',
      },
      {
        title: '生育基数上限(元)',
        width: 150,
        key: 'birth_insurance.upper_limit',
        dataIndex: 'birth_insurance',
        render: text => transformUnit(text.upper_limit) || '--',
      },
      {
        title: '生育企业比例',
        width: 150,
        key: 'birth_insurance.company_percent',
        dataIndex: 'birth_insurance',
        render: text => (text.company_percent ? `${text.company_percent}%` : '--'),
      },
      {
        title: '生育个人比例',
        width: 150,
        key: 'birth_insurance.person_percent',
        dataIndex: 'birth_insurance',
        render: text => (text.person_percent ? `${text.person_percent}%` : '--'),
      },
      {
        title: '公积金基数下限(元)',
        width: 150,
        key: 'provident_fund.lower_limit',
        dataIndex: 'provident_fund',
        render: text => transformUnit(text.lower_limit) || '--',
      },
      {
        title: '公积金基数上限(元)',
        width: 150,
        key: 'provident_fund.upper_limit',
        dataIndex: 'provident_fund',
        render: text => transformUnit(text.upper_limit) || '--',
      },
      {
        title: '公积金企业缴费比例',
        width: 150,
        key: 'provident_fund.company_percent',
        dataIndex: 'provident_fund',
        render: text => (text.company_percent ? `${text.company_percent}%` : '--'),
      },
      {
        title: '公积金个人缴费比例',
        width: 150,
        key: 'provident_fund.person_percent',
        dataIndex: 'provident_fund',
        render: text => (text.person_percent ? `${text.person_percent}%` : '--'),
      },
      {
        title: '创建时间',
        width: 150,
        key: 'created_at',
        dataIndex: 'created_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '创建者',
        width: 150,
        key: 'creator_info.name',
        dataIndex: 'creator_info',
        render: (text) => {
          if (text && text.name) {
            return text.name;
          }
          return '--';
        },
      },
      {
        title: '最后操作时间',
        width: 150,
        key: 'updated_at',
        dataIndex: 'updated_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '操作人',
        width: 150,
        key: 'operator.name',
        dataIndex: 'operator_info',
        render: (text) => {
          if (text && text.name) {
            return text.name;
          }
          return '--';
        },
      },
      {
        title: '操作',
        width: 150,
        fixed: 'right',
        render: (text, record) => {
          const arr = [];
          if (Operate.canOperateEmployeeSocietyDetail()) {
            arr.push(<a onClick={() => { onGoDetail(record._id); }} className={Style['app-comp-employee-society-a']}>查看</a>);
          }
          if (Operate.canOperateEmployeeSocietyUpdate()) {
            arr.push(<a onClick={() => { onGoUpdate(record._id); }}>编辑</a>);
          }
          return (<React.Fragment>
            {arr}
          </React.Fragment>);
        },
      },
    ];
    // 分页
    const pagination = {
      current: meta.page,
      pageSize: meta.limit,                     // 默认数据条数
      onChange: onChangePage,                   // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(societyList, '_meta.result_count', 0), // 数据总条数
    };

    // 扩展操作
    let titleExt = null;
    if (Operate.canOperateEmployeeSocietyCreate()) {
      titleExt = <Button type="primary" onClick={onGoCreatePage}>新建参保方案</Button>;
    }
    return (
      <CoreContent titleExt={titleExt} title="参保方案列表">
        <Table
          pagination={pagination}
          columns={columns}
          rowKey={(re, key) => re._id || key}
          dataSource={dataSource}
          scroll={{ x: 4650 }}
        />
      </CoreContent>
    );
  };

  return (
    <React.Fragment>
      {/* 渲染搜索 */}
      <SocietySearch onSearch={onSearch} />
      {/* 渲染列表 */}
      {renderList()}
    </React.Fragment>
  );
};

const mapStateToProps = ({ society: { societyList } }) => ({ societyList });


export default connect(mapStateToProps)(SocietyIndex);

