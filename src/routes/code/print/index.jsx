/**
 * code审批单打印预览页
 */
import React, { useState, useEffect, useRef } from 'react';
import { Button, Spin } from 'antd';
import { connect } from 'dva';
import print from 'print-js';

import PrintItem from './item.jsx';

const PrintView = ({
  dispatch,
  printOrderList = [], // 需要打印的审批单信息
  location,
}) => {
  const { selectedRowKeys = [] } = location.query;
  const orderIds = useRef(JSON.parse(selectedRowKeys));

  const printWrapHeight = useRef({});
  // 当前审批单打印预览
  const [curPrintData, setCurPrintData] = useState([]);
  // 所有审批单打印预览
  const [allPrintData, setAllPrintData] = useState([]);
  // 左侧审批单号选中高亮
  const [heightColor, setHeightColor] = useState(0);

  useEffect(() => {
    printWrapHeight.current = `${window.innerHeight - 91}px`;
    if (Array.isArray(orderIds.current) && orderIds.current.length > 0) {
      orderIds.current.forEach((i) => {
        dispatch({
          type: 'codeOrder/getPrintOrderList',
          payload: { orderId: i },
        });
      });
    }
    return () => {
      dispatch({
        type: 'codeOrder/resetPrintOrderList',
        payload: {},
      });
    };
  }, [dispatch, orderIds]);

  useEffect(() => {
    if (Array.isArray(printOrderList) && printOrderList.length > 0) {
      setCurPrintData([printOrderList[0]]);
      setAllPrintData(printOrderList);
    }
  }, [printOrderList]);

  // 打印
  const onPrintAll = () => {
    setCurPrintData(printOrderList);
    setTimeout(() => {
      print({
        printable: 'printHtml',
        type: 'html',
        scanStyles: false,
        targetStyles: ['*'],
        honorColor: true,
        onPrintDialogClose: () => setCurPrintData([printOrderList[heightColor]]),
      });
    }, 0);
  };

  // 返回
  const onBack = () => {
    const { tabKey } = location.query;
    if (tabKey) {
      window.location.href = `/#/Code/PayOrder?tabKey=${tabKey}`;
    } else {
      window.history.back();
    }
  };

  // 点击审批单
  const onOrderClick = (key) => {
    setCurPrintData([allPrintData[key]]);
    setHeightColor(key);
  };

  // 审批单号导航
  const renderNavigation = () => {
    return (
      <div
        style={{
          width: 222,
          height: '90%',
          float: 'left',
          overflow: 'scroll',
        }}
      >
        <ul
          style={{
            listStyle: 'none',
            padding: 10,
            boxSizing: 'border-box',
          }}
        >
          {
            printOrderList.map((item, key) => {
              return (
                <li
                  key={key}
                  style={{
                    cursor: 'pointer',
                    fontSize: 14,
                    height: 24,
                    lineHeight: '24px',
                    marginTop: 4,
                    borderBottom: '1px solid #666',
                    textAlign: 'center',
                    backgroundColor: key === heightColor ? 'yellow' : '' }}
                  onClick={() => onOrderClick(key)}
                >
                  {item._id}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  };

  // 页面内容
  const renderContent = () => {
    return (
      <div
        style={{
          height: '90%',
          overflow: 'scroll',
        }}
      >
        <div id="printHtml">
          {
            curPrintData.map((item, key) => {
              return <PrintItem detail={item} key={key} />;
            })
          }
        </div>
      </div>
    );
  };

  const tips = `打印加载进度： ${printOrderList.length} / ${orderIds.current.length}`;
  // 数据未加载完
  if (allPrintData.length !== orderIds.current.length) {
    return (
      <div
        style={{
          height: printWrapHeight.current,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" tip={tips} />
      </div>
    );
  }

  return (
    <div style={{ height: printWrapHeight.current }}>
      {renderNavigation()}
      {renderContent()}
      <div
        style={{
          width: '100%',
          height: '10%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          float: 'left',
        }}
      >
        <Button onClick={() => onBack()}>返回</Button>
        <Button
          onClick={() => onPrintAll()}
          style={{
            marginLeft: 20,
          }}
        >全部打印</Button>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  codeOrder: { printOrderList },
}) => {
  return { printOrderList };
};

export default connect(mapStateToProps)(PrintView);
