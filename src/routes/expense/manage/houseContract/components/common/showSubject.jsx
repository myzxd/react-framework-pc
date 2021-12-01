/**
 * 根据科目id展示科目名称
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { connect } from 'dva';

class ShowSubject extends Component {

  static propTypes = {
    subjectId: PropTypes.string.isRequired, // 科目id
    subjectsDetail: PropTypes.object,
  };

  static defaultProps = {
    subjectId: '',
    subjectsDetail: {},
  };

  componentDidUpdate(prevProps) {
    const { subjectId: oriId = undefined, dispatch } = prevProps;
    const { subjectId: prevId = undefined, subjectsDetail = {} } = this.props;

    if (prevId && oriId !== prevId && !subjectsDetail[prevId]) {
      dispatch({
        type: 'expenseHouseContract/fetchSubjectsDetail',
        payload: { namespace: prevId, param: { id: prevId } },
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'expenseHouseContract/resetSubjectsDetail',
    });
  }

  render = () => {
    const { subjectId: namespace, subjectsDetail = {} } = this.props;
    const subjectName = dot.get(subjectsDetail, `${namespace}.name`, '');
    const subjectCode = dot.get(subjectsDetail, `${namespace}.accountingCode`, '');
    return (
      <span>{`${subjectName}${subjectCode}`}</span>
    );
  }

}

function mapStateToProps({ expenseHouseContract: { subjectsDetail } }) {
  return { subjectsDetail };
}

export default connect(mapStateToProps)(ShowSubject);
