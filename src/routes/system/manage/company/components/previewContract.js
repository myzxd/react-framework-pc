/**
 *  预览合同
 */
import is from 'is_js';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { Modal, Spin, Result } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { utils } from '../../../../../application';

function PreviewContract(props) {
  const { dispatch, previewContract, previewId } = props;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    dispatch({
      type: 'systemManage/fetchPreviewContract',
      payload: {
        id: previewId,
        onLoading: () => {
          setLoading(false);
        },
      },
    });
    return () => {
      dispatch({ type: 'systemManage/reducePreviewContract', payload: {} });
    };
  }, [dispatch, previewId]);
  const onCancel = () => {
    props.onCancel && props.onCancel();
  };

  const renderImgs = () => {
    const imgList = utils.dotOptimal(previewContract, 'contract_images', []); // 数据列表
    if (loading) {
      return (<div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      > <Spin /></div>);
    }
    // 判断报错的情况
    if (is.not.existy(imgList) || is.empty(imgList)) {
      return (
        <Result
          status="error"
          title="请重试"
        />
      );
    }
    return imgList.map((url, i) => {
      return (<React.Fragment key={i}>
        <img style={{ width: '100%', height: 'auto' }} src={`data:image/png;base64,${url}`} role="presentation" />
        <div style={{ height: 25, lineHeight: '25px', textAlign: 'center' }} >
          <LeftOutlined /> <span style={{ color: '#1676ff' }}>{i + 1} </span> / {imgList.length} <RightOutlined />
        </div>
      </React.Fragment>);
    });
  };

  return (
    <Modal
      title="预览合同"
      visible
      onCancel={onCancel}
      footer={null}
    >
      <div
        style={{
          width: '100%',
          height: 500,
          padding: '20px',
          background: '#f7f7f7',
          overflowY: 'scroll',
        }}
      >
        {renderImgs()}
      </div>
    </Modal>
  );
}
function mapStateToProps({ systemManage: { previewContract } }) {
  return { previewContract };
}
export default connect(mapStateToProps)(PreviewContract);
