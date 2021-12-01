/**
 * 历史记录
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Pagination, Empty, Row, Col } from 'antd';

import { CoreContent, DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../components/core';
import { EmployeeCollectionType, EmployeeBankState, FileType } from '../../../../../application/define';
import style from './style.css';


function HistoryInfo(props) {
  // 获取详情id
  const [id] = useState(props.location.query.id);
  // tab类型
  const [profileType] = useState(props.location.query.profileType);

  useEffect(() => {
    if (id !== undefined) {
      props.dispatch({ type: 'employeeManage/fetchEmployeeHistoricalRecord', payload: { id } });
    }
  }, []);

  // 改变分页条数
  const onShowSizeChange = (page) => {
    props.dispatch({ type: 'employeeManage/fetchEmployeeHistoricalRecord', payload: { id, page } });
  };
  const defaultValueOfEmptyArr = (data, field) => {
    const value = dot.get(data, field);
    if (Array.isArray(value) && value.length > 0) {
      return value.join('/');
    } else {
      return '--';
    }
  };

  // 渲染有效时间
  const renderEffectiveDate = (data) => {
    const createdAt = moment(dot.get(data, 'created_at')).format('YYYY-MM-DD HH:mm'); // 创建时间
    const updatedAt = moment(dot.get(data, 'updated_at')).format('YYYY-MM-DD HH:mm'); // 更新时间
    // 通过判断状态获取有效时间
    const effectiveDate = dot.get(data, 'state') === EmployeeBankState.effective ? <span>{`${updatedAt} 至 至今`}</span> : <span>{`${createdAt} 至 ${updatedAt}`}</span>;
    if (is.not.empty(dot.get(data, 'updated_at'))) {
      return (
        <div>{effectiveDate}</div>
      );
    } else {
      return '--';
    }
  };

  // 渲染银行卡信息
  const renderBankInfo = (data) => {
    const fromItemsNextRow = []; // 照片信息
    const protocol = {
      keys: dot.get(data, 'collect_protocol', []),
      urls: dot.get(data, 'collect_protocol_url', []),
    };

    // 命名空间代收协议照片
    const namespaceProtocol = `protocol-${dot.get(data, '_id', '--')}`;
    // 银行卡正面照
    const front = {
      keys: dot.get(data, 'bank_card_front') !== undefined && dot.get(data, 'bank_card_front') !== null ? [dot.get(data, 'bank_card_front')] : [],
      urls: dot.get(data, 'bank_card_front_url') !== undefined && dot.get(data, 'bank_card_front_url') !== null ? [dot.get(data, 'bank_card_front_url')] : [],
    };
    // 命名空间银行卡正面照
    const namespaceFront = `front-${dot.get(data, '_id', '--')}`;
    const formItems = [
      {
        label: '操作人',
        form: dot.get(data, 'operator_info.name', '--') || '--',
      },
      {
        label: '操作时间',
        form: dot.get(data, 'created_at') ? moment(dot.get(data, 'created_at')).format('YYYY-MM-DD HH:mm') : '--',
      },
      {
        label: '收款模式',
        form: dot.get(data, 'payment_type', 0) ? EmployeeCollectionType.description(dot.get(data, 'payment_type', 0)) : '--',
      },
      {
        label: '状态',
        form: dot.get(data, 'state') ? EmployeeBankState.description(dot.get(data, 'state')) : '--',
      },
      {
        label: '有效时间',
        form: renderEffectiveDate(data),
      },
    ];

    // 判断是否是他人代收与本人银行卡渲染不同的内容
    if (dot.get(data, 'payment_type') === EmployeeCollectionType.collecting) {
      // 他人代个人基本信息
      formItems.push({
        label: '代收人/持卡人姓名',
        form: dot.get(data, 'card_holder_name', '--') || '--',
      },
        {
          label: '代收人身份证号',
          form: dot.get(data, 'collect_id_card_no', '--') || '--',
        },
        {
          label: '代收银行卡账号',
          form: dot.get(data, 'card_holder_bank_card_no', '--') || '--',
        },
        {
          label: '开户行',
          form: dot.get(data, 'bank_branch', '--') || '--',
        },
        {
          label: '支行名称',
          form: dot.get(data, 'bank_branch_name', '--') || '--',
        },
        {
          label: '开户行所在地',
          form: dot.get(data, 'bank_location') ? defaultValueOfEmptyArr(data, 'bank_location') : '--',
        });
      // 他人代收银行照片信息
      fromItemsNextRow.push({
        label: '银行卡正面照',
        form: <CorePhotosAmazon domain="staff" isDisplayMode value={front} namespace={namespaceFront} />,
      });
      // 员工代收照片显示照片，劳动者显示pdf文档
      if (FileType.staff !== Number(profileType)) {
        // 他人代收照片信息
        fromItemsNextRow.push({
          label: '代收协议',
          form: renderProtocol(dot.get(data, 'collect_protocol_url', [])),
        });
      } else {
        // 他人代收照片信息
        fromItemsNextRow.push({
          label: '代收协议照片',
          form: <CorePhotosAmazon domain="staff" isDisplayMode value={protocol} namespace={namespaceProtocol} />,
        });
      }
    } else {
      // 本人银行卡基本信息
      formItems.push({
        label: '持卡人姓名',
        form: dot.get(data, 'card_holder_name', '--') || '--',
      },
        {
          label: '银行卡号',
          form: dot.get(data, 'card_holder_bank_card_no', '--') || '--',
        }, {
          label: '开户行',
          form: dot.get(data, 'bank_branch', '--') || '--',
        }, {
          label: '支行名称',
          form: dot.get(data, 'bank_branch_name', '--') || '--',
        }, {
          label: '开户行所在地',
          form: dot.get(data, 'bank_location') ? defaultValueOfEmptyArr(data, 'bank_location') : '--',
        });
      // 本人银行卡照片
      fromItemsNextRow.push({
        label: '银行卡正面照',
        form: <CorePhotosAmazon domain="staff" isDisplayMode value={front} namespace={namespaceFront} />,
      },
      );
    }
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        <DeprecatedCoreForm items={fromItemsNextRow} cols={3} layout={layout} />
      </CoreContent>
    );
  };

// 渲染分页
  const renderPagination = () => {
    const count = dot.get(props, 'historyRecord.meta.count', 0);
    return (<Row>
      <Col span={24} className={style['app-comp-employee-manage-detail-history-info-pagination']}>
        <Pagination
          onChange={onShowSizeChange}
          defaultPageSize={5}
          total={count}
          showTotal={total => `总共${total}条`}
        />
      </Col>
    </Row>);
  };

  // 渲染代收照片
  const renderProtocol = (filesUrl) => {
    return (
      <div>
        {
          filesUrl.map((item, index) => {
            return (
              <p>
                <a className={style['app-comp-expense-borrowing-info-file']} rel="noopener noreferrer" target="_blank" key={index} href={item}>代收协议信息</a>
              </p>
            );
          })
        }
      </div>
    );
  };

  const data = dot.get(props, 'historyRecord.data', []);    // 历史记录计数更新
  if (is.empty(data)) {
    return <Empty />;
  }
  return (
    <div>
      {
        data.map((item, index) => {
          return (<div key={index}>{renderBankInfo(item)}</div>);
        })
      }

      {/* 渲染分页 */}
      {renderPagination()}
    </div>
  );
}

function mapStateToProps({ employeeManage }) {
  return {
    historyRecord: employeeManage.historyRecord,
  };
}

export default connect(mapStateToProps)(HistoryInfo);
