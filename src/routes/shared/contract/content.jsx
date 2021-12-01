/*
 * 共享登记 - 合同列表 - 表格组件 /Shared/Contract
 */
import React, { useState, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import is from 'is_js';
import {
  Table,
  Button,
  Popconfirm,
} from 'antd';
import { utils, authorize } from '../../../application';
import {
  SharedNewContractState,
  SharedContractBorrowState,
  SharedContractMailState,
} from '../../../application/define';
import { CoreContent } from '../../../components/core';
import Operate from '../../../application/define/operate';
import SignModal from '../component/signModal'; // 盖章/批量盖章Modal
import VoidPopupComponent from '../component/voidPopupComponent';
import MailPopupComponent from '../component/mailPopupComponent';
import FilesPopupComponent from '../component/filesPopupComponent';


Content.propTypes = {
  tabKey: PropTypes.string, // tab key
  tableLoading: PropTypes.bool, // table loading
  breakContractList: PropTypes.func, // 刷新列表
};

function Content({
  tabKey,
  tableLoading,
  contractList = {},
  onShowSizeChange = () => { },
  onChangePage = () => { },
  breakContractList,
  sharedContractDeliver,
  pactTypes = {},  // 合同类型枚举表
  sealTypes = {},  // 印章类型枚举
}, ref) {
  // table selectedRowKeys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // SignModal visible
  const [signModalVisible, setSignModalVisible] = useState(false);
  // 单次盖章 or 批量盖章
  const signTypeRef = useRef('');
  // 单次盖章合同信息
  const signContractInfo = useRef({});
  const { data = [], _meta: meta = {} } = contractList[tabKey] || {};
  // 点击作废 存储当前项数据
  const [voidData, setVoidData] = useState({});
  // 作废 弹窗状态
  const [voidVisible, setVoidVisible] = useState(false);
  // 邮寄 弹窗状态
  const [mailVisible, setMailVisible] = useState(false);
  // 合同id
  const [contractId, setContractId] = useState(null);
  // 合同序号
  const [contractNumber, setContractNumber] = useState(null);
  // 存档 弹窗状态
  const [filesVisible, setFilesVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    setSelectedRowKeys,
  }));

  // 作废操作
  const onClickToVoid = (rec) => {
    // 存储当前项数据
    setVoidData(rec);
    // 显示作废弹窗
    setVoidVisible(true);
  };

  // 邮寄操作
  const onClickToMail = (id) => {
    setMailVisible(true);
    setContractId(id);
  };

  // 存档操作
  const onClickToFiles = (number, id) => {
    setContractNumber(number);
    setFilesVisible(true);
    setContractId(id);
  };

  // 盖章
  const onSign = (listRecord) => {
    signContractInfo.current = listRecord;
    signTypeRef.current = 'sign';
    setSignModalVisible(true);
  };

  // 批量盖章
  const onBatchSign = () => {
    signTypeRef.current = 'batchSign';
    setSignModalVisible(true);
  };

  // 合同转递
  const onContractDeliver = async (recordId) => {
    const res = await sharedContractDeliver({ contractId: recordId });
    if (!res) return;
    breakContractList();
  };

  // 渲染 印章类型
  const renderSealType = (sealType) => {
    let sealValue = '--';
    if (is.existy(sealTypes) && is.not.empty(sealTypes) && is.object(sealTypes)) {
      Object.keys(sealTypes).map((key) => {
        if (Number(key) === sealType) {
          sealValue = sealTypes[key];
        }
      });
    }
    return sealValue;
  };


  const columns = [
    {
      title: '序号',
      dataIndex: 'number',
      fixed: 'left',
      width: 100,
      render: (_, record) => (utils.dotOptimal(record, 'number', '--')),
    },
    {
      title: 'boss审批单号',
      dataIndex: 'application_order_id',
      fixed: 'left',
      width: 150,
      render: text => text || '--',
    },
    {
      title: '提报日期',
      dataIndex: 'submit_at',
      fixed: 'left',
      width: 150,
      render: text => (text ? moment(`${text}`).format('YYYY-MM-DD') : '--'),
    },
    {
      title: '提报人',
      dataIndex: ['apply_account_info', 'name'],
      fixed: 'left',
      width: 100,
      render: text => text || '--',
    },
    {
      title: '合同类型',
      dataIndex: 'pact_type',
      key: 'pact_type',
      width: 100,
      render: (text) => {
        if (text && pactTypes && pactTypes[text]) {
          return pactTypes[text];
        }
        return '--';
      },
    },
    {
      title: '签订单位',
      dataIndex: ['firm_info', 'name'],
      width: 150,
      render: text => text || '--',
    },
    {
      title: '盖章类型',
      dataIndex: 'seal_type',
      width: 100,
      render: (text) => {
        return text ? renderSealType(text) : '--';
      },
    },
    {
      title: '合同名称',
      dataIndex: 'name',
      width: 150,
      render: text => text || '--',
    },
    {
      title: '合同份数',
      dataIndex: 'copies',
      width: 100,
      render: (_, record) => (utils.dotOptimal(record, 'copies', '--')),
    },
    {
      title: '合同甲方',
      dataIndex: 'pact_part_a',
      width: 200,
      render: text => text || '--',
    },
    {
      title: '合同乙方',
      dataIndex: 'pact_part_b',
      width: 200,
      render: text => text || '--',
    },
    {
      title: '合同丙方',
      dataIndex: 'pact_part_c',
      width: 200,
      render: text => text || '--',
    },
    {
      title: '合同丁方',
      dataIndex: 'pact_part_d',
      width: 200,
      render: text => text || '--',
    },
    {
      title: '合同起始日期',
      dataIndex: 'from_date',
      width: 120,
      render: text => (text ? moment(`${text}`).format('YYYY-MM-DD') : '--'),
    },
    {
      title: '合同终止日期',
      dataIndex: 'end_date',
      width: 120,
      render: text => (text ? moment(`${text}`).format('YYYY-MM-DD') : '--'),
    },
    {
      title: '转交状态',
      dataIndex: 'is_deliver',
      width: 100,
      render: text => (typeof text === 'boolean' ? text ? '已转交' : '未转交' : '--'),
    },
    {
      title: '盖章状态',
      dataIndex: 'owner_is_signed',
      width: 100,
      render: text => (typeof text === 'boolean' ? text ? '已盖章' : '未盖章' : '--'),
    },
    {
      title: '邮寄状态',
      dataIndex: 'mail_state',
      width: 100,
      render: text => (text ? SharedContractMailState.description(text) : '--'),
    },
    {
      title: '归档状态',
      dataIndex: 'is_filed',
      width: 100,
      render: text => (typeof text === 'boolean' ? text ? '已归档' : '未归档' : '--'),
    },
    {
      title: '借阅状态',
      dataIndex: 'borrow_state',
      width: 100,
      render: (text) => {
        if (text) return SharedContractBorrowState.description(text);
        return '--';
      },
    },
    {
      title: '合同状态',
      dataIndex: 'state',
      fixed: 'right',
      width: 100,
      render: text => ((text && tabKey !== 'tab4') ? SharedNewContractState.description(text) : '--'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      fixed: 'right',
      width: 150,
      render: (id, record) => {
        const detailUrl = `/#/Shared/Contract/Detail?id=${id}&tabKey=${tabKey}`;
        return (
          <div>
            {
              record.is_can_deliver
                ? <Popconfirm
                  title="确定转递合同?"
                  onConfirm={() => { onContractDeliver(record._id); }}
                  okText="是"
                  cancelText="否"
                >
                  <a href="#!" style={{ marginRight: 10 }} onClick={(e) => { e.preventDefault(); }}>转递合同</a>
                </Popconfirm>
                : null
            }
            {
              // 判断是否有盖章权限，并且印章保管人id和当前账号id是否相等
              record.is_can_sign && record.keep_account_id === authorize.account.id
                ? <a href="#!" style={{ marginRight: 10 }} onClick={(e) => { e.preventDefault(); onSign(record); }}>盖章</a>
                : null
            }
            {
              record.is_can_mail
                ? <a style={{ marginRight: 10 }} onClick={() => onClickToMail(record._id)}>邮寄</a>
                : null
            }
            {
              // 判断是否有归档权限,并且合同保管人id和当前账号id是否相等
              record.is_can_filed && record.preserver_id === authorize.account.id
                ? <a style={{ marginRight: 10 }} onClick={() => onClickToFiles(record.number, record._id)}>归档</a>
                : null
            }
            {
              (Operate.canOperateSharedContractDetail() && record.is_can_get)
                ? <a style={{ marginRight: 10 }} href={detailUrl} target="_blank" rel="noopener noreferrer">查看</a>
                : null
            }
            {
              record.is_can_cancel
                ? <a style={{ marginRight: 10 }} onClick={() => onClickToVoid(record)}>作废</a>
                : null
            }
          </div>
        );
      },
    },
  ];
  // 获取表头的宽度
  const columnsWidth = columns.map(v => v.width);
  const scrollX = columnsWidth.reduce((x, y) => x + y);

  const pagination = {
    current: meta.page || 1,
    defaultPageSize: 30,
    pageSize: meta.page_size || 30,
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: (page, limit) => {
      onChangePage(page, limit);
      setSelectedRowKeys([]);
    },
    onShowSizeChange,
    showTotal: showTotal => `总共${showTotal}条`,
    total: meta.result_count,
    pageSizeOptions: ['10', '20', '30', '40'],
  };

  const renderRowSelection = () => {
    if (tabKey !== 'tab1') return undefined;
    return {
      selectedRowKeys,
      onChange: (selectedKeys) => {
        setSelectedRowKeys(selectedKeys);
      },
      getCheckboxProps: record => (
        // 判断是否有盖章权限，并且印章保管人id和当前账号id是否相等
        record.is_can_sign &&
          record.keep_account_id === authorize.account.id
          ? {} : { disabled: true }),
    };
  };

  const renderTitleExt = () => {
    if (tabKey === 'tab1') {
      return (
        <Button
          type="primary"
          disabled={!selectedRowKeys.length > 0}
          onClick={onBatchSign}
        >
          批量盖章
        </Button>
      );
    }
    return null;
  };

  // 渲染盖章/批量盖章操作Modal
  const renderSignModal = () => {
    if (tabKey !== 'tab1') return;
    // 批量盖章合同信息
    const batchSignContractInfo = data.filter(v => selectedRowKeys.includes(v._id));
    return (
      <SignModal
        visible={signModalVisible}
        setSignModalVisible={setSignModalVisible}
        signType={signTypeRef.current}
        signContractInfo={signContractInfo.current}
        batchSignContractInfo={batchSignContractInfo}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        breakContractList={breakContractList}
      />
    );
  };

  // render 作废
  const renderVoidPopup = () => {
    if (Object.keys(voidData).length === 0) return;
    return (
      <VoidPopupComponent breakContractList={breakContractList} data={voidData} visible={voidVisible} setVisible={setVoidVisible} />
    );
  };
  // render 邮寄
  const renderMailPopup = () => {
    if (!contractId) return;
    return (
      <MailPopupComponent breakContractList={breakContractList} _id={contractId} visible={mailVisible} setVisible={setMailVisible} />
    );
  };
  // render 存档
  const renderFilesPopup = () => {
    // if (!contractNumber) return;
    return (<FilesPopupComponent breakContractList={breakContractList} _id={contractId} visible={filesVisible} setVisible={setFilesVisible} contractNumber={contractNumber} />);
  };


  return (
    <CoreContent title={renderTitleExt()}>
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        scroll={{ x: scrollX }}
        pagination={pagination}
        rowSelection={renderRowSelection()}
        loading={tableLoading}
        bordered
      />
      {/* 渲染盖章/批量盖章操作Modal */}
      {renderSignModal()}
      {/* 作废组件 */}
      {renderVoidPopup()}
      {/* 邮寄组件 */}
      {renderMailPopup()}
      {/* 存档组件 */}
      {renderFilesPopup()}
    </CoreContent>
  );
}

export default Content;
