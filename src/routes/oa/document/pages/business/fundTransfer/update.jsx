/**
 * 财商类 - 资金调拨 - 编辑
 */
import React, { useEffect } from 'react';
import { InputNumber, Form, Input, Button, Row, Col } from 'antd';
import { connect } from 'dva';
import dot from 'dot-prop';
import is from 'is_js';
import updateHelper from 'immutability-helper';

import {
  CoreContent,
  CoreForm,
} from '../../../../../../components/core';
import { PageFundTrasferCauseSelect, PageCompanySelect, PageAccountSelect } from '../common';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components';
import styles from './styles.less';
import { FundTransferOtherReasonEnum, Unit } from '../../../../../../application/define';
import ExamineFlow from '../../../components/form/flow';

const FormLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

// 调入/调出方最大个数
const MAX_ACCOUNT_COUNT = 6;

function FundTransferCreate({
  query = {}, update, fetchData, clearData, dataSource,
  examineFlowInfo = [],
}) {
  const { id } = query;
  const [form] = Form.useForm();

  // 加载详情数据
  useEffect(() => {
    fetchData(id);
    return clearData;
  }, [fetchData, clearData, id]);

  useEffect(() => {
    const transferFormBlock = (source) => {
      return source.map(item => ({
        reason: item.allocate_reason,
        otherReason: item.other_reason,
        company: item.firm_id,
        account: item.bank_account_id,
        amount: Unit.exchangePriceToYuan(item.money),
        note: item.note,
      }));
    };
    if (is.existy(dataSource) && is.not.empty(dataSource)) {
      form.setFieldsValue({
        provider: transferFormBlock(dataSource.dispatch_expense_list),
        receiver: transferFormBlock(dataSource.dispatch_income_list),
        files: PageUpload.getInitialValue(dataSource, 'asset_infos'),

      });
    }
  }, [dataSource, form]);

  // 基本信息
  const renderBaseInfo = () => {
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const formItems = [
      <Form.Item label="申请人" {...layout}>
        {dot.get(dataSource, 'creator_info.name', '--')}
      </Form.Item>,
      <Form.Item label="部门" {...layout}>
        {dot.get(dataSource, 'creator_department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="岗位" {...layout}>
        {dot.get(dataSource, 'creator_job_info.name', '--')}
      </Form.Item>,
      <Form.Item label="职级" {...layout}>
        {dot.get(dataSource, 'creator_job_info.rank', '--')}
      </Form.Item>,
    ];

    return (
      <CoreContent title="基本信息">
        <CoreForm items={formItems} cols={4} />
      </CoreContent>
    );
  };

  const renderFiles = () => (
    <Form.Item name="files">
      <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
    </Form.Item>
  );

  const renderProvider = () => {
    return (
      <CoreContent title="调出方">
        {renderFormList('provider')}
      </CoreContent>
    );
  };

  const renderReceiver = () => {
    return (
      <CoreContent title="调入方">
        {renderFormList('receiver')}
      </CoreContent>
    );
  };

  const onChangeCompany = (listName, listFieldName) => {
    // 清空账户
    form.setFieldsValue(updateHelper(
      form.getFieldsValue(),
      {
        [listName]: {
          [listFieldName]: {
            account: {
              $set: undefined,
            },
          },
        },
      },
    ));
  };

  // 已选过的账号，不允许选择
  const getDisabledAccounts = (getFieldValue) => {
    return (getFieldValue('provider') || []).concat(getFieldValue('receiver') || []).map(({ account }) => account);
  };

  const renderFormList = listName => (
    <Form.List name={listName}>
      {(fields, { add, remove }) => {
        const otherListName = listName === 'provider' ? 'receiver' : 'provider';
        return (
          <React.Fragment>
            <Row gutter={[12, 12]}>
              {fields.map((field, index) => (
                <Col key={field.name} span={8}>
                  <CoreForm
                    className={styles['form-list-item']}
                    items={[
                      <Form.Item
                        rules={[{ required: true, message: '请选择公司' }]}
                        label="公司"
                        name={[field.name, 'company']}
                        fieldKey={[field.fieldKey, 'company']}
                      >
                        <PageCompanySelect placeholder="请选择" allowClear onChange={() => onChangeCompany(listName, field.name)} />
                      </Form.Item>,
                      <Form.Item
                        key="account"
                        noStyle
                        shouldUpdate={
                        (prevValues, curValues) =>
                          dot.get(prevValues, `${listName}.${field.name}.company`) !== dot.get(curValues, `${listName}.${field.name}.company`)
                        }
                      >
                        {
                          ({ getFieldValue }) => {
                            return (
                              <Form.Item
                                rules={[{ required: true, message: '请选择账号' }]}
                                label="账号"
                                name={[field.name, 'account']}
                                fieldKey={[field.fieldKey, 'account']}
                              >
                                <PageAccountSelect
                                  firmId={getFieldValue([listName, field.name, 'company'])}
                                  disabledList={getDisabledAccounts(getFieldValue)}
                                  showAccountInfo
                                  allowClear
                                />
                              </Form.Item>
                            );
                          }
                        }
                      </Form.Item>,
                      <Form.Item
                        rules={[{ required: true, message: '请输入金额' }]}
                        label="金额(元)"
                        name={[field.name, 'amount']}
                        fieldKey={[field.fieldKey, 'amount']}
                      >
                        <InputNumber
                          className={styles['amount-input']}
                          min={0}
                          precision={2}
                          max={Unit.maxMoney}
                          formatter={Unit.maxMoneyLimitDecimalsFormatter}
                          parser={Unit.limitDecimalsParser}
                        />
                      </Form.Item>,
                      <Form.Item
                        label="调拨事由"
                        rules={[{ required: true, message: '请选择调拨事由' }]}
                        name={[field.name, 'reason']}
                        fieldKey={[field.fieldKey, 'reason']}
                      >
                        <PageFundTrasferCauseSelect placeholder="请选择" />
                      </Form.Item>,
                      <Form.Item
                        noStyle
                        key="otherReason"
                        shouldUpdate={(prevValues, curValues) =>
                          dot.get(prevValues, `${listName}.${field.name}.reason`) !== dot.get(curValues, `${listName}.${field.name}.reason`)
                      }
                      >
                        {
                          ({ getFieldValue }) => (
                            getFieldValue([listName, field.name, 'reason']) === FundTransferOtherReasonEnum ?
                              <Form.Item
                                label="其他事由"
                                rules={[{ required: true, message: '请填写调拨事由' }]}
                                name={[field.name, 'otherReason']}
                                fieldKey={[field.fieldKey, 'reason']}
                              >
                                <Input />
                              </Form.Item> :
                              null
                          )
                        }
                      </Form.Item>,
                      <Form.Item
                        label="备注"
                        name={[field.name, 'note']}
                        fieldKey={[field.fieldKey, 'note']}
                      >
                        <Input.TextArea />
                      </Form.Item>,
                    ]}
                    cols={1}
                  />
                  {
                    index > 0 ?
                      <Button
                        className={styles['remove-btn']}
                        type="dashed"
                        onClick={() => remove(field.name)}
                      >
                      删除
                    </Button> :
                    null
                  }
                </Col>
            ))}
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) => prevValues[otherListName].length !== curValues[otherListName].length}
            >
              {() => {
                let showAddBtn = false;
                if (fields.length < MAX_ACCOUNT_COUNT &&
                  (!form.getFieldValue(otherListName) || form.getFieldValue(otherListName).length < 2)) {
                  showAddBtn = true;
                }
                return showAddBtn ?
                  <Button onClick={add}>{ listName === 'provider' ? '添加调出方' : '添加调入方' }</Button> :
                  null;
              }}
            </Form.Item>
          </React.Fragment>
        );
      }}
    </Form.List>
  );

  const onUpdate = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    form.validateFields().then(async (values) => {
      onLockHook();
      try {
        const ok = await update({ ...values, id });
        if (ok) {
          onDoneHook();
        } else {
          onUnlockHook();
        }
      } catch (e) {
        onUnlockHook();
      }
    });
  };

  const initialValues = { provider: [{}], receiver: [{}] };
  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <div className="fund-transfer-container">
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          isDetail
          flowId={query.flow_id}
          accountId={dot.get(dataSource, 'creator_info._id', undefined)}
          departmentId={dot.get(dataSource, 'creator_department_info._id', undefined)}
        />
      </CoreContent>

      {/* 基本信息 */}
      {renderBaseInfo()}

      <Form
        form={form}
        size="small"
        {...FormLayout}
        initialValues={initialValues}
      >
        {renderProvider()}
        {renderReceiver()}
        {renderFiles()}
      </Form>
      <PageFormButtons showUpdate query={query} onUpdate={onUpdate} />
    </div>
  );
}

const mapStateToProps = ({ business: { fundTransferDetail },
  oaCommon: { examineFlowInfo },
}) => {
  return {
    dataSource: fundTransferDetail,
    examineFlowInfo,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchData: id => dispatch({
    type: 'business/fetchFundTransferDetail',
    payload: { id },
  }),
  clearData: () => dispatch({
    type: 'business/reduceFundTransferDetail',
    payload: {},
  }),
  update: payload => dispatch({
    type: 'business/updateFundTransfer',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FundTransferCreate);
