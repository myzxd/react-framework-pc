/**
 * 资产管理 - 商圈管理 - 商圈标签管理 = 列表组件
 */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Table, Button, message, Popconfirm } from 'antd';

import { CoreContent } from '../../../../components/core';
import CreateModal from './component/modal/create';
import Operate from '../../../../application/define/operate';

import style from './index.less';

// 弹窗操作类型
const OperateType = {
  create: 'create',
  update: 'update',
};

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

  // 停用标签
  onDelete = (val) => {
    const { dispatch } = this.props;
    const params = {
      id: val,
      onSuccessCallback: this.onSuccessCallback,
      onFailureCallback: this.onFailureCallback,
    };
    dispatch({ type: 'districtTag/deleteTag', payload: params });
  }

  // 停用成功回调
  onSuccessCallback = () => {
    const { onSearch } = this.props;
    message.success('操作成功');
    onSearch && onSearch();
  }

  // 停用失败回调
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
        title: '标签名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
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
        key: 'updated_at',
        render: (text) => {
          if (text) {
            return moment(String(text)).format('YYYY-MM-DD HH:mm:ss');
          }
          return '--';
        },
      },
      {
        title: '最新操作人',
        dataIndex: ['operator_info', 'name'],
        render: text => text || '--',
      },
      {
        title: '操作',
        dataIndex: '_id',
        key: 'operate',
        render: (text, rec) => {
          // 编辑操作
          const updateOperate = Operate.canOperateAssectsAdministrationTagUpdate() ?
            (<a onClick={() => this.onShow(OperateType.update, rec)}>编辑</a>) : null;
          // 删除操作
          const deactivateOpera = Operate.canOperateAssectsAdministrationTagDelete() ?
            (
              <Popconfirm
                title="停用该标签会同步移除商圈下的该条标签信息，请确认是否停用该标签"
                onConfirm={() => this.onDelete(text)}
                okText="确认"
                cancelText="取消"
              >
                <a className={style['app-system-district-tag-list-operate']}>停用</a>
              </Popconfirm>
            ) : null;
          return (
            <div>
              {updateOperate}
              {deactivateOpera}
              {(!updateOperate && !deactivateOpera) ? '--' : null}
            </div>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      current: this.props.page,
      defaultPageSize: 30, // 默认数据条数
      onChange: onChangePage, // 切换分页
      total: dataCount, // 数据总条数
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true, // 显示快速跳转
      showSizeChanger: true, // 显示分页
      onShowSizeChange: onChangePage, // 展示每页数据数
    };

    const titleExt = Operate.canOperateAssectsAdministrationTagCreate() ?
      (
        <Button type="primary" onClick={() => this.onShow(OperateType.create)}>添加标签</Button>
      ) : null;


    return (
      <CoreContent title="标签列表" titleExt={titleExt}>
        <Table
          rowKey={(rec, key) => rec._id || key}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
        />
      </CoreContent>
    );
  }

  // 弹窗
  renderModal = () => {
    const { visible, type, updateData } = this.state;
    const { dispatch, onSearch } = this.props;
    if (!visible) return;

    return (
      <CreateModal
        visible={visible}
        type={type}
        dispatch={dispatch}
        onCancel={this.onCancel}
        data={updateData}
        onSearch={onSearch}
      />
    );
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
