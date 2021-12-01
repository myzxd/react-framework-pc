/**
 * 社保配置 - 社保卡片组件
 */
import { connect } from 'dva';
import { Row, Col, InputNumber } from 'antd';
import React, { useEffect } from 'react';

import { Unit } from '../../../../application/define';

import Style from '../style.less';
// 配置数据
const dataSource = [
  {
    title: '养老',
    key: 'old_age_insurance',
    children: ['pensionBaseDown', 'pensionBaseUp', 'pensionCompany', 'pensionPerson'],
  },
  {
    title: '医疗',
    key: 'medical_insurance',
    children: ['medicineBaseDown', 'medicineBaseUp', 'medicineCompany', 'medicinePerson'],
  },
  {
    title: '失业',
    key: 'unemployment_insurance',
    children: ['loseBaseDown', 'loseBaseUp', 'loseCompany', 'losePerson'],
  },
  {
    title: '生育',
    key: 'birth_insurance',
    children: ['birthBaseDown', 'birthBaseUp', 'birthCompany', 'birthPerson'],
  },
  {
    title: '工伤',
    key: 'occupational_insurance',
    children: ['injuryBaseDown', 'injuryBaseUp', 'injuryCompany', 'injuryPerson'],
  },
  {
    title: '公积金',
    key: 'provident_fund',
    children: ['fundBaseDown', 'fundBaseUp', 'fundCompany', 'fundPerson'],
  },
];

