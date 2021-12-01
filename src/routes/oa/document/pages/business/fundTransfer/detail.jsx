/**
 * 资金调拨
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { Row, Form, Col, Table } from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../components';
import { FundTransferOtherReasonEnum, Unit, BusinesBankAccountType } from '../../../../../../application/define';

function FundTransferDetail(props) {
  const {
    dispatch,
    query,
    fundTransferDetail,
    oaDetail,
  } = props;
  useEffect(() => {
    // 判断是否是兴达插件
    if (oaDetail._id) {
      dispatch({
        type: 'business/fetchFundTransferDetail',
        payload: {
          isPluginOrder: true,
          oaDetail,
        },
      });
    } else {
      dispatch({
        type: 'business/fetchFundTransferDetail',
        payload: {
          id: query.id,
        },
      });
    }
    return () => {
      dispatch({
        type: 'business/reduceFundTransferDetail',
        payload: {},
      });
    };
  }, [dispatch, query.id, oaDetail]);

    // 基本信息
  const renderBaseInfo = () => {
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const formItems = [
      <Form.Item label="申请人" {...layout}>
        {dot.get(fundTransferDetail, 'creator_info.name', '--')}
      </Form.Item>,
      <Form.Item label="部门" {...layout}>
        {dot.get(fundTransferDetail, 'creator_department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="岗位" {...layout}>
        {dot.get(fundTransferDetail, 'creator_job_info.name', '--')}
      </Form.Item>,
      <Form.Item label="职级" {...layout}>
        {dot.get(fundTransferDetail, 'creator_job_info.rank', '--')}
      </Form.Item>,
    ];

    return (
      <CoreContent title="基本信息">
        <CoreForm items={formItems} cols={4} />
      </CoreContent>
    );
  };

  // 渲染内容
  const renderItem = (data = [], title = '') => {
      // tabel列表
    const columns = [
      {
        title: '公司',
        dataIndex: ['firm_info', 'name'],
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '帐号',
        dataIndex: ['bank_account_info', 'bank_card'],
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '开户行',
        dataIndex: ['bank_account_info', 'bank_and_branch'],
        render: text => text || '--',
      },
      {
        title: '账户类型',
        dataIndex: ['bank_account_info', 'bank_card_type'],
        render: text => (text ? BusinesBankAccountType.description(text) : '--'),
      },
      {
        title: '金额（元）',
        dataIndex: 'money',
        render: text => (text ? Unit.exchangePriceToYuan(text) : '--'),
      },
      {
        title: '调拨事由',
        dataIndex: 'allocate_reason',
        render: (text, record) => `${record.allocate_reason_title}${text === FundTransferOtherReasonEnum ? `(${record.other_reason})` : ''}`,
      },
      {
        title: '备注',
        dataIndex: 'note',
        render: (text) => {
          if (text) {
            return (
              <span className="noteWrap">{text}</span>
            );
          }
          return '--';
        },
      },
    ];
    return (
      <CoreContent title={title} >
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={false}
          rowKey="_id"
          dataSource={data}
          bordered
        />
      </CoreContent>
    );
  };

    // 附件
  const renderPageUpload = () => {
    const formItems = [
      <Row style={{ marginLeft: 16 }}>
        <Col span={1}>附件：</Col>
        <Col span={22}>
          <PageUpload
            domain={PageUpload.UploadDomains.OAUploadDomain}
            displayMode
            value={PageUpload.getInitialValue(fundTransferDetail, 'asset_infos')}
          />
        </Col>
      </Row>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };
  return (
    <React.Fragment>
      {/* 基本信息 */}
      {renderBaseInfo()}

      {/* 渲染调出方内容 */}
      {renderItem(fundTransferDetail.dispatch_expense_list, '调出方')}

      {/* 渲染调入方内容 */}
      {renderItem(fundTransferDetail.dispatch_income_list, '调入方')}

      {/* 附件 */}
      {renderPageUpload()}
    </React.Fragment>
  );
}

const mapStateToProps = ({ business: { fundTransferDetail } }) => {
  return {
    fundTransferDetail,
  };
};
export default connect(mapStateToProps)(FundTransferDetail);
