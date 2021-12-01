/**
 * 人事类 - 转正申请 - 详情
 **/
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../components/index';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const textAreaLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 10,
  },
};

const OfficialDetail = ({
  query,
  officialDetail,
  dispatch,
  oaDetail = {},
}) => {
  useEffect(() => {
    if (oaDetail._id) {
      // 获取增编申请详情
      dispatch({
        type: 'humanResource/getOfficialDetail',
        payload: { isPluginOrder: true, oaDetail },
      });
    } else {
      // 获取转正申请详情
      dispatch({
        type: 'humanResource/getOfficialDetail',
        payload: { id: query.id },
      });
    }
  }, []);

  const {
    order_employee_info,                   // 转正人员信息
    department_info,                       // 部门信息
    job_info,                              // 岗位信息
    entry_date: entryDate,                 // 入职日期
    apply_regular_date: applyRegularDate,  // 申请转正日期
  } = officialDetail;

  const renderInfo = () => {
    const formItem = [
      {
        item: [
          <Form.Item
            {...layout}
            key="officialName"
            label="转正人员"
          >
            {dot.get(order_employee_info, 'name', '--')}
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            {...layout}
            key="department"
            label="部门"
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
        ],
      },
      {
        item: [
          <Form.Item
            {...layout}
            key="startDate"
            label="入职日期"
          >
            {entryDate ? moment(`${entryDate}`).format('YYYYMMDD') : '--'}
          </Form.Item>,
          <Form.Item
            {...layout}
            key="officialDate"
            label="申请转正日期"
          >
            {applyRegularDate ? moment(`${applyRegularDate}`).format('YYYYMMDD') : '--'}
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            key="work"
            label="试用期主要工作内容"
          >
            <span className="noteWrap">{dot.get(officialDetail, 'probation_work_content', '--') || '--'}</span>
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            key="achievement"
            label="试用期主要工作成绩"
          >
            <span className="noteWrap">{dot.get(officialDetail, 'probation_work_grade', '--') || '--'}</span>
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            key="fault"
            label="试用期存在的问题"
          >
            <span className="noteWrap">{dot.get(officialDetail, 'probation_work_problem', '--') || '--'}</span>
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            key="opinion"
            label="改进设想"
          >
            <span className="noteWrap">{dot.get(officialDetail, 'improve_vision', '--') || '--'}</span>
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
              value={PageUpload.getInitialValue(officialDetail, 'asset_infos')}
            />
          </Form.Item>,
        ],
      },
    ];

    return (
      <React.Fragment>
        {
          formItem.map((cur) => {
            return (
              <CoreForm items={cur.item} cols={cur.col || 3} />
            );
          })
        }
      </React.Fragment>
    );
  };

  return (
    <div>
      <CoreContent title="转正信息">
        {/* 渲染转正信息 */}
        {renderInfo()}
      </CoreContent>
    </div>
  );
};

OfficialDetail.propTypes = {
  officialDetail: PropTypes.object,  // 转正申请单详情数据
};
OfficialDetail.defaultProps = {
  officialDetail: {},
};

function mapStateToProps({ humanResource: { officialDetail } }) {
  return { officialDetail };
}

export default connect(mapStateToProps)(OfficialDetail);