const SocietyCard = ({
  form,
  Item,
  isDetail = false,
  societyPlanDetail,
  selectPlanName = undefined,
  societyPlanList = {},
}) => {
  useEffect(() => {
    if (selectPlanName) {
      const { data = [] } = societyPlanList;
      // 单位转换
      const transformUnit = (num) => {
        return (num || num === 0) ? Unit.exchangePriceToYuan(num) : undefined;
      };
      data.map((item) => {
        if (item.name === selectPlanName) {
          const {
            birth_insurance: birthInsurance = {},
            old_age_insurance: oldAgeInsurance = {},
            medical_insurance: medicalInsurance = {},
            unemployment_insurance: unemploymentInsurance = {},
            occupational_insurance: occupationalInsurance = {},
            provident_fund: providentFund = {},
          } = item;
          form.setFieldsValue({
            pensionBaseDown: transformUnit(oldAgeInsurance.lower_limit),         // 养老
            pensionBaseUp: transformUnit(oldAgeInsurance.upper_limit),
            pensionCompany: oldAgeInsurance.company_percent,
            pensionPerson: oldAgeInsurance.person_percent,
            medicineBaseDown: transformUnit(medicalInsurance.lower_limit),         // 医疗
            medicineBaseUp: transformUnit(medicalInsurance.upper_limit),
            medicineCompany: medicalInsurance.company_percent,
            medicinePerson: medicalInsurance.person_percent,
            loseBaseDown: transformUnit(unemploymentInsurance.lower_limit),         // 失业
            loseBaseUp: transformUnit(unemploymentInsurance.upper_limit),
            loseCompany: unemploymentInsurance.company_percent,
            losePerson: unemploymentInsurance.person_percent,
            birthBaseDown: transformUnit(birthInsurance.lower_limit),         // 生育
            birthBaseUp: transformUnit(birthInsurance.upper_limit),
            birthCompany: birthInsurance.company_percent,
            birthPerson: birthInsurance.person_percent,
            injuryBaseDown: transformUnit(occupationalInsurance.lower_limit),         // 工伤
            injuryBaseUp: transformUnit(occupationalInsurance.upper_limit),
            injuryCompany: occupationalInsurance.company_percent,
            injuryPerson: occupationalInsurance.person_percent,
            fundBaseDown: transformUnit(providentFund.lower_limit),         // 公积金
            fundBaseUp: transformUnit(providentFund.upper_limit),
            fundCompany: providentFund.company_percent,
            fundPerson: providentFund.person_percent,
          });
        }
      });
    }
  }, [selectPlanName]);
  // 渲染标题
  const renderTitle = () => {
    return (
      <React.Fragment>
        <Row
          justify="center"
          className={Style['app-comp-employee-society-title']}
        >
          <Col span="4" className={Style['app-comp-employee-society-tittle']}>险种</Col>
          <Col span="5" className={Style['app-comp-employee-society-tittle']}>基数下限</Col>
          <Col span="5" className={Style['app-comp-employee-society-tittle']}>基数上限</Col>
          <Col span="5" className={Style['app-comp-employee-society-tittle']}>公司比例</Col>
          <Col span="5" className={Style['app-comp-employee-society-tittle']}>个人比例</Col>
        </Row>
      </React.Fragment>
    );
  };
  // 格式化两位小数
  const formatLimit = (val) => {
    const res = String(val).split('.');
    if (res.length === 1) {
      return `${val}%`;
    }
    const str = res[1].slice(0, 2);
    return `${res[0]}.${str}%`;
  };
  // 上下限的数字格式化
  const formatUpDown = (val) => {
    const res = String(val).split('.');
    if (res.length === 1) {
      return `${val}`;
    }
    const str = res[1].slice(0, 2);
    return `${res[0]}.${str}`;
  };
  // 渲染内容
  const renderContent = () => {
    const result = dataSource.map((i, key) => {
      return (<Row
        justify="center"
        key={key}
        className={Style['app-comp-employee-society-justify']}
      >
        <Col span="4">{i.title}</Col>
        <Col span="5">
          <Item
            name={i.children[0]}
            rules={[
              { validator: (rule, val) => {
                const upVal = form.getFieldValue(i.children[1]);
                if (!val && val !== 0) {
                  return Promise.resolve();
                }
                if (upVal && upVal < val) {
                  return Promise.reject(`${i.title}基数下限不能大于上限`);
                }
                return Promise.resolve();
              } },
            ]}
          >
            <InputNumber
              min={0}
              placeholder="请输入"
              formatter={formatUpDown}
              onChange={(val) => {
                const upVal = form.getFieldValue(i.children[1]);
                if (upVal >= val) {
                  form.validateFields([i.children[1]]);
                }
              }}
              className={Style['app-comp-employee-society-input']}
            />
          </Item>
        </Col>
        <Col span="5">
          <Item
            name={i.children[1]}
            rules={[
              { validator: (rule, val) => {
                const downVal = form.getFieldValue(i.children[0]);
                if (!val && val !== 0) {
                  return Promise.resolve();
                }
                if (downVal && downVal > val) {
                  return Promise.reject(`${i.title}基数上限不能小于下限`);
                }
                return Promise.resolve();
              } },
            ]}
          >
            <InputNumber
              min={0}
              placeholder="请输入"
              formatter={formatUpDown}
              onChange={(val) => {
                const downVal = form.getFieldValue(i.children[0]);
                if (downVal <= val) {
                  form.validateFields([i.children[0]]);
                }
              }}
              className={Style['app-comp-employee-society-input']}
            />
          </Item>
        </Col>
        <Col span="5">
          <Item
            name={i.children[2]}
            rules={[
              { validator: (rule, val) => {
                const personVal = form.getFieldValue(i.children[3]);
                if (personVal && (personVal + val) > 100) {
                  return Promise.reject(`${i.title}公司与个人比例之和不能大于100%`);
                }
                return Promise.resolve();
              } },
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="请输入"
              formatter={formatLimit}
              parser={value => value.replace('%', '')}
              onChange={(val) => {
                const pVal = form.getFieldValue(i.children[3]);
                const newVal = Math.floor(Number(val) * 100) / 100;
                if (pVal + newVal <= 100) {
                  form.validateFields([i.children[3]]);
                }
              }}
              className={Style['app-comp-employee-society-input']}
            />
          </Item>
        </Col>
        <Col span="5">
          <Item
            name={i.children[3]}
            rules={[
              { validator: (rule, val) => {
                const compVal = form.getFieldValue(i.children[2]);
                if (compVal && (compVal + val) > 100) {
                  return Promise.reject(`${i.title}公司与个人比例之和不能大于100%`);
                }
                return Promise.resolve();
              } },
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              formatter={formatLimit}
              parser={value => value.replace('%', '')}
              onChange={(val) => {
                const cVal = form.getFieldValue(i.children[2]);
                const newVal = Math.floor(Number(val) * 100) / 100;
                if (cVal + newVal <= 100) {
                  form.validateFields([i.children[2]]);
                }
              }}
              placeholder="请输入"
              className={Style['app-comp-employee-society-input']}
            />
          </Item>
        </Col>
      </Row>);
    });
    return result;
  };
  const renderDetailContent = () => {
    // 单位转换
    const transformUnit = (data) => {
      return (data || data === 0) ? Unit.exchangePriceToYuan(data) : '--';
    };
    const result = dataSource.map((i, key) => {
      return (<Row
        justify="center"
        key={key}
        className={Style['app-comp-employee-society-justify']}
      >
        <Col span="4">{i.title}</Col>
        <Col span="5" className={Style['app-comp-employee-society-bottom']}>
          { societyPlanDetail[i.key] ? transformUnit(societyPlanDetail[i.key].lower_limit) : '--' }
        </Col>
        <Col span="5" className={Style['app-comp-employee-society-bottom']}>
          { societyPlanDetail[i.key] ? transformUnit(societyPlanDetail[i.key].upper_limit) : '--' }
        </Col>
        <Col span="5" className={Style['app-comp-employee-society-bottom']}>
          { societyPlanDetail[i.key] ? societyPlanDetail[i.key].company_percent : '--' }&nbsp;%
        </Col>
        <Col span="5" className={Style['app-comp-employee-society-bottom']}>
          { societyPlanDetail[i.key] ? societyPlanDetail[i.key].person_percent : '--' }&nbsp;%
        </Col>
      </Row>);
    });
    return result;
  };
  // 渲染
  return (
    <React.Fragment>
      {/* 渲染标题 */}
      { renderTitle() }
      {/* 渲染内容 */}
      { isDetail ? renderDetailContent() : renderContent() }
    </React.Fragment>
  );
};

const mapStateToProps = ({ society: { societyPlanDetail, societyPlanList } }) => ({ societyPlanDetail, societyPlanList });

export default connect(mapStateToProps)(SocietyCard);
