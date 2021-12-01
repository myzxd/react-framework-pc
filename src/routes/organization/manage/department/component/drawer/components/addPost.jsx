/**
 * 添加多个岗位信息组件
 */
import React from 'react';
import {
  Form,
  InputNumber,
  Button,
  Input,
  Row,
  Col,
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { dotOptimal } from '../../../../../../../application/utils';
import { Unit } from '../../../../../../../application/define';
import PostNameSelect from '../../../../components/postNameSelect';
import style from './style.less';

const { TextArea } = Input;

AddPost.propTypes = {
  staffList: PropTypes.object, // 岗位列表
  formName: PropTypes.string, // 表单name
  form: PropTypes.object, // Form实例
};

function AddPost({
  staffList,
  formName,
  form,
  isApprove = false, // 是否走审批
}) {
  return (
    <Form.List
      name={formName}
    >
      {(fields, { add, remove }) => (
        <React.Fragment>
          {
            // 渲染Form.List Item
            fields.map(({ key, name, fieldKey, ...restField }) => {
              // 当前选中的合同信息
              return (
                <React.Fragment key={key}>
                  <Row className={style['postInfo-formItem-wrap']}>
                    <Col span={21}>
                      <Form.Item
                        {...restField}
                        label="岗位名称"
                        name={[name, 'jobId']}
                        fieldKey={[fieldKey, 'jobId']}
                        rules={[{ required: true, message: '请选择岗位名称' }]}
                      >
                        <PostNameSelect
                          isFetchData={dotOptimal(staffList, 'data', []).length <= 0}
                          clearnOptionList={
                            form.getFieldValue(formName).filter(item => item && item.jobId !== dotOptimal(form.getFieldValue(formName), `${name}.jobId`))
                          }
                          placeholder="请选择"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="岗位编制数"
                        name={[name, 'organizationCount']}
                        fieldKey={[fieldKey, 'organizationCount']}
                        rules={[{ required: true, message: '请输入' }]}
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          disabled={isApprove}
                          style={{ width: '100%' }}
                          formatter={v => Unit.limitMaxZeroIntegerNumber(v, 100)}
                          parser={v => Unit.limitMaxZeroIntegerNumber(v, 100)}
                          placeholder="请输入岗位编制数量"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="岗位描述"
                        name={[name, 'description']}
                        fieldKey={[fieldKey, 'description']}
                      >
                        <TextArea
                          rows={3}
                          placeholder="请输入"
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) => {
                          return dotOptimal(prevValues, `jobList.${name}.jobId`) !== dotOptimal(curValues, `jobList.${name}.jobId`);
                        }}
                      >
                        {
                          ({ getFieldValue }) => {
                            // 当前选中的合同信息
                            const currentInfo = dotOptimal(staffList, 'data', []).find(item => item._id === dotOptimal(getFieldValue(formName), `${name}.jobId`)) || {};
                            return (
                              <Form.Item
                                label="岗位职级"
                              >
                                <span>{dotOptimal(currentInfo, 'rank', '--')}</span>
                              </Form.Item>
                            );
                          }
                        }
                      </Form.Item>
                    </Col>
                    <Col span={3} className={style['postInfo-delete-wrap']}>
                      {
                        fields.length > 1
                          ? <Button shape="circle" size="small" onClick={() => { remove(name); }}>
                            <MinusOutlined />
                          </Button>
                          : null
                      }
                    </Col>
                  </Row>
                </React.Fragment>
              );
            })
          }
          <Form.Item noStyle>
            <Button
              className={style['postInfo-button']}
              type="dashed"
              block
              onClick={() => {
                add({
                  organizationCount: isApprove ? 0 : undefined,
                });
              }}
            >
              <PlusOutlined />
              <span>添加下一个岗位</span>
            </Button>
          </Form.Item>
        </React.Fragment>
      )}
    </Form.List>
  );
}

const mapStateToProps = ({ organizationStaff: { staffList } }) => ({ staffList });

export default connect(mapStateToProps)(AddPost);
