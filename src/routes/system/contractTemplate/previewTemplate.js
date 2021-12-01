/**
 *  合同模版管理 - 预览合同模版
 */
import is from 'is_js';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { Modal, Spin, Result } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { utils } from '../../../application';

function PreviewTemplate(props) {
  const { dispatch, templatesPreview, previewId } = props;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // loading
    setLoading(true);
    // 请求接口
    dispatch({
      type: 'systemContractTemplate/fetchContractTemplatesPreview',
      payload: {
        id: previewId,
        // 关闭loading
        onLoading: () => {
          setLoading(false);
        },
      },
    });
    // 清空数据
    return () => {
      dispatch({ type: 'systemContractTemplate/reduceContractTemplatesPreview', payload: {} });
    };
  }, [dispatch, previewId]);

  // 关闭弹框
  const onCancel = () => {
    props.onCancel && props.onCancel();
  };

  const renderImgs = () => {
    const imgList = utils.dotOptimal(templatesPreview, 'image_url_list', []); // 数据列表
    // 渲染loading
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

    // 渲染合同照片
    return imgList.map((url, i) => {
      return (<React.Fragment key={i}>
        <img style={{ width: '100%', height: 'auto' }} src={url} role="presentation" />
        <div style={{ height: 25, lineHeight: '25px', textAlign: 'center' }} >
          <LeftOutlined /> <span style={{ color: '#1676ff' }}>{i + 1} </span> / {imgList.length} <RightOutlined />
        </div>
      </React.Fragment>);
    });
  };

  return (
    <Modal
      title="预览合同模版"
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
function mapStateToProps({ systemContractTemplate: { templatesPreview } }) {
  return { templatesPreview };
}
export default connect(mapStateToProps)(PreviewTemplate);
