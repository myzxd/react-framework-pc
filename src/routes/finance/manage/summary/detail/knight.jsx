/**
 * 结算汇总,城市结算明细,骑士结算明细 - Finance/Manage/Summary/Detail/Knight
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Row, Col, Empty } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';

import WorkInfo from './components/workInfo.jsx';
import ReceiptInfo from './components/receiptInfo.jsx';
import SalaryInfo from './components/salaryInfo.jsx'; // 饿了么
import MeituanSalaryInfo from './components/meituanSalaryInfo'; // 美团
import styles from './style/index.less';

class Detail extends Component {
  static propTypes = {
    salaryDetail: PropTypes.object,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    salaryDetail: {},
    dispatch: () => {},
  }

  constructor(props) {
    super(props);
    const { id } = props.location.query;
    this.state = {
      id, // 骑士id
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.state;
    dispatch({
      type: 'financeSummaryManage/fetchSalaryKnightStatement',
      payload: { id },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeSummaryManage/fetchSalaryKnightStatement',
      payload: {},
    });
  }

  // 渲染信息
  renderInfo = () => {
    const { salaryDetail } = this.props;
    // 数据
    const data = dot.get(salaryDetail, 'sheet_data_info.data', {});
    // 所属平台code
    const platformCode = dot.get(salaryDetail, 'platform_code', 'elem');

    // 如果没有数据，返回
    if (Object.keys(data).length === 0) {
      return <Empty />;
    }

    // 开始、结束时间
    const startDate = dot.get(salaryDetail, 'start_date', '');
    const endDate = dot.get(salaryDetail, 'end_date', '');

    // 月份
    const ext = (
      <div>
        <span>服务费归属日期 : {moment(startDate, 'YYYYMMDD').format('YYYY/MM/DD')}～{moment(endDate, 'YYYYMMDD').format('YYYY/MM/DD')}</span>
      </div>
    );

    return (
      <div>
        <Row className={styles['app-comp-finance-SD-row-conent']}>
          <Col className={styles['app-comp-finance-SD-pl']}>
            { ext }
          </Col>
        </Row>
        {/* 工作信息 */}
        <WorkInfo
          data={data}
          platformCode={platformCode}
        />
        {/* 收款信息 */}
        <ReceiptInfo
          data={data}
          platformCode={platformCode}
        />
        {/* 服务费信息 */}
        {
          platformCode === 'elem'
            ?
              <SalaryInfo
                data={data}
                salaryDetail={salaryDetail}
              />
            :
              <MeituanSalaryInfo
                data={data}
                salaryDetail={salaryDetail}
              />
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderInfo()}
      </div>
    );
  }
}

function mapStateToProps({ financeSummaryManage: { salaryDetail } }) {
  return { salaryDetail };
}

export default connect(mapStateToProps)(Detail);
