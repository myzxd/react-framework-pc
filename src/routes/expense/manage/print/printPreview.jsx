/**
 * 审批单打印预览页面 Expense/Manage/Print/PrintPreview
 */
import React, { Component } from 'react';
import print from 'print-js';
import { Button, Spin } from 'antd';
import { connect } from 'dva';
import PrintTemp from './temp';

class printPreview extends Component {
  constructor(p) {
    super(p);
    // 需要打印对的审批单id数组
    this.orderArray = JSON.parse(this.props.location.query.selectedRowKeys);
    // printData 当前打印显示审批单  printDataArray 所有审批单  heightColor 左侧选中高亮
    this.state = { printData: [], printDataArray: [], heightColor: 0 };
  }

  componentDidMount() {
    this.printWrapHeight = `${window.innerHeight - 91}px`;
    this.orderArray.forEach((item) => {
      this.props.dispatch({ type: 'printData/fetchOrderDetail', payload: { id: item } });
    });
  }

  componentDidUpdate(prevProps) {
    const { printData } = this.props;
    if (prevProps.printData !== printData) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        printData: [printData[0]],
        printDataArray: printData,
      });
    }
  }
  // 打印完成关闭窗口
  printClose = () => {
    window.close();
  };
  printAll = () => {
    this.setState({
      printData: this.state.printDataArray,
    }, () => {
      print({
        printable: 'printHtml',
        type: 'html',
        scanStyles: false,
        targetStyles: ['*'],
        honorColor: true,
        onPrintDialogClose: this.printClose,
      });
    });
  };

  liClick = (index) => {
    this.setState({
      printData: [this.state.printDataArray[index]],
      heightColor: index,
    });
  };
//
  render() {
    const statePrintData = this.state.printData;
    const orderArray = this.orderArray;
    const printWrapHeight = this.printWrapHeight;
    const printDataLength = this.props.printData.length;
    const tips = `打印加载进度： ${printDataLength} / ${orderArray.length}`;
    const printDataIdList = [];
    if (printDataLength !== orderArray.length) {
      return (
        <div style={{ height: printWrapHeight, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" tip={tips} />
        </div>
      );
    } else {
      this.props.printData.forEach((item) => {
        printDataIdList.push(item.examineOrder._id);
      });
      const personList = 'personList';
      return (
        <div style={{ height: printWrapHeight }}>
          <div style={{ width: '216px', height: '90%', float: 'left', overflow: 'scroll' }}>
            <ul ref={personList} style={{ listStyle: 'none', padding: '10px', boxSizing: 'border-box' }}>
              {printDataIdList.map((item, index) => {
                return (
                  <li
                    key={index}
                    style={{ cursor: 'pointer',
                      fontSize: '14px',
                      height: '24px',
                      lineHeight: '24px',
                      marginTop: '4px',
                      borderBottom: '1px solid #666',
                      textAlign: 'center',
                      backgroundColor: index === this.state.heightColor ? 'yellow' : '' }}
                    onClick={this.liClick.bind(this, index)}
                  >
                    {item}
                  </li>);
              })}
            </ul>
          </div>
          <div style={{ height: '90%', overflow: 'scroll' }}>
            <div id="printHtml">
              {statePrintData.map((item, index) => {
                return <PrintTemp detail={item} key={index} />;
              })}
            </div>
          </div>
          <div style={{ width: '100%', height: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', float: 'left' }}>
            <Button onClick={this.printAll}>打印</Button>
          </div>
        </div>
      );
    }
  }
}
export default connect(({ printData }) => ({ printData }))(printPreview);
