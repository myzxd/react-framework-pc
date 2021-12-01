/**
 * 共享登记 - 合同详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  message,
} from 'antd';
import is from 'is_js';
import { connect } from 'dva';
import AuthorityComponent from '../component/authorityComponent';
import { utils, authorize } from '../../../application';
import {
  Unit,
  BusinesContractComeNatureType,
  SharedBusinessType,
  BusinesContractComeInvoiceType,
  SharedNewContractState,
  SharedAuthorityState,
  SharedSourceType,
  CodeOrderType,
} from '../../../application/define';
import { CoreForm, CoreContent } from '../../../components/core';
import { PageUpload } from '../../oa/document/components/index';
import SignModal from '../component/signModal'; // 盖章/批量盖章Modal
import FilesPopupComponent from '../component/filesPopupComponent'; // 归档Modal
import ContractType from '../component/contractType';
import Operate from '../../../application/define/operate';
import aoaoBossTools from '../../../utils/util';

const FormLayoutC3 = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

const formLayoutC1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const layout = {
  style: { display: 'flex', margin: '0 0 10px 0' },
};
const ContractDetail = ({
  history,
  contractDetail = {},
  location = {},
  getContractDetail,
  resetContractDetail,
  updateForm,
  contractTypeData = {},
  getContractTypeDetail,
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;
  // SignModal visible
  const [signModalVisible, setSignModalVisible] = useState(false);
  // 存档 弹窗状态
  const [filesVisible, setFilesVisible] = useState(false);

  useEffect(() => {
    query.id && getContractDetail({ id: query.id });
    return () => resetContractDetail();
  }, [getContractDetail, resetContractDetail, query.id]);

  useEffect(() => {
    getContractTypeDetail();
  }, []);
  if (!contractDetail || Object.keys(contractDetail).length <= 0) return <div />;


  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const { lookAccountInfo } = formRes;
    if (lookAccountInfo.state === SharedAuthorityState.section
      && lookAccountInfo.accountInfo.length === 0
      && lookAccountInfo.departmentInfo.length === 0) {
      return message.error('请选择指定范围');
    }
    delete formRes.shared;
    const ids = dot.get(contractDetail, 'relation_application_order_list', []);
    const relationApplicationOrderList = ids.map((item) => { if (item._id) return item._id; });
    const res = await updateForm({ ...formRes, _id: query.id, relationApplicationOrderList });
    if (res && res._id) {
      message.success('请求成功');
      window.location.href = '/#/Shared/Contract';
    }
  };

  // 盖章操作
  const onSign = () => {
    setSignModalVisible(true);
  };

  // 渲染盖章/批量盖章操作Modal
  const renderSignModal = () => {
    if (query.tabKey !== 'tab1') return;
    return (
      <SignModal
        visible={signModalVisible}
        setSignModalVisible={setSignModalVisible}
        signType="sign"
        signContractInfo={contractDetail || {}}
        breakContractList={() => {
          history.push('/Shared/Contract');
        }}
      />
    );
  };

  // 归档操作
  const onArchive = () => {
    setFilesVisible(true);
  };

  // 渲染归档操作Modal
  const renderFilesPopup = () => {
    return (
      <FilesPopupComponent
        breakContractList={() => { getContractDetail({ id: query.id }); }}
        _id={utils.dotOptimal(contractDetail, '_id', '')}
        visible={filesVisible}
        setVisible={setFilesVisible}
        contractDetail={contractDetail}
        contractNumber={utils.dotOptimal(contractDetail, 'number', '')}
      />);
  };

  // 关联审批单
  const renderRelationOrderList = () => {
    const ids = dot.get(contractDetail, 'relation_application_order_list', []);
    // 判断是否有数据
    if (is.existy(ids) && is.not.empty(ids)) {
      return ids.map((v, d) => {
        if (v.order_type === CodeOrderType.new) {
          return (<p key={v._id || d}><a
            key="detail"
            target="_blank"
            rel="noopener noreferrer"
            href={`/#/Code/PayOrder/Detail?orderId=${v._id}&isShowOperation=true`}
          >
            {v._id}</a></p>);
        }
        // 费用审批单
        if (v.order_type === CodeOrderType.old) {
          return (
            <p key={v._id || d}>
              <Button
                type="link"
                key="detail"
                onClick={() =>
                   aoaoBossTools.popUpCompatible(`/#/Expense/Manage/ExamineOrder/Detail?orderId=${v._id}`)
                  // window.open(`/#/Expense/Manage/ExamineOrder/Detail?orderId=${v._id}`)
                }
              >{v._id}
              </Button>
            </p>
          );
        }
      });
    }
    return '--';
  };

  const {
    pact_property: pactProperty = undefined,
    pact_type: pactType = undefined,
    from_date: fromDate = undefined,
    end_date: endDate = undefined,
    unit_price: unitPrice = undefined,
    business_type: businessType = undefined,
    singer = undefined,
    singer_phone: singerPhone = undefined,
    seal_type: sealType = undefined,
    invoice_type: invoiceType = undefined,
    copies = 0,
    our_copies: ourCopies = 0,
    opposite_copies: oppositeCopies = 0,
    created_at: createdAt = undefined,
    state = undefined,
    expected_return_date: expectedReturnDate = undefined,
  } = contractDetail;

  // 合同类型
  // const data = contractTypeData.pact_sub_types || {};
  // 合同子类型
  const subdata = (contractTypeData || {}).pact_sub_types || {};
  // 兼容处理
  const childFunction = () => {
    const allData = (contractTypeData || {}).pact_types_has_sub_types || {};
    const parentType = (contractDetail || {}).pact_type || {};
    if (is.empty(parentType) || is.empty(allData)) return '--';
    if (is.empty((allData[parentType] || {}).sub_types || {})) return '无';
    const childType = (contractDetail || {}).pact_sub_type || {};
    return subdata[childType] && subdata[childType] !== 0 ? subdata[childType] : '--';
  };
  const sealTypes = dot.get(contractTypeData, 'seal_types', '--');
    // 渲染 印章类型
  const renderSealType = (value) => {
    let sealValue = '--';
    if (is.existy(sealTypes) && is.not.empty(sealTypes) && is.object(sealTypes)) {
      Object.keys(sealTypes).map((key) => {
        if (Number(key) === value) {
          sealValue = sealTypes[key];
        }
      });
    }
    return sealValue;
  };
  const items = [
    <Form.Item
      {...layout}
      label="合同编号"
    >
      {dot.get(contractDetail, 'pact_no', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="合同名称"
    >
      {dot.get(contractDetail, 'name', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="签订人"
    >
      {singer || '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="签订单位"
    >
      {dot.get(contractDetail, 'firm_info.name', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="合同单价（元）"
    >
      {unitPrice ? Unit.exchangePriceToYuan(unitPrice) : '0.00'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="盖章类型"
    >
      {sealType ? renderSealType(sealType) : '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="签订甲方"
    >
      {dot.get(contractDetail, 'pact_part_a', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="签订乙方"
    >
      {dot.get(contractDetail, 'pact_part_b', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="签订丙方"
    >
      {dot.get(contractDetail, 'pact_part_c', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="签订丁方"
    >
      {dot.get(contractDetail, 'pact_part_d', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="份数"
    >
      一式
      <span>{copies ? copies : 0}</span>
      份，其中我方
      <span>{ourCopies ? ourCopies : 0}</span>
      份，对方
      <span>{oppositeCopies ? oppositeCopies : 0}</span>
      份
    </Form.Item>,
    <Form.Item
      {...layout}
      label="合同起始日期"
    >
      {fromDate ? moment(String(fromDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="合同终止日期"
    >
      {endDate ? moment(String(endDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="业务类别"
    >
      {businessType ? SharedBusinessType.description(businessType) : '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="所属区域"
    >
      <span>{dot.get(contractDetail, 'province_name', '-')}</span>
      <span>{dot.get(contractDetail, 'city_name', '-')}</span>
    </Form.Item>,
    <Form.Item
      {...layout}
      label="合同保管人"
    >
      {dot.get(contractDetail, 'preserver_info.name', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="合同性质"
    >
      {pactProperty ? BusinesContractComeNatureType.description(pactProperty) : '--'}
    </Form.Item>,

    <Form.Item
      {...layout}
      label="合同类型"
    >
      {pactType ? <ContractType isDetail showValue={[pactType]} /> : '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="合同子类型"
    >
      { childFunction()}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="签订电话"
    >
      {singerPhone || '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="发票类型"
    >
      {invoiceType ? BusinesContractComeInvoiceType.description(invoiceType) : '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="票务负责人"
    >
      {dot.get(contractDetail, 'fare_manager_info.name', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="关联审批单"
    >
      {renderRelationOrderList()}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="客户方合同编号"
    >
      {dot.get(contractDetail, 'part_pact_no', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="客户公司"
    >
      {dot.get(contractDetail, 'customer_company', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="客户信息"
    >
      {dot.get(contractDetail, 'customer_info', '--')}
    </Form.Item>,

    <Form.Item
      {...layout}
      label="快递公司"
    >
      {dot.get(contractDetail, 'mail_company', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="快递单号"
    >
      {dot.get(contractDetail, 'mail_no', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="存放地"
    >
      {dot.get(contractDetail, 'filed_info.filed_address', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="存放档案盒"
    >
      {dot.get(contractDetail, 'filed_info.filed_box', '--')}
    </Form.Item>,
  ];

  const itemsOne = [
    <Form.Item
      {...layout}
      label="主要内容及条款"
      {...formLayoutC1}
    >
      <span className="noteWrap">{dot.get(contractDetail, 'content', '--') || '--'}</span>
    </Form.Item>,
    <Form.Item
      {...layout}
      label="备注"
      {...formLayoutC1}
    >
      <div className="noteWrap">{dot.get(contractDetail, 'note', '--') || '--'}</div>
    </Form.Item>,
    <Form.Item
      {...layout}
      label="附件"
      {...formLayoutC1}
    >
      <PageUpload
        domain={PageUpload.UploadDomains.OAUploadDomain}
        displayMode
        value={PageUpload.getInitialValue(contractDetail, 'asset_infos')}
      />
    </Form.Item>,
    <Form.Item
      {...layout}
      label="盖章操作附件"
      {...formLayoutC1}
    >
      <PageUpload
        domain={PageUpload.UploadDomains.OAUploadDomain}
        displayMode
        value={PageUpload.getInitialValue(contractDetail, 'sign_operation_asset_infos')}
      />
    </Form.Item>,
    <Form.Item
      {...layout}
      label="盖章合同附件"
      {...formLayoutC1}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: 500 }}>
          <PageUpload
            domain={PageUpload.UploadDomains.OAUploadDomain}
            displayMode
            special
            value={PageUpload.getInitialValue(contractDetail, 'sign_asset_infos')}
          />
        </div>
        {
          // 是否归档，并且合同保管人id和当前账号id是否相等
          utils.dotOptimal(contractDetail, 'is_filed', false) && contractDetail.preserver_id === authorize.account.id ?
            (
              <a
                style={{ marginLeft: 10, color: '#FF7700' }}
                onClick={() => setFilesVisible(true)}
              >修改</a>
            )
          : ''
        }
      </div>
    </Form.Item>,
  ];

  // 合同信息
  const itemContract = [
    <Form.Item
      {...layout}
      label="来源"
    >
      {
        dot.get(contractDetail, 'source_type', '')
        ? SharedSourceType.description(dot.get(contractDetail, 'source_type'))
        : '--'
      }
    </Form.Item>,
    <Form.Item
      {...layout}
      label={
      dot.get(contractDetail, 'source_type', '') === SharedSourceType.approval
      ? '提报人'
      : '创建人'
    }
    >
      {
        dot.get(contractDetail, 'source_type', '') === SharedSourceType.approval
        ? dot.get(contractDetail, 'report_info.name', '--')
        : dot.get(contractDetail, 'creator_info.name', '--')
      }
    </Form.Item>,
    <Form.Item
      {...layout}
      label="创建时间"
    >
      {createdAt ? moment(String(createdAt)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="合同状态"
    >
      {state && query.tabKey !== 'tab4' ? SharedNewContractState.description(state) : '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="合同操作状态"
    >
      {Unit.ContractState(contractDetail.is_deliver, contractDetail.owner_is_signed, contractDetail.mail_state, contractDetail.is_filed)}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="借用人"
    >
      {dot.get(contractDetail, 'borrower_info.name', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="预计归还时间"
    >
      {expectedReturnDate ? moment(String(expectedReturnDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="转递合同时间"
    >
      {
      (contractDetail || {}).deliver_at ?
      moment((contractDetail || {}).deliver_at).format('YYYY-MM-DD')
      : '--'
      }
    </Form.Item>,
    <Form.Item
      {...layout}
      label="盖章时间"
    >
      {
      (contractDetail || {}).sign_at ?
      moment((contractDetail || {}).sign_at).format('YYYY-MM-DD')
      : '--'
      }
    </Form.Item>,
    <Form.Item
      {...layout}
      label="盖章操作人"
    >
      {dot.get(contractDetail, 'sign_operator_info.name', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="邮寄时间"
    >
      {
      (contractDetail || {}).mail_at ?
      moment((contractDetail || {}).mail_at).format('YYYY-MM-DD')
      : '--'
      }
    </Form.Item>,
    <Form.Item
      {...layout}
      label="作废时间"
    >
      {
      (contractDetail || {}).cancel_at ?
      moment((contractDetail || {}).cancel_at).format('YYYY-MM-DD')
      : '--'
      }
    </Form.Item>,
    <Form.Item
      {...layout}
      label="失效时间"
    >
      {
      (contractDetail || {}).disabled_at ?
      moment((contractDetail || {}).disabled_at).format('YYYY-MM-DD')
      : '--'
      }
    </Form.Item>,
    <Form.Item
      {...layout}
      label="归档时间"
    >
      {
      (contractDetail || {}).filed_at ?
      moment((contractDetail || {}).filed_at).format('YYYY-MM-DD')
      : '--'
      }
    </Form.Item>,
    <Form.Item
      {...layout}
      label="归档操作人"
    >
      {dot.get(contractDetail, 'filed_operator_info.name', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="作废原因"
    >
      {dot.get(contractDetail, 'cancel_note', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="盖章备注"
    >
      {utils.dotOptimal(contractDetail, 'sign_note', '--')}
    </Form.Item>,
    <Form.Item
      {...layout}
      label="存档备注"
    >
      {utils.dotOptimal(contractDetail, 'filed_info.filed_note', '--')}
    </Form.Item>,
  ];

  const initialValues = {
    lookAccountInfo: {
      state: dot.get(contractDetail, 'look_acl', SharedAuthorityState.section),
      accountInfo: dot.get(contractDetail, 'look_account_info_list', []).map(item => ({ id: item._id, name: item.name })),
      departmentInfo: dot.get(contractDetail, 'look_department_info_list', []).map(item => ({ id: item._id, name: item.name })),
    },
  };
  return (
    <React.Fragment>
      <Form {...FormLayoutC3} form={form} initialValues={initialValues}>
        <CoreContent>
          <CoreForm items={items} />
          <CoreForm items={itemsOne} cols={1} />
        </CoreContent>
        <CoreContent>
          <CoreForm items={itemContract} />
        </CoreContent>
        {
          Operate.canOperateSharedContractAuthority() ?
          (<CoreContent title="权限">
            <AuthorityComponent detail={contractDetail} />
          </CoreContent>) : ''
        }
        {
          !Operate.canOperateSharedContractAuthority()
            && !(contractDetail.is_can_filed && contractDetail.preserver_id === authorize.account.id)
            && !contractDetail.is_can_sign && contractDetail.keep_account_id === authorize.account.id
            ? ''
            : (
              <CoreContent>
                <div style={{ textAlign: 'center' }}>
                  {
                    Operate.canOperateSharedContractAuthority() &&
                      (<Button style={{ marginRight: 20 }} type="primary" onClick={onSubmit}>保存</Button>)
                  }
                  {
                    // 判断是否有归档的权限,并且合同保管人id和当前账号id是否相等
                    contractDetail.is_can_filed && contractDetail.preserver_id === authorize.account.id
                    && <Button style={{ marginRight: 20 }} type="primary" onClick={onArchive}>归档</Button>
                  }
                  {
                    // 判断是否有盖章的权限,并且印章保管人id和当前账号id是否相等
                    contractDetail.is_can_sign && contractDetail.keep_account_id === authorize.account.id
                    && <Button type="primary" onClick={onSign}>盖章</Button>
                  }
                </div>
              </CoreContent>
            )
        }
      </Form>
      {/* 渲染盖章操作Modal */}
      {renderSignModal()}
      {/* 渲染归档操作Modal */}
      {renderFilesPopup()}
    </React.Fragment>
  );
};

const mapDispatchToProps = dispatch => ({
  getContractTypeDetail: () => dispatch({
    type: 'sharedContract/fetchContractType',
  }),
  getContractDetail: payload => dispatch({
    type: 'sharedContract/getSharedContractDetail',
    payload,
  }),
  resetContractDetail: () => dispatch({
    type: 'sharedContract/resetSharedContractDetail',
    payload: {},
  }),
  // 编辑保存
  updateForm: payload => dispatch({
    type: 'sharedContract/updateSharedContractDetail',
    payload,
  }),
});

const mapStateToProps = ({ sharedContract: { contractDetail, contractTypeData } }) => ({ contractDetail, contractTypeData });

export default connect(mapStateToProps, mapDispatchToProps)(ContractDetail);
