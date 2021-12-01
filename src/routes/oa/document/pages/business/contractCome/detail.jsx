/**
 * 财商类 - 合同会审 - 详情
 */

import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import is from 'is_js';
import React, { useEffect } from 'react';
import { utils } from '../../../../../../application';
import { CoreContent, DeprecatedCoreForm, CoreFinder } from '../../../../../../components/core';

import {
  Unit,
  BusinesContractComeVersionType,
  BusinesContractComeInvoiceType,
  BusinesContractComeNatureType,
  CodeOrderType,
  OAContractStampType,
} from '../../../../../../application/define';
import { PageEmployeesSelectOnly } from '../common/index';
import ComponentSealType from './components/sealType';

const { CoreFinderList } = CoreFinder;

function ContractComeDetail(props) {
  const {
    dispatch,
    businessCameDetail,
    query,
    oaDetail = {},
    examineOrderDetail,
    contractTypeData = {},
  } = props;
  // 合同类型
  const data = (contractTypeData || {}).pact_types || {};
  // 合同子类型
  const subdata = (contractTypeData || {}).pact_sub_types || {};

  // 接口请求
  useEffect(() => {
    // 请求接口
    if (oaDetail._id) {
      dispatch({ type: 'business/fetchBusinessPactApplyOrderDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'business/fetchBusinessPactApplyOrderDetail', payload: { id: query.id } });
    }
    dispatch({ type: 'business/fetchContractType', payload: {} });
  }, [dispatch, query.id, oaDetail]);

  // 预览组件
  const renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.asset_url')) {
      const values = value.map((item) => {
        return { key: item.asset_key, url: item.asset_url };
      });
      return (
        <CoreFinderList data={values} />
      );
    }
    return '--';
  };

  // 关联审批单
  const renderRelationOrderIds = () => {
    const ids = utils.showPlainText(businessCameDetail, 'relation_application_order_list', []);
    // 判断是否有数据
    if (ids.length > 0) {
      return ids.map((v) => {
        if (v.order_type === CodeOrderType.new) {
          return (
            <div>
              {
                // 判断当前审批单是否为外部审批单
                utils.showPlainText(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', '')
                ? <span>{v._id}</span>
                : <a
                  key="detail"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/#/Code/PayOrder/Detail?orderId=${v._id}&isShowOperation=true`}
                >
                  {v._id}
                </a >
              }
            </div>
          );
        }
        // 费用审批单
        if (v.order_type === CodeOrderType.old) {
          return (
            <div>
              {
                // 判断当前审批单是否为外部审批单
                utils.showPlainText(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', '')
                ? <span>{v._id}</span>
                : <a
                  key="detail"
                  href={`/#/Expense/Manage/ExamineOrder/Detail?orderId=${v._id}`}
                  rel="noopener noreferrer"
                >
                  {v._id}
                </a >
              }
            </div>
          );
        }
      });
    }
    return '--';
  };

  // 兼容处理
  const childFunction = () => {
    const allData = (contractTypeData || {}).pact_types_has_sub_types || {};
    const parentType = (businessCameDetail || {}).pact_type || {};
    if (is.empty(parentType) || is.empty(allData)) return '--';
    if (is.empty((allData[parentType] || {}).sub_types || {})) return '无';
    const childType = (businessCameDetail || {}).pact_sub_type || {};
    return subdata[childType] && subdata[childType] !== 0 ? subdata[childType] : '--';
  };

  // 兼容处理
  const contractParentFunction = () => {
    const parentData = (businessCameDetail || {}).pact_type || {};
    if (is.empty(parentData)) return '--';
    if (parentData === 90 || parentData === 99) {
      return '其他';
    }

    if ((businessCameDetail || {}).pact_type) {
      return data[parentData] || '--';
    }
    return '--';
  };
  const styleLayout = {
    style: { display: 'flex', margin: '0 0 10px 0' },
  };

  // 渲染表单
  const renderFrom = function () {
    const formItems = [
      {
        label: '会审类型',
        span: 8,
        style: styleLayout,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: businessCameDetail ? OAContractStampType.description(businessCameDetail.stamp_type) : '--',
      },
      {
        label: '合同类型',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: contractParentFunction(),
      },
      {
        label: '合同子类型',
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: childFunction(),
      },
      {
        label: '合同名称',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: dot.get(businessCameDetail, 'name', '--'),
      },
      {
        label: '签订人',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: dot.get(businessCameDetail, 'singer', '--'),
      },
      {
        label: '签订单位',
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessCameDetail, 'firm_info.name', '--'),
      },
      {
        label: '盖章类型',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 }, style: { display: 'flex', margin: '0 0 10px 0' } },
        // form: dot.get(businessCameDetail, 'seal_type') ? AdministrationSealType.description(dot.get(businessCameDetail, 'seal_type')) : '--',
        form: (
          <ComponentSealType
            isDetail
            firmId={dot.get(businessCameDetail, 'firm_info._id', undefined)}
            value={dot.get(businessCameDetail, 'seal_type', undefined)}
          />),
      },
      {
        label: '签订甲方',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: businessCameDetail.pact_part_a || '--',
      },
      {
        label: '签订丙方',
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: businessCameDetail.pact_part_c || '--',
      },
      {
        label: '签订乙方',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: businessCameDetail.pact_part_b || '--',
      },
      {
        label: '签订丁方',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: businessCameDetail.pact_part_d || '--',
      },
      {
        label: '合同份数',
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: <div><span style={{ marginRight: '10px' }}>{`一式：${dot.get(businessCameDetail, 'copies', 0)} 份`}</span><span style={{ marginRight: '10px' }}>{`其中我方：${dot.get(businessCameDetail, 'our_copies', 0)} 份`}</span><span>{`对方：${dot.get(businessCameDetail, 'opposite_copies', 0)} 份`}</span></div>,
      },
      {
        label: '合同起始日期',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: dot.get(businessCameDetail, 'from_date') ? moment(`${dot.get(businessCameDetail, 'from_date')}`).format('YYYY-MM-DD') : '--',
      },
      {
        label: '合同到期日期',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: dot.get(businessCameDetail, 'end_date') ? moment(`${dot.get(businessCameDetail, 'end_date')}`).format('YYYY-MM-DD') : '--',
      },
      {
        label: '合同保管人',
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: <PageEmployeesSelectOnly isDetail />,
      },
      {
        label: '合同编号',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: utils.showPlainText(businessCameDetail, 'pact_no'),
      },
      {
        label: '合同性质',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: dot.get(businessCameDetail, 'pact_property') ? BusinesContractComeNatureType.description(dot.get(businessCameDetail, 'pact_property')) : '--',
      },
      // {
      //   label: '合同类型',
      //   span: 12,
      //   layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
      //   form: dot.get(businessCameDetail, 'pact_type') ? BusinesContractComeType.description(dot.get(businessCameDetail, 'pact_type')) : '--',
      // },
      {
        label: '签订电话',
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: utils.showPlainText(businessCameDetail, 'sign_phone'),
      },
      {
        label: '合同单价',
        span: 9,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: dot.get(businessCameDetail, 'unit_price') ? `${Unit.exchangePriceToYuan(dot.get(businessCameDetail, 'unit_price'))}元` : '--',
      },
      {
        label: '发票类型',
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessCameDetail, 'invoice_type') ? BusinesContractComeInvoiceType.description(dot.get(businessCameDetail, 'invoice_type')) : '--',
      },
      {
        label: '票务负责人',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 16 } },
        form: dot.get(businessCameDetail, 'fare_manager_info.employee_info.name', '--'),
      },
      {
        label: '关联审批单',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: <div>{renderRelationOrderIds()}</div>,
      },
      {
        label: '合同版本是否已返回',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: BusinesContractComeVersionType.description(dot.get(businessCameDetail, 'is_backed')),
      },
      {
        label: '合同主要内容及条款',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: <span className="noteWrap">{dot.get(businessCameDetail, 'content', '--')}</span>,
      },
      {
        label: '上传附件',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 }, style: { margin: 0 } },
        form: renderCorePreview(dot.get(businessCameDetail, 'asset_infos.asset_maps', [])),
      },
    ];

    return (
      <CoreContent title="合同信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  };

  return (
    <Form layout="horizontal">
      {/* 渲染表单 */}
      {renderFrom()}
    </Form>
  );
}

const mapStateToProps = ({
  business: { businessCameDetail, contractTypeData },
}) => {
  return { businessCameDetail, contractTypeData };
};
export default connect(mapStateToProps)(ContractComeDetail);
