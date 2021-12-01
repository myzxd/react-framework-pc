import dot from 'dot-prop';
import moment from 'moment';
import {
  EmployeeCollectionType,
  AccountApplyWay,
  PaperworkType,
} from '../../../../../../application/define';

const onResetStaff = (res = {}, form = {}) => {
  const {
    basicFormRef,
    careerFormRef,
  } = form;

  const {
    bank_info: bankInfo = {},
  } = res;

  // 工作经历
  const initialWorkTime = Array.isArray(res.work_experience) && res.work_experience.length > 0 ?
    res.work_experience.map(w => ({
      employer: w.employer,
      position: w.position,
      certifier_name: w.certifier_name,
      proof_phone: w.proof_phone,
      work_time: w.work_start_time && w.work_end_time ?
        [moment(String(w.work_start_time)), moment(String(w.work_end_time))]
        : undefined,
    }))
    : [{
      employer: undefined, // 工作单位
      position: undefined, // 曾任职岗位
      certifier_name: undefined, // 证明人姓名
      proof_phone: undefined, // 证明人电话
      work_time: undefined, // 工作时间
    }];

  // 基本信息
  basicFormRef && basicFormRef.current.setFieldsValue({
    identity_certificate_type: res.identity_certificate_type || PaperworkType.idCard, // 身份证证件类型
    identity_card_id: res.identity_card_id || undefined, // 身份证证件类型
    identity_card_front: {
      keys: dot.get(res, 'identity_card_front') ? [dot.get(res, 'identity_card_front')] : [],
      urls: dot.get(res, 'identity_card_front_url') ? [dot.get(res, 'identity_card_front_url')] : [],
    }, // 身份证正面照
    identity_card_back: {
      keys: dot.get(res, 'identity_card_back') ? [dot.get(res, 'identity_card_back')] : [],
      urls: dot.get(res, 'identity_card_back_url') ? [dot.get(res, 'identity_card_back_url')] : [],
    }, // 身份证反面照
    identity_card_in_hand: {
      keys: dot.get(res, 'identity_card_in_hand') ? [dot.get(res, 'identity_card_in_hand')] : [],
      urls: dot.get(res, 'identity_card_in_hand_url') ? [dot.get(res, 'identity_card_in_hand_url')] : [],
    }, // 身份证半身照

    health_certificate_type: res.health_certificate_type || PaperworkType.health, // 身份证证件类型
    health_certificate_no: res.health_certificate_no || undefined, // 健康证证件类型
    health_certificate: {
      keys: dot.get(res, 'health_certificate') ? [dot.get(res, 'health_certificate')] : [],
      urls: dot.get(res, 'health_certificate_url') ? [dot.get(res, 'health_certificate_url')] : [],
    }, // 健康证正面照
    health_certificate_back: {
      keys: dot.get(res, 'health_certificate_back') ? [dot.get(res, 'health_certificate_back')] : [],
      urls: dot.get(res, 'health_certificate_back_url') ? [dot.get(res, 'health_certificate_back_url')] : [],
    }, // 健康证反面照
    health_certificate_in_hand: {
      keys: dot.get(res, 'health_certificate_in_hand') ? [dot.get(res, 'health_certificate_in_hand')] : [],
      urls: dot.get(res, 'health_certificate_in_hand_url') ? [dot.get(res, 'health_certificate_in_hand_url')] : [],
    }, // 健康证半身照

    drive_certificate_type: res.drive_certificate_type || PaperworkType.drive, // 驾驶证证证件类型
    drive_certificate_no: res.drive_certificate_no || undefined, // 驾驶证证证件类型
    drive_certificate_front: {
      keys: dot.get(res, 'drive_certificate_front') ? [dot.get(res, 'drive_certificate_front')] : [],
      urls: dot.get(res, 'drive_certificate_front_url') ? [dot.get(res, 'drive_certificate_front_url')] : [],
    }, // 驾驶证证正面照
    drive_certificate_back: {
      keys: dot.get(res, 'drive_certificate_back') ? [dot.get(res, 'drive_certificate_back')] : [],
      urls: dot.get(res, 'drive_certificate_back_url') ? [dot.get(res, 'drive_certificate_back_url')] : [],
    }, // 驾驶证证反面照
    drive_certificate_in_hand: {
      keys: dot.get(res, 'drive_certificate_in_hand') ? [dot.get(res, 'drive_certificate_in_hand')] : [],
      urls: dot.get(res, 'drive_certificate_in_hand_url') ? [dot.get(res, 'drive_certificate_in_hand_url')] : [],
    }, // 驾驶证证半身照

    name: res.name || undefined, // 姓名
    phone: res.phone || undefined, // 手机号
    gender_id: res.gender_id || undefined, // 性别
    national: res.national || undefined, // 民族
    born_in: res.born_in ? moment(String(res.born_in)) : '', // 出生日期
    marital_status: res.marital_status || undefined, // 婚姻状况
    work_address: {
      province: res.work_province_code ?
        Number(res.work_province_code)
        : undefined,
      city: res.work_city_code ?
        Number(res.work_city_code)
        : undefined,
    }, // 工作地
    native_place: res.native_place || undefined, // 户口所在地
    often_address: res.often_address || undefined, // 常居地
    emergency_contact: res.emergency_contact || undefined, // 紧急联系人
    emergency_contact_phone: res.emergency_contact_phone || undefined, // 紧急联系人电话
    work_email: res.work_email || undefined, // 工作邮箱
    email: res.email || undefined, // 个人邮箱
    telephone: res.telephone || undefined, // 固定电话
    height: res.height || undefined, // 身高
    weight: res.weight || undefined, // 体重
    interest: res.interest || undefined, // 爱好
    constellation: res.constellation || undefined, // 星座
    speciality: res.speciality || undefined, // 特长
    education: res.education, // 学历
    politics_status: res.politics_status || undefined, // 政治面貌
    birth_place: res.birth_place || undefined, // 籍贯
    candidates_photo_list: {
      keys: Array.isArray(res.candidates_photo_list) ?
        res.candidates_photo_list : [],
      urls: Array.isArray(res.candidates_photo_url_list) ?
        res.candidates_photo_url_list : [],
    }, // 应聘人员登记表

    bank_location: {
      province: dot.get(bankInfo, 'bank_location.0'),
      city: dot.get(bankInfo, 'bank_location.1'),
    }, // 所在地（省市）
    payment_type: dot.get(bankInfo, 'payment_type') || EmployeeCollectionType.personal, // 收款模式
    card_holder_name: dot.get(bankInfo, 'card_holder_name'), // 持卡人姓名
    card_holder_bank_card_no: dot.get(bankInfo, 'card_holder_bank_card_no'), // 银行卡账号
    bank_branch: dot.get(bankInfo, 'bank_branch'), // 开户行
    bank_branch_name: dot.get(bankInfo, 'bank_branch_name'), // 支行名称
    bank_card_front: {
      keys: dot.get(bankInfo, 'bank_card_front') ?
        [bankInfo.bank_card_front]
        : [],
      urls: dot.get(bankInfo, 'bank_card_front_url') ?
        [bankInfo.bank_card_front_url]
        : [],
    }, // 银行卡正面照
    collect_protocol: {
      keys: dot.get(bankInfo, 'collect_protocol', []),
      urls: dot.get(bankInfo, 'collect_protocol_url', []),
    }, // 代收协议
    collect_id_card_no: dot.get(bankInfo, 'collect_id_card_no'), // 代收人身份证号码

    highest_education: res.highest_education || undefined, // 最高学历
    professional: res.professional, // 专业职称
    language_level: res.language_level, // 外语及等级
    academy_list: Array.isArray(res.academy_list) && res.academy_list.length > 0 ?
      res.academy_list.map(a => (
        {
          institution_name: a.institution_name || undefined,
          education: a.education || undefined,
          profession: a.profession || undefined,
          time: [
            a.start_time ? moment(a.start_time) : undefined,
            a.end_time ? moment(a.end_time) : undefined,
          ],
        }
      ))
      : [{
        institution_name: undefined,
        education: undefined,
        profession: undefined,
        time: [],
      }], // 学习经历
    degree: {
      keys: Array.isArray(res.degree) ? res.degree : [],
      urls: Array.isArray(res.degree_url) ? res.degree_url : [],
    }, // 毕业证
    certificate_photo_list: {
      keys: Array.isArray(res.certificate_photo_list) ?
        res.certificate_photo_list : [],
      urls: Array.isArray(res.certificate_photo_url_list) ?
        res.certificate_photo_url_list : [],
    }, // 从业资格证
    other_certificate_photo_list: {
      keys: Array.isArray(res.other_certificate_photo_list) ?
        res.other_certificate_photo_list
        : [],
      urls: Array.isArray(res.other_certificate_photo_url_list) ?
        res.other_certificate_photo_url_list
        : [],
    },

    application_channel_id: res.application_channel_id || AccountApplyWay.other, // 应聘途径
    application_company_name: res.application_company_name || undefined, // 公司名称
    referrer_identity_no: res.referrer_identity_no || undefined, // 推荐人身份证
    referrer_name: res.referrer_name || undefined, // 推荐人姓名
    referrer_phone: res.referrer_phone || undefined, // 推荐人手机号
    application_platform: res.application_platform || undefined, // 渠道
    transfer_sign_platform: res.transfer_sign_platform || undefined, // 平台
    transfer_sign_supplier: res.transfer_sign_supplier || undefined, // 供应商
    transfer_sign_post: res.transfer_sign_post || undefined, // 岗位

  });

  // 职业生涯
  careerFormRef && careerFormRef.current.setFieldsValue({
    entry_date: res.entry_date ? moment(String(res.entry_date)) : undefined, // 入职日期
    regular_date: res.regular_date ? moment(String(res.regular_date)) : undefined, // 预计转正日期
    work_experience: initialWorkTime,
  });
};

export default onResetStaff;
