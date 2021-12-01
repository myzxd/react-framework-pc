/**
 * 工作交接审批单
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Select } from 'antd';

function CommonSelectJobHandover({
  dataSouce = [], fetchData, clearData, employeeId, ...restProps
}) {
  useEffect(() => {
    if (employeeId) {
      fetchData(employeeId);
    }
    return () => {
      if (employeeId) {
        clearData(employeeId);
      }
    };
  }, [fetchData, clearData, employeeId]);

  const data = dot.get(dataSouce, `${employeeId}.data`);

  return (
    <Select {...restProps}>
      {
        Array.isArray(data) ?
        data.map(v => (
          <Select.Option key={v._id} value={v._id} payload={v}>
            {v._id}
          </Select.Option>
        )) : null
      }
    </Select>
  );
}

CommonSelectJobHandover.propTypes = {
  employeeId: PropTypes.string, // 员工ID
};

const mapStateToProps = ({ applicationCommon: { jobHandovers } }) => ({
  dataSouce: jobHandovers,
});

const mapDispatchToProps = dispatch => ({
  fetchData: id => dispatch({
    type: 'applicationCommon/fetchJobHandovers',
    payload: { employeeId: id },
  }),
  clearData: id => dispatch({
    type: 'applicationCommon/reduceJobHandovers',
    payload: { employeeId: id, res: {} },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectJobHandover);
