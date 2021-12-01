/**
 * 组织架构 - 岗位管理 = 列表组件
 */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Table,
  Button,
  message,
  Tooltip,
} from 'antd';

import { CoreContent } from '../../../components/core';
import CreateModal from './component/modal/create';
import Operate from '../../../application/define/operate';

// import style from './index.less';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: undefined,
      updateData: undefined,
    };
  }

  // 显示弹窗
  onShow = (type, data) => {
    this.setState({ visible: true, type, updateData: data });
  }

  // 隐藏弹窗
  onCancel = () => {
    this.setState({ visible: false, updateData: undefined });
  }

  // 删除岗位
  onDelete = (val, rec) => {
    // 占编人数
    const { organization_count: count } = rec;
    // 岗位下有成员时，不能删除
    if (count > 0) return message.error('请先移除该岗位下的成员，再删除此岗位');

    const { dispatch } = this.props;
    const params = {
      id: val,
      onSuccessCallback: this.onSuccessCallback,
      onFailureCallback: this.onFailureCallback,
    };
    dispatch({ type: 'organizationStaff/deleteStaff', payload: params });
  }

  // 删除成功回调
  onSuccessCallback = (val = {}, reast) => {
    const { onSearch } = this.props;
    message.success('操作成功');
    onSearch && onSearch(val, reast);
  }

  // 删除失败回调
  onFailureCallback = (rec) => {
    rec.zh_message && message.success(rec.zh_message);
  }


  // 渲染列表
  renderContent = () => {
    const { data = {}, onChangePage } = this.props;
    const {
      data: dataSource = [],
      _meta: meta = {},
    } = data;

    const {
      result_count: dataCount = 0,
    } = meta;

    const columns = [
      {
        title: '岗位名称',
        dataIndex: 'name',
      },
      {
        title: '岗位编号',
        dataIndex: 'code',
      },
      {
        title: '岗位职级',
        dataIndex: 'rank',
        render: text => text || '--',
      },
      {
        title: '审批岗位标签',
        dataIndex: 'apply_tags',
        render: (text) => {
          if (Array.isArray(text) && text.length > 3) {
            return (
              <Tooltip title={text.join('；')}>
                <div>{text[0]}；{text[1]}；{text[2]}...</div>
              </Tooltip>
            );
          }

          if (Array.isArray(text) && text.length > 0 && text.length <= 3) {
            return <div>{text.join('；')}</div>;
          }

          return '--';
        },
      },
      {
        title: '占编人数',
        dataIndex: 'organization_count',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        render: (text) => {
          if (text) {
            return moment(String(text)).format('YYYY-MM-DD HH:mm:ss');
          }
          return '--';
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        render: (text) => {
          if (text) {
            return moment(String(text)).format('YYYY-MM-DD HH:mm:ss');
          }
          return '--';
        },
      },
      {
        title: '操作人',
        dataIndex: ['operator_info', 'name'],
        render: text => text || '--',
      },
      {
        title: '操作',
        dataIndex: '_id',
        render: (text, rec) => {
          // 编辑操作
          const updateOperate = Operate.canOperateOrganizationStaffsUpdate() ?
            (<a onClick={() => this.onShow('update', rec)}>编辑</a>) : null;
          // 删除操作
          // const deleteOpera = Operate.canOperateOrganizationStaffsDelete() ?
          // (
          // <Popconfirm
          // title="您是否确认删除该岗位，删除之后部门下的该岗位也会同步删除"
          // onConfirm={() => this.onDelete(text, rec)}
          // okText="确认"
          // cancelText="取消"
          // >
          // <a className={style['app-organization-post-list-operate']}>删除</a>
          // </Popconfirm>
          // ) : null;
          return (
            <div>
              {updateOperate || '--'}
            </div>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      current: this.props.page,
      pageSize: this.props.limit, // 默认数据条数
      onChange: onChangePage, // 切换分页
      total: dataCount, // 数据总条数
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true, // 显示快速跳转
      showSizeChanger: true, // 显示分页
      onShowSizeChange: onChangePage, // 展示每页数据数
    };

    const titleExt = Operate.canOperateOrganizationStaffsCreate() ?
      (
        <Button type="primary" onClick={() => this.onShow('create')}>创建岗位</Button>
      ) : null;


    return (
      <CoreContent title="岗位列表" titleExt={titleExt}>
        <Table
          rowKey={(rec, key) => rec._id || key}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          // scroll={{ y: 400 }}
        />
      </CoreContent>
    );
  }

  // 弹窗
  renderModal = () => {
    const { visible, type, updateData } = this.state;
    const { dispatch, onSearch } = this.props;
    if (!visible) return;

    return (<CreateModal
      visible={visible}
      type={type}
      dispatch={dispatch}
      onCancel={this.onCancel}
      data={updateData}
      onSearch={onSearch}
    />);
  }

  render() {
    return (
      <div>
        {this.renderContent()}
        {this.renderModal()}
      </div>
    );
  }
}

Index.propTypes = {
  data: PropTypes.object,
  onChangePage: PropTypes.func,
  dispatch: PropTypes.func,
  onSearch: PropTypes.func,
};

Index.defaultProps = {
  data: {},
  onChangePage: () => {},
  dispatch: () => {},
  onSearch: () => {},
};


export default Index;
