/**
 * 租金详情模版
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import React, { Component } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { Unit } from '../../../../../application/define';

import styles from '../../common/styles.less';

class Index extends Component {
  static propTypes = {
    title: PropTypes.string,
    detail: PropTypes.object,
  }

  static defaultProps = {
    title: '',
    detail: {},
  }

  // 转换附件浏览格式
  transFile = (valuesParam) => {
    let values = valuesParam;
    if (values == null) {
      values = [];
    }
    const list = [];
    if (values.forEach) {
      values.forEach((item) => {
        const obj = {};
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            obj.name = key;
            obj.value = item[key];
          }
        }
        list.push(obj);
      });
    }
    return (
      <div>
        {
          list.map((item, index) => {
            return (
              <a
                className={styles['app-comp-expense-manage-template-detail-rent-file']}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                href={item.value}
              >
                {item.name}
              </a>
            );
          })
        }
      </div>
    );
  }

  // 支付信息
  renderPaymentInfo = () => {
    // 房租支付信息
    const formItems = [
      {
        label: '房租收款人',
        form: '123',
      }, {
        label: '收款账号',
        form: '123',
      }, {
        label: '开户支行',
        form: '123',
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="支付信息" className={styles['app-comp-expense-manage-template-detail-rent']}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 租金信息
  renderRentInfo = () => {
    const { detail = {} } = this.props;
    const formItems = [
      {
        label: '月租金',
        form: '10000元',
      },
      {
        label: '租金时间段',
        form: '10000元',
      },
      {
        label: '合计金额',
        form: '10000元',
      },
    ];
    // 科目
    const formItemsSub = [
      {
        label: '科目',
        form: '房屋租金（10201）',
      },
    ];
    // 成本分摊
    const formItemsShare = [
      {
        label: '成本分摊',
        form: '123',
      },
    ];
    // 备注、上传
    const formItemsUp = [
      {
        label: '备注',
        form: '123',
      }, {
        label: '上传附件',
        form: this.transFile(dot.get(detail, 'files_address', [])),
      },
    ];
    // 子项目信息
    const costItems = dot.get(detail, 'cost_belong_items_zh', []) || [];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="租金信息" className={styles['app-comp-expense-manage-template-detail-rent']}>

        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />

        {/* 科目 */}
        <DeprecatedCoreForm items={formItemsSub} cols={3} layout={layout} />

        {/* 成本分摊 */}
        <DeprecatedCoreForm items={formItemsShare} cols={3} layout={layout} />

        {/* 渲染子项目信息 */}
        {
          costItems.map((item, key) => {
            return this.renderCostItems(item, key);
          })
        }

        {/* 备注、上传 */}
        <DeprecatedCoreForm items={formItemsUp} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }} />

        {/* 支付信息 */}
        {this.renderPaymentInfo()}
      </CoreContent>
    );
  }

  // 渲染子项目信息
  renderCostItems = (items, key) => {
    // let prompt = '';
    const formItems = [
      {
        label: '平台',
        form: dot.get(items, 'platform_code', '--'),
      }, {
        label: '供应商',
        form: dot.get(items, 'supplier_id', '--'),
      }, {
        label: '城市',
        form: dot.get(items, 'city_spelling', '--'),
      }, {
        label: '商圈',
        form: dot.get(items, 'biz_id', '--'),
      },
    ];
    if (items.custom_money) {
      formItems.push({
        label: '分摊金额',
        form: Unit.exchangePriceToMathFormat(dot.get(items, 'custom_money', '--')),
      });
    }
    if (dot.get(items, 'city_spelling', '') || dot.get(items, 'biz_id', '')) {
      // prompt = (<div style={{ textAlign: 'center', height: '30px', lineHeight: '30px' }}>
      //     当月已付款费用合计：
      //     </div>);
    }
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <div>
        <DeprecatedCoreForm key={key} items={formItems} cols={6} layout={layout} />
        {/* {prompt} */}
      </div>
    );
  }

  render = () => {
    const { title } = this.props;
    return (
      <div>
        <Form layout="horizontal">
          <CoreContent title={title}>
            {/* 租金信息 */}
            {this.renderRentInfo()}
          </CoreContent>
        </Form>
      </div>
    );
  }
}

export default Index;
