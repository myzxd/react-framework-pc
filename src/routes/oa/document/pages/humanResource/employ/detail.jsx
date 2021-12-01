/**
 * 人事类 - 录用申请 - 详情
 **/
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { Form } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../components/index';
import { OAentrySource } from '../../../../../../application/define';

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const textAreaLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 12,
  },
};

const EmployDetail = ({
  query,
  employDetail,
  dispatch,
  oaDetail = {},
}) => {
  useEffect(() => {
    if (oaDetail._id) {
      // 获取录用申请详情
      dispatch({
        type: 'humanResource/getEmployDetail',
        payload: { isPluginOrder: true, oaDetail },
      });
    } else {
      // 获取录用申请详情
      dispatch({
        type: 'humanResource/getEmployDetail',
        payload: { id: query.id },
      });
    }
  }, []);

  const {
    department_info,                                      // 部门信息
    job_info,                                             // 岗位信息
    entry_date: entryDate,                                // 入职日期
    entry_source: entrySource,                            // 聘用方式
    expect_graduate_date: expectGraduateDate = undefined, // 毕业时间
  } = employDetail;

  const renderInfo = () => {
    const formItems = [
      {
        item: [
          <Form.Item
            {...layout}
            key="name"
            label="入职者姓名"
          >
            {dot.get(employDetail, 'name', '--')}
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            {...layout}
            key="department"
            label="录用部门"
          >
            {dot.get(department_info, 'name', '--')}
          </Form.Item>,
          <Form.Item
            {...layout}
            key="podepartmentJobRelationId"
            label="岗位"
          >
            {dot.get(job_info, 'name', '--')}
          </Form.Item>,
          <Form.Item
            {...layout}
            key="level"
            label="职级"
          >
            {dot.get(job_info, 'rank', '--')}
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            {...layout}
            key="boss"
            label="直接上级"
          >
            {dot.get(employDetail, 'directly_job_info.name', '--')}
          </Form.Item>,
          <Form.Item
            {...layout}
            key="subordinate"
            label="管理下属"
          >
            {dot.get(employDetail, 'manage_subordinate', '--') || '--'}
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            {...layout}
            key="salary"
            label="薪资"
          >
            以offer为准
          </Form.Item>,
          <Form.Item
            {...layout}
            key="trialSalary"
            label="试用期薪资"
          >
            以offer为准
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            {...layout}
            key="trafficAllowance"
            label="交通补助"
          >
            以offer为准
          </Form.Item>,
          <Form.Item
            {...layout}
            key="newsletterAllowance"
            label="通讯补助"
          >
            以offer为准
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            {...layout}
            key="date"
            label="入职日期"
          >
            {entryDate ? moment(`${entryDate}`).format('YYYYMMDD') : '--'}
          </Form.Item>,
          <Form.Item
            {...layout}
            key="trialDate"
            label="试用期"
          >
            {`${dot.get(employDetail, 'probation_period', '--')} 个月`}
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            {...layout}
            key="employType"
            label="聘用方式"
          >
            {entrySource ? OAentrySource.description(entrySource) : '--'}
          </Form.Item>,
          <Form.Item
            {...layout}
            key="graduationTime"
            label="毕业时间"
            hidden={`${entrySource}` !== `${OAentrySource.intern}`}
          >
            {expectGraduateDate ? moment(`${expectGraduateDate}`).format('YYYYMMDD') : '--'}
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            key="uploadFiled"
            label="上传附件"
          >
            <PageUpload
              displayMode
              value={PageUpload.getInitialValue(employDetail, 'asset_infos')}
            />
          </Form.Item>,
        ],
      },
    ];

    return (
      <React.Fragment>
        {
          formItems.map((cur, idx) => {
            return (
              <CoreForm key={idx} items={cur.item} cols={cur.col || 3} />
            );
          })
        }
      </React.Fragment>
    );
  };

  return (
    <div>
      {/* 渲染基本信息 */}
      <CoreContent title="入职信息">
        {/* 渲染入职信息 */}
        {renderInfo()}
      </CoreContent>
    </div>
  );
};

EmployDetail.propTypes = {
  employDetail: PropTypes.object,  // 录用申请单详情数据
};
EmployDetail.defaultProps = {
  employDetail: {},
};


function mapStateToProps({ humanResource: { employDetail } }) {
  return { employDetail };
}

export default connect(mapStateToProps)(EmployDetail);
