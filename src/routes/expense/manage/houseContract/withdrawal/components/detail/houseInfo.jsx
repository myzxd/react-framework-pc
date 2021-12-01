/**
 * 费用管理 / 房屋管理 / 退租编辑 / 房屋信息
 */
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';

class HouseInfo extends Component {

  static propTypes = {
    detail: PropTypes.object, // 房屋信息
  };

  static defaultProps = {
    detail: {}, // 默认为空
  }

  // 渲染附件文件
  renderFiles = (urls, fileNames) => {
    return (
      <div>
        {
          urls.map((item, index) => {
            return (
              <p>
                <a
                  // className={style['app-comp-expense-house-contract-detail-history-files']}
                  rel="noopener noreferrer"
                  target="_blank"
                  key={index}
                  href={item}
                >
                  {`${fileNames[index]}`}
                </a>
              </p>
            );
          })
        }
      </div>
    );
  }

  // 渲染房屋信息
  renderHouseInfo = () => {
    // 房屋信息
    const { detail = {} } = this.props;

    const {
      houseAddress, // 房屋地址
      migrateFlag, // 合同录入类型
      migrateOaNote, // 原OA审批单号
      landlordName, // 房东姓名
      usage, // 用途
      area, // 房屋面积
      breakDate, // 断租时间
      note, // 备注
      attachmentPrivateUrls, // 附件
      attachments, // 附件
      contractStartDate, // 合同开始时间
      contractEndDate, // 合同结束时间
    } = detail;

    // 房屋租期拼串
    const contractDate = `${moment(`${contractStartDate}`).format('YYYY.MM.DD')}-${moment(`${contractEndDate}`).format('YYYY.MM.DD')}`;

    // 原合同信息
    const migrateFlagForm = [
      {
        label: '合同录入类型',
        form: migrateFlag ? '现存执行合同补入' : '新合同',
      },
      {
        label: '原OA审批单号',
        form: migrateOaNote || '--',
      },
    ];

    // 房屋地址
    const houseAddressForm = [
      {
        label: '房屋地址',
        form: houseAddress || '--',
      },
    ];

    // 房屋信息
    const houseInfoForm = [
      {
        label: '房东姓名',
        form: landlordName || '--',
      },
      {
        label: '用途',
        form: usage || '--',
      },
      {
        label: '房屋面积',
        form: area || '--',
      },
      {
        label: '合同租期',
        form: contractDate,
      },
      {
        label: '断租时间',
        form: breakDate
        ? moment(`${breakDate}`).format('YYYY.MM.DD')
        : '--',
      },
    ];

    // 备注。附件
    const nodeForm = [
      {
        label: '备注',
        form: note || '--',
      },
      {
        label: '附件',
        form: this.renderFiles(attachmentPrivateUrls, attachments),
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
      <CoreContent
        title="房屋信息"
      >
        <DeprecatedCoreForm
          items={migrateFlagForm}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={houseAddressForm}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={houseInfoForm}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={nodeForm}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderHouseInfo();
  }
}

export default HouseInfo;
