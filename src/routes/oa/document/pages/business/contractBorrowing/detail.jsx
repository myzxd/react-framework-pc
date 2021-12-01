/**
 * 财商类 - 合同借阅 - 详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import React, { useEffect } from 'react';
import { utils } from '../../../../../../application';
import { CoreContent, DeprecatedCoreForm, CoreFinder } from '../../../../../../components/core';
import { OAContractBorrowingType } from '../../../../../../application/define';

const { CoreFinderList } = CoreFinder;

function ContractBorrowingDetail(props) {
  const {
    dispatch,
    businessBorrowDetail,
    query,
    oaDetail = {},
  } = props;

  // 接口请求
  useEffect(() => {
    // 请求接口
    if (oaDetail._id) {
      dispatch({ type: 'business/fetchBusinessPactBorrowOrderDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'business/fetchBusinessPactBorrowOrderDetail', payload: { id: query.id } });
    }
  }, [dispatch, query.id, oaDetail]);

  // 渲染基础信息
  const renderBasisnfo = function () {
    const fromBorrowing = [
      {
        label: '借阅类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBorrowDetail, 'pact_borrow_type') ? OAContractBorrowingType.description(dot.get(businessBorrowDetail, 'pact_borrow_type')) : '--',
      },
      {
        label: '借阅份数',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBorrowDetail, 'borrow_copies', '--'),
      },
      {
        label: '借阅时间',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBorrowDetail, 'from_date') ? moment(`${dot.get(businessBorrowDetail, 'from_date')}`).format('YYYY-MM-DD') : '--',
      },
      {
        label: '预计归还时间',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBorrowDetail, 'expect_end_date') ? moment(`${dot.get(businessBorrowDetail, 'expect_end_date')}`).format('YYYY-MM-DD') : '--',
      },
      {
        label: '借阅事由',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBorrowDetail, 'cause', '--'),
      },
      {
        label: '使用城市',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(businessBorrowDetail, 'city_name', '--'),
      },
      {
        label: '是否需要归还',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: <span>{`${utils.showPlainText(businessBorrowDetail, 'pact_borrow_type', '')}` === `${OAContractBorrowingType.original}` ? '是' : '否'}</span>,
      },
      {
        label: '申请原因及说明',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: <span className="noteWrap">{dot.get(businessBorrowDetail, 'note', '--')}</span>,
      },
    ];

    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={fromBorrowing} />
      </CoreContent>
    );
  };

  // 预览组件
  const renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.asset_url')) {
      const data = value.map((item) => {
        return { key: item.asset_key, url: item.asset_url };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };

  // 渲染表单
  const renderFrom = function () {
    const formItems = [
      {
        label: '上传附件',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: renderCorePreview(dot.get(businessBorrowDetail, 'asset_infos.asset_maps', [])),
      },
    ];

    return (
      <CoreContent title="合同信息">
        {
          utils.showPlainText(businessBorrowDetail, 'pact_list', [{}]).map((item) => {
            const contractFormItems = [
              {
                label: '合同名称',
                span: 24,
                layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
                form: utils.showPlainText(item, 'name'),
              },
              {
                label: '签订甲方',
                span: 12,
                layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
                form: utils.showPlainText(item, 'pact_part_a') || '--',
              },
              {
                label: '签订丙方',
                span: 12,
                layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
                form: utils.showPlainText(item, 'pact_part_c') || '--',
              },
              {
                label: '签订乙方',
                span: 12,
                layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
                form: utils.showPlainText(item, 'pact_part_b') || '--',
              },
              {
                label: '签订丁方',
                span: 12,
                layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
                form: utils.showPlainText(item, 'pact_part_d') || '--',
              },
            ];
            return (
              <DeprecatedCoreForm items={contractFormItems} />
            );
          })
        }
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  };

  return (
    <Form layout="horizontal">
      {/* 渲染基础信息 */}
      {renderBasisnfo()}

      {/* 渲染表单 */}
      {renderFrom()}
    </Form>
  );
}


const mapStateToProps = ({ business: { businessBorrowDetail, contractSelectInfo } }) => {
  return { businessBorrowDetail, contractSelectInfo };
};

export default connect(mapStateToProps)(ContractBorrowingDetail);

