/**
 * 人员管理
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Empty } from 'antd';
import SecondLine from './menu/secondLine';
import Staff from './menu/staff';
import Operate from '../../../application/define/operate';

const canOperateEmployeeFileTypeSecond = Operate.canOperateEmployeeFileTypeSecond();
const canOperateEmployeeFileTypeStaff = Operate.canOperateEmployeeFileTypeStaff();

class Index extends Component {
  constructor(props) {
    super(props);

    // 自定义一个fileType映射数据
    const fileType = {
      second: 'second',
      staff: 'staff',
    };

    // 拿到url中的fileType，否则默认first
    this.state = {
      current: fileType[this.props.location.query.fileType] ||
        (canOperateEmployeeFileTypeSecond ? 'second' :
            canOperateEmployeeFileTypeStaff ? 'staff' : ''),
    };
  }

  // async await 处理第一次dispatch获取当前页面的fileType，第二次dispatch获取到匹配的数据
  async componentDidMount() {
    // await this.dispatchChangeFileType(this.state.current);
    await this.dispatchGetData();
  }

  // 提交一个action，修改当前的fileType
  // dispatchChangeFileType = (fileType) => {
  //   this.props.dispatch({ type: 'employeeManage/changeFileType', fileType });
  // }

  // 提交一个action， 获取数据
  dispatchGetData = () => {
    // 获取在职状态的数据
    const { dispatch } = this.props;
    dispatch({ type: 'employeeManage/fetchEmployees', payload: { fileType: this.state.current } });
  }

  // 菜单切换事件
  handleClickMenuToggle = (e) => {
    const { href } = window.location;
    const newUrl = href.split('?')[0];
    window.location.href = `${newUrl}?fileType=${e.key}`;
  }

  // 渲染与菜单对应的form表格
  renderMenuContent = () => {
    let menuContent = '';
    menuContent = this.state.current === 'second' ? <SecondLine /> : <Staff />;

    return menuContent;
  }

  // 根据权限渲染结果
  renderMain = () => {
    const { current } = this.state;
    if (current === '' || !current) {
      return (
        <div>
          <Empty />
        </div>
      );
    } else {
      return (
        <div>
          <Menu
            selectedKeys={[current]}
            onClick={this.handleClickMenuToggle}
            mode="horizontal"
          >
            {/* 是否展示劳动者 */}
            {
              canOperateEmployeeFileTypeSecond &&
              <Menu.Item key="second">劳动者档案</Menu.Item>
            }
            {/* 是否展示人员 */}
            {
              canOperateEmployeeFileTypeStaff &&
              <Menu.Item key="staff">员工</Menu.Item>
            }
          </Menu>
          {this.renderMenuContent()}
        </div>
      );
    }
  }

  render() {
    return this.renderMain();
  }
}

const mapStateToProps = ({ employeeManage }) => {
  return { employeeManage };
};

export default connect(mapStateToProps, null)(Index);
