/**
 * ContractInfo Item
 */
import React, { useMemo } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { utils } from '../../../../../../../application';
import { PageContractSelect } from '../../common/index';
import style from './style.less';

ContractInfoItem.propTypes = {
  itemIdx: PropTypes.number, // item下标
  formValue: PropTypes.array, // 表单值
  formItemValue: PropTypes.string, // 此item项的表单值
  contractSelectInfo: PropTypes.object, // 合同下拉信息
  onChangeValue: PropTypes.func, // 修改表单值
  renderDeleteButton: PropTypes.func, // 渲染删除操作按钮
};

function ContractInfoItem({
  itemIdx,
  formValue,
  formItemValue,
  onChangeValue,
  renderDeleteButton,
  contractSelectInfo,
  mState,
}) {
  const onChangeContractSelect = (val, options) => {
    const { preserverid } = options;
    onChangeValue(itemIdx, val, preserverid);
  };

  // 当前选中的合同信息
  const currentInfo = useMemo(() => {
    // return当前选中的合同信息
    return utils.showPlainText(contractSelectInfo, 'data', []).find(item => item._id === formItemValue) || {};
  }, [formItemValue, contractSelectInfo]);

  const messageStyle = {
    color: ' #ff4d4f',
    fontSize: '12px !important',
    lineHeight: '19px',
  };

  // 渲染错误提示
  const renderErrorMessage = () => {
    // 判断是否存在报错并且value没有有值
    if (mState && !formItemValue) {
      return (
        <div style={messageStyle}>
        请选择合同名称
        </div>
      );
    }
    return null;
  };
  return (
    <Row className={style['contractInfo-formItem-wrap']}>
      <Col span={21}>
        <Row>
          <Col span={3} className={style['contractInfo-label']}>
            <span className={style['contractInfo-require-label']}>合同名称：</span>
          </Col>
          <Col span={8}>
            <PageContractSelect
              isFetchData={utils.showPlainText(contractSelectInfo, 'data', []).length <= 0}
              isClearnModal={false}
              value={formItemValue || undefined}
              onChange={onChangeContractSelect}
              clearnOptionList={formValue.filter(item => item !== formItemValue)}
              placeholder="请选择合同名称"
            />
            {/* 渲染错误提示 */}
            {renderErrorMessage()}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={6} className={style['contractInfo-label']}>
                <span>合同甲方：</span>
              </Col>
              <Col span={16}>
                <span>{utils.showPlainText(currentInfo, 'pact_part_a')}</span>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={6} className={style['contractInfo-label']}>
                <span>合同丙方：</span>
              </Col>
              <Col span={16}>
                <span>{utils.showPlainText(currentInfo, 'pact_part_c')}</span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={6} className={style['contractInfo-label']}>
                <span>合同乙方：</span>
              </Col>
              <Col span={16}>
                <span>{utils.showPlainText(currentInfo, 'pact_part_b')}</span>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={6} className={style['contractInfo-label']}>
                <span>合同丁方：</span>
              </Col>
              <Col span={16}>
                <span>{utils.showPlainText(currentInfo, 'pact_part_d')}</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={3} className={style['contractInfo-delete-wrap']}>
        {renderDeleteButton(itemIdx)}
      </Col>
    </Row>
  );
}

const mapStateToProps = ({ business: { contractSelectInfo } }) => ({ contractSelectInfo });

export default connect(mapStateToProps)(ContractInfoItem);
