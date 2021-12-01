/**
 * 组织架构 - 部门管理
 */
import is from 'is_js';
import React from 'react';
import { Row, Col } from 'antd';

import Silder from './silder';
import Content from './content';
import styles from './styles.css';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined, // 部门id
      departmentName: undefined,
      isJump: false, // 是否跳转的树节点
    };
  }

  // 选择部门，设置选中的部门
  onSelectDepartment = (id, name, isJump) => {
    this.setState({ id, departmentName: name, isJump });
  }

  render() {
    const { id, departmentName, isJump } = this.state;

    // 判断初始化获取的参数，如果没有部门id，则默认为空
    let selectedIds = [];
    if (is.existy(id) && is.not.empty(id)) {
      selectedIds = [id];
    }

    return (
      <Row gutter={[16, 16]} className={styles['page-container']} style={{ overflow: 'auto' }}>
        <Col span={6} className={styles['page-silder']}>
          <Silder onSelectOrganization={this.onSelectDepartment} selectedIds={selectedIds} isJump={isJump} />
        </Col>
        {
          id ?
            (
              <Col span={18} className={styles['page-content']}>
                <Content
                  departmentName={departmentName}
                  onSelectDepartment={this.onSelectDepartment}
                  departmentId={id}
                />
              </Col>
            )
          : null
        }
      </Row>
    );
  }
}

export default Index;
