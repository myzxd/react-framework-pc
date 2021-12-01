/**
 * 房屋管理/房屋详情/房屋信息
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CoreContent,
  DeprecatedCoreForm,
  CoreFinder,
} from '../../../../../../components/core';
import { ExpenseHouseContractHouseSource } from '../../../../../../application/define/index';

const { CoreFinderList } = CoreFinder;

class HouseInfo extends Component {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileType: null, // 文件预览类型
      fileUrl: null, // 文件预览地址
      visible: false, // 是否显示预览弹窗
      fileName: '', // 文件预览名称
    };
  }

  static propTypes = {
    houseContractDetail: PropTypes.object, // 房屋详情数据
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
  }
 // 设置预览参数
  onUploadSuccess = (type, url, name) => {
    this.setState({ fileName: name, fileType: type, fileUrl: url, visible: true });
  }

// 预览
  onChangePreview = (key, url) => {
    if (url && key) {
      let fileType = null;
      const reg = /\.(\w+)$/;
      fileType = key.match(reg)[1];
      this.onUploadSuccess(fileType, url, key);
      return;
    }

    this.props.dispatch({
      type: 'applicationFiles/fetchKeyUrl',
      payload: {
        key,
        onUploadSuccess: (type, adress) => this.onUploadSuccess(type, adress, key),
      },
    });
  };
  // 取消弹窗
  setVisible=() => { this.setState({ visible: false }); }

   // 预览组件
  renderCorePreview = (value, fileNames) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const data = value.map((item, index) => {
        return { key: fileNames[index], url: item };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };

  // 渲染用途
  renderUsage = (value) => {
    if (is.empty(value) || is.not.existy(value) || is.not.array(value)) {
      return '--';
    }
    return value.join(' , ');
  }

  // 渲染房屋基本信息
  renderBaseInfo = () => {
    const { houseContractDetail = {} } = this.props;
    const {
      pcUsage,
      area,
      houseSource,
      breakDate,
      houseAddress: address,
      landlordName,
    } = houseContractDetail;
    // 房屋地址
    const houseAddress = [
      {
        label: '房屋地址',
        form: address || '--',
      },
    ];

    const formItems = [
      {
        label: '房东姓名',
        form: landlordName || '--',
      },
      {
        label: '用途',
        form: this.renderUsage(pcUsage),
      },
      {
        label: '房屋面积',
        form: area || '--',
      },
      {
        label: '房屋来源',
        form: houseSource ? ExpenseHouseContractHouseSource.description(houseSource) : '--',
      },
      {
        label: '断租时间',
        form: breakDate || '--',
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
      <div>
        <DeprecatedCoreForm
          items={houseAddress}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={formItems}
          cols={3}
          layout={layout}
        />
      </div>
    );
  }

  // 渲染其他信息
  renderExtraInfo = () => {
    const { houseContractDetail } = this.props;
    const formItems = [
      {
        label: '备注',
        form: houseContractDetail.note || '--',
      },
      {
        label: '附件',
        form: this.renderCorePreview(dot.get(houseContractDetail, 'attachmentPrivateUrls', []),
        dot.get(houseContractDetail, 'attachments', [])),
      },
    ];
    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  render = () => {
    return (
      <CoreContent title="房屋信息">

        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染其他 */}
        {this.renderExtraInfo()}

      </CoreContent>
    );
  }
}

export default HouseInfo;
