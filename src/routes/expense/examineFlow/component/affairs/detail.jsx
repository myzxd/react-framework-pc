/**
 * 事务性审批流详情页
 */
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import {
  Form,
  Button,
} from 'antd';
import { connect } from 'dva';
import is from 'is_js';
import {
  AffairsFlowMergeRule,
  AffairsFlowHighestPostType,
  ExpenseDepartmentSubtype,
} from '../../../../../application/define';
import { CommonStampType } from '../../../../../components/common';
import { CoreForm, CoreContent } from '../../../../../components/core';
import TypeForm from './type';
import NodeTimeLine from './nodeTimeLine';
import { PagesHelper } from '../../../../oa/document/define';

// form layout
const formLayout = { labelCol: { span: 3 }, wrapperCol: { span: 14 } };

const AffairsDetail = ({
  examineDetail = {}, // 审批流详情
  enumeratedValue = [], // 枚举值
  contractTypeData = {}, // 合同类型
  dispatch,
}) => {
  const {
    affairs = [], // 事务性审批流类型枚举值
  } = enumeratedValue;

  const { nodeList = [] } = examineDetail;

  useEffect(() => {
    dispatch({ type: 'business/fetchContractType', payload: {} });
  }, [dispatch]);

  const data = contractTypeData.pact_types_has_sub_types || {};
  // 基本字段
  const renderBaic = () => {
    const {
      name, // 名称
      applyRanks = [], // 职级
      applicationRule, // 合并审批规则
      note, // 描述
      applyApplicationTypes = [], // 适用类型
      finalType, // 最高审批岗位类型
      finalApprovalJobTags = [], // 最高审批岗位标签列表
      finalApprovalJobList = [], // 最高审批岗位岗位列表
      applyDepartmentList = [], // 适用部门（本部门）
      applyDepartmentSubList = [], // 适用部门（本加子部门）
      viewDepartmentList = [], // 可见范围（本部门）
      viewDepartmentSubList = [], // 可见范围（本加子部门）
      viewDepartmentJobList = [], // 可见范围（岗位关系id）
      stampTypes = [],   // 会审类型
      sealTypes = [], // 印章类型
      pactBorrowTypes = [], // 合同借阅类型
      displayTypes = [], // 证照借用
      pactApplyTypes = [], // 合同类型
      pactSubTypes = [], // 合同子类型
    } = examineDetail;

    const contractTypeDataArray = [];
    const contractChildTypeDataArray = [];
    pactApplyTypes.map((item) => {
      const parentData = data[item] || {};
      contractTypeDataArray.push(parentData);
      const childData = parentData.sub_types || {};
      Object.keys(childData).map(() => {
        pactSubTypes.map((i) => {
          const childName = childData[i];
          if (is.existy(childName) && is.not.empty(childName)) {
            contractChildTypeDataArray.includes(childName) ? null : contractChildTypeDataArray.push(childName);
          }
        });
      });
    });
    // 适用类型
    const applyType = (Array.isArray(applyApplicationTypes) && applyApplicationTypes.length > 0)
      ? affairs.find(en => en.value === applyApplicationTypes[0]) || {}
      : {};

    // 最高审批岗位
    let highestPost = '--';
    if (Array.isArray(finalApprovalJobList) && finalApprovalJobList.length > 0) {
      highestPost = (
        <div>
          {AffairsFlowHighestPostType.description(finalType)}({finalApprovalJobList.map(i => i.name).join('、')})
        </div>
      );
    }

    if (Array.isArray(finalApprovalJobTags) && finalApprovalJobTags.length > 0) {
      highestPost = (
        <div>
          {AffairsFlowHighestPostType.description(finalType)}({finalApprovalJobTags.join('、')})
        </div>
      );
    }

    // 适用部门
    let suitableDep = [];
    if (Array.isArray(applyDepartmentList) && applyDepartmentList.length > 0) {
      suitableDep = applyDepartmentList;
    }

    if (Array.isArray(applyDepartmentSubList) && applyDepartmentSubList.length > 0) {
      suitableDep = [...suitableDep, ...applyDepartmentSubList];
    }

    // 可见范围
    let viewRange = [];
    if (Array.isArray(viewDepartmentList) && viewDepartmentList.length > 0) {
      viewRange = viewDepartmentList.filter(i => i._id);
    }

    if (Array.isArray(viewDepartmentSubList) && viewDepartmentSubList.length > 0) {
      viewRange = [...viewRange, ...(viewDepartmentSubList.filter(i => i._id))];
    }

    if (Array.isArray(viewDepartmentJobList) && viewDepartmentJobList.length > 0) {
      viewRange = [...viewRange, ...(viewDepartmentJobList.filter(i => i._id))];
    }

    const formItems = [
      <Form.Item
        label="审批流名称"
        {...formLayout}
      >
        {name || '--'}
      </Form.Item>,
      <Form.Item
        label="审批流类型"
        {...formLayout}
      >
        <span>事务性</span>
      </Form.Item>,
      <Form.Item
        label="适用类型"
        {...formLayout}
      >
        {applyType.name || '--'}
      </Form.Item>,
      {
        // 判断是否是 部门/编制调整
        render: (
            applyApplicationTypes[0] === PagesHelper.getDepartmentPostKey() ? (<Form.Item
              label="调整子类型"
              {...formLayout}
            >
              {dot.get(examineDetail, 'organization_sub_types', []).map((v) => {
                return (ExpenseDepartmentSubtype.description(v));
              }).join(', ')}
            </Form.Item>) : (<Form.Item
              label="岗位职级"
              {...formLayout}
            >
              {
              (Array.isArray(applyRanks) && applyRanks.length > 0) ? applyRanks.join('、') : '--'
            }
            </Form.Item>)
        ),
      },
      <Form.Item
        label="合并审批"
        {...formLayout}
      >
        {
          applicationRule ?
            AffairsFlowMergeRule.description(applicationRule)
          : '--'
        }
      </Form.Item>,
      <Form.Item
        label="适用部门"
        {...formLayout}
      >
        {
          suitableDep.length > 0 ?
            suitableDep.map(i => i.name).join('、')
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="可见范围"
        {...formLayout}
      >
        {
          viewRange.length > 0 ?
            viewRange.map((i) => {
              if (i.name) return i.name;
              if (i.job_info && Object.keys(i.job_info).length > 0) {
                return i.job_info.name;
              }
            }).join('、')
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="最高审批岗位"
        {...formLayout}
      >
        {highestPost}
      </Form.Item>,
      <Form.Item
        label="描述"
        {...formLayout}
      >
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{note || '--'}</div>
      </Form.Item>,
    ];

    // 用章申请 || 借章申请
    if (applyApplicationTypes[0] === 303 || applyApplicationTypes[0] === 309) {
      formItems.splice(4, 0, (
        <Form.Item
          label="印章类型"
          {...formLayout}
        >
          <TypeForm type="flowSealType" value={sealTypes} isDetail />
        </Form.Item>
      ));
    }

    // 证照借用
    if (applyApplicationTypes[0] === 306) {
      formItems.splice(4, 0, (
        <Form.Item
          label="类型"
          {...formLayout}
        >
          <TypeForm type="license" value={displayTypes} isDetail />
        </Form.Item>
      ));
    }

    // 合同借阅
    if (applyApplicationTypes[0] === 406) {
      formItems.splice(4, 0, (
        <Form.Item
          label="类型"
          {...formLayout}
        >
          <TypeForm type="contract" value={pactBorrowTypes} isDetail />
        </Form.Item>
      ));
    }

    // 合同会审类型
    if (applyApplicationTypes[0] === 405) {
      formItems.splice(4, 0, (
        <React.Fragment>
          <Form.Item
            label="会审类型"
            {...formLayout}
          >
            <CommonStampType
              isDetail
              showValue={stampTypes || stampTypes[0]}
            />
          </Form.Item>
          <Form.Item
            label="合同类型"
            {...formLayout}
          >
            {
           is.empty(contractTypeDataArray) ? '--' : contractTypeDataArray.map((i, k) => {
             if (contractTypeDataArray.length === k + 1) {
               return i.name;
             }
             return `${i.name},`;
           },

           )
         }
          </Form.Item>
          <Form.Item
            label="合同子类型"
            {...formLayout}
          >
            {
               is.empty(contractChildTypeDataArray) ? '--' : contractChildTypeDataArray.map((i, k) => {
                 if (contractChildTypeDataArray.length === k + 1) {
                   return i;
                 }
                 return `${i},`;
               })
            }
          </Form.Item>

        </React.Fragment>
      ));
    }

    return (
      <CoreContent title="审批流详情设置">
        <Form className="affairs-flow-detail-basic">
          <CoreForm items={formItems} cols={1} />
        </Form>
      </CoreContent>
    );
  };

  return (
    <React.Fragment>
      {renderBaic()}

      {/* 节点时间轴 */}
      <NodeTimeLine applyApplicationTypes={dot.get(examineDetail, 'applyApplicationTypes.0')} nodeList={nodeList} />

      <div style={{ textAlign: 'center' }}>
        <Button
          type="default"
          onClick={() => { window.location.href = '/#/Expense/ExamineFlow/Process?isSetStorageSearchValue=true'; }}
        >返回</Button>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  business: { contractTypeData },
}) => {
  return { contractTypeData };
};
export default connect(mapStateToProps)(AffairsDetail);
