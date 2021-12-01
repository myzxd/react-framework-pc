/**
 * 员工档案-部门及岗位自定义表单
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Item from './item';

class ContactPerson extends Component {
  static propTypes = {
    value: PropTypes.array,
  }

  renderFormItem = () => {
    const { value } = this.props;
    return (
      <React.Fragment>
        {
          value.map((item, index) => (<Item key={index} item={item} index={index} {...this.props} />))
        }
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderFormItem()}
      </React.Fragment>
    );
  }
}

export default ContactPerson;
