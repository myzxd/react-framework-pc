/**
  劳动者档案 - 个户注册记录页面
*/
import moment from 'moment';
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Pagination, Empty } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { EmployeeIndividualState } from '../../../../../application/define';
import { wrapImageElement } from './util';

function Individual(props) {
  const { dispatch, individualRegistration, location: { query = {} } } = props;
  const { staffId } = query;
  const [meta, setMeta] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    dispatch({
      type: 'employeeManage/fetchEmployeeIndividualRegistration',
      payload: {
        meta,
        staffId,
        state: [
          EmployeeIndividualState.examineIn,
          EmployeeIndividualState.examineHang,
          EmployeeIndividualState.success,
          EmployeeIndividualState.error,
        ],
      } });
    return () => {
      dispatch({
        type: 'employeeManage/reduceEmployeeIndividualRegistration',
        payload: {},
      });
    };
  }, [dispatch, meta, staffId]);

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setMeta({
      page,
      limit,
    });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    setMeta({
      page,
      limit,
    });
  };

  // 每一项
  const renderItem = (item = {}, index) => {
    const formItems = [
      {
        label: '提交时间',
        form: dot.get(item, 'submit_at', undefined) ?
          moment(dot.get(item, 'submit_at', undefined)).format('YYYY-MM-DD') :
          '--',
      },
      {
        label: '注册结果',
        form: EmployeeIndividualState.description(dot.get(item, 'state', undefined)),
      },
      {
        label: '姓名',
        form: <span>{dot.get(item, 'name', '--')}</span>,
      },
      {
        label: '手机号',
        form: dot.get(item, 'phone', '--'),
      },
      {
        label: '身份证号',
        form: dot.get(item, 'identity_card_id', '--'),
      },
      wrapImageElement({
        label: '身份证正面照',
        form: dot.get(item, 'idcard_front_asset_url', '--'),
      }),
      wrapImageElement({
        label: '身份证反面照',
        form: dot.get(item, 'idcard_back_asset_url', '--'),
      }),
      {
        label: '承揽协议',
        form: dot.get(item, 'contract_no', undefined) ?
          <a href={`${dot.get(item, 'contract_asset_url', '')}`}>{dot.get(item, 'contract_no', undefined)}</a> :
        '--',
      },
      wrapImageElement({
        label: '营业执照',
        form: dot.get(item, 'license_asset_url', '--'),
      }),
    ];
    // 失败的情况下显示失败原因
    if (EmployeeIndividualState.error === dot.get(item, 'state', '--')) {
      formItems.splice(2, 0, {
        label: '失败原因',
        form: dot.get(item, 'reason', '--'),
      });
    } else {
      // 进行占位用
      formItems.splice(2, 0, {
        label: '',
        form: '',
      });
    }
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <DeprecatedCoreForm key={index} items={formItems} cols={3} layout={layout} />
    );
  };

  // 渲染主体内容
  const renderContent = () => {
    const dataSource = dot.get(individualRegistration, 'data', []);
    // 无数据时显示空
    if (is.not.existy(dataSource) || is.empty(dataSource)) {
      return <Empty />;
    }
    return (
      <React.Fragment>
        {
          dataSource.map((item, index) => {
            return renderItem(item, index);
          })
        }
        <div style={{ textAlign: 'right', margin: '16px 0' }}>
          <Pagination
            current={meta.page}
            pageSize={meta.limit}
            showTotal={total => `总共${total}条`} // 数据展示总条数
            total={dot.get(individualRegistration, '_meta.result_count', 0)}
            pageSizeOptions={['10', '20', '30', '40']}
            showQuickJumper
            showSizeChanger
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
          />
        </div>
      </React.Fragment>
    );
  };

  return (
    <CoreContent title={`${query.name || ''}个户注册记录`}>
      {/* 渲染主体内容 */}
      {renderContent()}
    </CoreContent>
  );
}

function mapStateToProps({ employeeManage: { individualRegistration } }) {
  return {
    individualRegistration,
  };
}
export default connect(mapStateToProps)(Individual);
