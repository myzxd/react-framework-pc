/**
 * 组织架构 - 部门管理 - 岗位编制详情 - 基本信息组件
 */

import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import moment from 'moment';

import { CoreContent, CoreForm } from '../../../../../components/core';
import { dotOptimal } from '../../../../../application/utils';

class Basic extends React.Component {
  componentDidMount() {
    // 岗位id
    const { dispatch, staffId } = this.props;
    staffId && dispatch({ type: 'organizationStaffs/getStaffDetail', payload: { staffId } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'organizationStaffs/resetStaffDetail', payload: {} });
  }

  // 渲染基本信息
  renderBasic = () => {
    // 岗位详情
    const { staffDetail } = this.props;

    const {
      job_info: {
        name: jobName = undefined, // 岗位名称
        rank = undefined, // 岗位职级
      } = {}, // 岗位信息
      department_info: {
        name: departmentName = undefined, // 部门名称
      } = {},
      description, // 岗位描述
    } = staffDetail;

    const formItems = [
      <Form.Item
        label="岗位名称"
      >
        {jobName || '--'}
      </Form.Item>,
      <Form.Item
        label="部门"
      >
        {departmentName || '--'}
      </Form.Item>,
      <Form.Item
        label="岗位职级"
      >
        {rank || '--'}
      </Form.Item>,
      <Form.Item
        label="占编人数"
      >
        {dotOptimal(staffDetail, 'organization_num', '--')}
      </Form.Item>,
      <Form.Item
        label="编制数"
      >
        {dotOptimal(staffDetail, 'organization_count', '--')}
      </Form.Item>,
      <Form.Item
        label="创建者"
      >
        {dotOptimal(staffDetail, 'creator_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="创建时间"
      >
        {
          staffDetail.created_at ? moment(staffDetail.created_at).format('YYYY-MM-DD') : '--'
        }
      </Form.Item>,
      <Form.Item
        label="生效日期"
      >
        {
        staffDetail.take_effect_date ? moment(String(staffDetail.take_effect_date)).format('YYYY-MM-DD') : '--'
        }
      </Form.Item>,
      {
        key: 'description',
        span: 24,
        render: (
          <Form.Item
            label="岗位描述"
          >
            {description || '--'}
          </Form.Item>
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <CoreContent title="基本信息" className="affairs-flow-basic">
        <Form>
          <CoreForm items={formItems} cols={4} layout={layout} />
        </Form>
      </CoreContent>
    );
  }

  render() {
    return this.renderBasic();
  }
}

Basic.propTypes = {
  staffId: PropTypes.string,
  staffDetail: PropTypes.object,
  dispatch: PropTypes.func,
};

Basic.defaultProps = {
  staffId: '',
  staffDetail: {},
  dispatch: () => {},
};

function mapStateToProps({
  organizationStaffs: {
    staffDetail, // 部门详情
  },
}) {
  return { staffDetail };
}

export default connect(mapStateToProps)(Basic);
