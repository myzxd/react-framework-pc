import moment from 'moment';
import is from 'is_js';
import dot from 'dot-prop';
import { EmployeeCollectionType } from '../../../../../application/define';

function onResetStaff(res = {}, form = {}) {
  const {
    name = '',                                           // 姓名
    gender_id: gender = '',                                   // 性别
    born_in: initBirthday = undefined,                   // 出生日期
    national = undefined,                                            // 名族
    politics_status: politicalStatus = undefined,                    // 政治面貌
    marital_status: maritalStatus = undefined,                       // 婚姻状况
    birth_place: birthplace = '',                        // 籍贯
    native_place: accountLocation = '',                  // 户口所在地
    often_address: oftenAddress = '',                    // 常居地
    phone = '',                                          // 手机号
    telephone: fixedTelephone = undefined,                           // 固定电话
    email = '',                                          // 邮箱
    education = undefined,                                           // 学历
    emergency_contact: emergencyContact = '',            // 紧急联系人
    emergency_contact_phone: emergencyContactPhone = '', // 紧急联系人电话
    height = undefined,                                  // 身高
    weight = undefined,                                  // 体重
    constellation = undefined,                           // 星座
    interest: hobby = '',                                // 兴趣爱好
    speciality: specialty = '',                          // 特长

    identity_certificate_type: initIdPaperworkType = '',       // 身份证件类型
    identity_card_id: initIdPaperworkNumber = '',         // 身份证号
    identity_card_front: identityCardFrontPhotoList = '',           // 身份证正面照
    identity_card_front_url: identityCardFrontPhotoListUrl = '',    // 身份证正面照
    identity_card_back: identityCardBackPhotoList = '',             // 身份证反面照
    identity_card_back_url: identityCardBackPhotoListUrl = '',      // 身份证反面照
    identity_card_in_hand: identityCardInHandPhotoList = '',        // 手持身份证照
    identity_card_in_hand_url: identityCardInHandPhotoListUrl = '', // 手持身份证照

    application_channel_id: applicationChannelId = undefined, // 应聘途径

    highest_education: highestEducation = undefined, // 最高学历
    professional: jobTitle = undefined, // 专业职称
    language_level: foreignLanguage = undefined, // 外语及等级
    academy_list: academyList = [{}], // 学习经历

    work_experience: workExperience = [{}], // 工作经历

    is_salary_split: initIsSplitWage = undefined, // 工资是否拆分
    split_base: initSplitBase = undefined, // 拆分基数
    cost_center_type: costCenterType = undefined,
    platform_codes: platformList = [],
    supplier_ids: supplierList = [],
    city_codes: cityCodes = [],
    city_spelling_list: citySpellingList = [],

    health_certificate_type: initHealthPaperworkType = undefined, // 健康证证件类型
    health_certificate_no: initHealthPaperworkNumber = undefined, // 健康证证件号码
    health_certificate: healthCertificatePhotoList = '',                      // 健康证正面照
    health_certificate_url: healthCertificatePhotoListUrl = '',               // 健康证正面照
    health_certificate_back: healthCertificateBackPhotoList = '',             // 健康证反面照
    health_certificate_back_url: healthCertificateBackPhotoListUrl = '',      // 健康证反面照
    health_certificate_in_hand: healthCertificateInHandPhotoList = '',        // 手持健康证
    health_certificate_in_hand_url: healthCertificateInHandPhotoListUrl = '', // 手持健康证

    drive_certificate_type: initDrivePaperworkType = undefined, // 驾驶证证件类型
    drive_certificate_no: initDrivePaperworkNumber = undefined, // 驾驶证证件号码
    drive_certificate_front: driveCertificateFrontPhotoList = '',           // 驾驶证正面照
    drive_certificate_front_url: driveCertificateFPhotoListUrl = '',        // 驾驶证正面照
    drive_certificate_back: driveCertificateBackPhotoList = '',             // 驾驶证反面照
    drive_certificate_back_url: driveCertificateBackPhotoListUrl = '',      // 驾驶证反面照
    drive_certificate_in_hand: driveCertificateInHandPhotoList = '',        // 手持驾驶证
    drive_certificate_in_hand_url: driveCertificateInHandPhotoListUrl = '', // 手持驾驶证
  } = res;

  // 学历经历
  const learnExperience = academyList.map((item) => {
    return {
      institutionName: item.institution_name, // 院校名称
      dynamicEducation: item.education,       // 学历
      profession: item.profession,            // 专业
      period: [
        item.start_time ? moment(item.start_time) : undefined,
        item.end_time ? moment(item.end_time) : undefined,
      ],                                      // 学习时间
    };
  });

  // 工作经历
  const initWorkExperience = workExperience.map((item) => {
    return {
      employer: item.employer,        // 工作单位
      workPosition: item.position,    // 职位
      witness: item.certifier_name,   // 证明人姓名
      witnessPhone: item.proof_phone, // 证明人电话
      workPeriod: [
        item.work_start_time ? moment(item.work_start_time) : undefined,
        item.work_end_time ? moment(item.work_end_time) : undefined,
      ],                              // 工作时间
    };
  });

  const {
    bankInfo,
    baseInfo,
    educationInfo,
    identityInfo,
    recommendedSourceInfo,
    wageInfo,
    workExperienceInfo,
    costCenter,
  } = form;

  // 身份证正面照
  const identityCardFrontValue = {
    keys: identityCardFrontPhotoList ? [identityCardFrontPhotoList] : [],
    urls: identityCardFrontPhotoListUrl ? [identityCardFrontPhotoListUrl] : [],
  };
  // 身份证反面照
  const identityCardBackValue = {
    keys: identityCardBackPhotoList ? [identityCardBackPhotoList] : [],
    urls: identityCardBackPhotoListUrl ? [identityCardBackPhotoListUrl] : [],
  };
  // 手持身份证照
  const identityCardInHandValue = {
    keys: identityCardInHandPhotoList ? [identityCardInHandPhotoList] : [],
    urls: identityCardInHandPhotoListUrl ? [identityCardInHandPhotoListUrl] : [],
  };

  // 个人信息
  baseInfo.props.form.setFieldsValue({
    name,
    gender: `${gender}`,
    national,
    politicalStatus,
    maritalStatus,
    birthplace,
    accountLocation,
    oftenAddress,
    phone,
    fixedTelephone,
    email,
    education,
    emergencyContact,
    emergencyContactPhone,
    height,
    weight,
    constellation,
    hobby,
    specialty,
    birthday: initBirthday ? moment(`${initBirthday}`) : null,
    age: initBirthday ? moment().year() - moment(`${initBirthday}`).year() : '--',
  });

  // 代收协议
  const agreementKeys = dot.get(res, 'bank_info.collect_protocol', undefined);
  const agreementUrls = dot.get(res, 'bank_info.collect_protocol_url', undefined);
  const agreement = !agreementKeys || is.empty(agreementKeys) || !agreementUrls || is.empty(agreementUrls) ? undefined : { keys: agreementKeys, urls: agreementUrls };

  // 代收证明
  const proveKeys = dot.get(res, 'bank_info.collect_provement', undefined);
  const proveUrls = dot.get(res, 'bank_info.collect_provement_url', undefined);
  const prove = !proveKeys || is.empty(proveKeys) || !proveUrls || is.empty(proveUrls) ? undefined : { keys: proveKeys, urls: proveUrls };

  // 银行卡正面照
  const bankPositiveKeys = dot.get(res, 'bank_info.bank_card_front', undefined);
  const bankPositiveUrls = dot.get(res, 'bank_info.bank_card_front_url', undefined);
  const bankPositive = !bankPositiveKeys || is.empty(bankPositiveKeys) || !bankPositiveUrls || is.empty(bankPositiveUrls) ? undefined : { keys: [bankPositiveKeys], urls: [bankPositiveUrls] };

  // 健康证正面照
  const healthCertificateValue = {
    keys: healthCertificatePhotoList !== null && healthCertificatePhotoList !== '' ? [healthCertificatePhotoList] : [],
    urls: healthCertificatePhotoListUrl !== null && healthCertificatePhotoListUrl !== '' ? [healthCertificatePhotoListUrl] : [],
  };
  // 健康证反面照
  const healthCertificateBackValue = {
    keys: healthCertificateBackPhotoList !== null && healthCertificateBackPhotoList !== '' ? [healthCertificateBackPhotoList] : [],
    urls: healthCertificateBackPhotoListUrl !== null && healthCertificateBackPhotoListUrl !== '' ? [healthCertificateBackPhotoListUrl] : [],
  };
  // 手持健康证
  const healthCertificateInHandValue = {
    keys: healthCertificateInHandPhotoList !== null && healthCertificateInHandPhotoList !== '' ? [healthCertificateInHandPhotoList] : [],
    urls: healthCertificateInHandPhotoListUrl !== null && healthCertificateInHandPhotoListUrl !== '' ? [healthCertificateInHandPhotoListUrl] : [],
  };

  // 驾驶证正面照
  const driveCertificateValue = {
    keys: driveCertificateFrontPhotoList !== '' && driveCertificateFrontPhotoList !== null ? [driveCertificateFrontPhotoList] : [],
    urls: driveCertificateFPhotoListUrl !== '' && driveCertificateFPhotoListUrl !== null ? [driveCertificateFPhotoListUrl] : [],
  };
  // 驾驶证反面照
  const driveCertificateBackValue = {
    keys: driveCertificateBackPhotoList !== '' && driveCertificateBackPhotoList !== null ? [driveCertificateBackPhotoList] : [],
    urls: driveCertificateBackPhotoListUrl !== '' && driveCertificateBackPhotoListUrl !== null ? [driveCertificateBackPhotoListUrl] : [],
  };
  // 手持驾驶证
  const driveCertificateInHandValue = {
    keys: driveCertificateInHandPhotoList !== '' && driveCertificateInHandPhotoList !== null ? [driveCertificateInHandPhotoList] : [],
    urls: driveCertificateInHandPhotoListUrl !== '' && driveCertificateInHandPhotoListUrl !== null ? [driveCertificateInHandPhotoListUrl] : [],
  };


  // 身份信息
  identityInfo.props.form.setFieldsValue({
    idPaperworkType: `${initIdPaperworkType}`,
    idPaperworkNumber: initIdPaperworkNumber,
    idFrontPhotos: identityCardFrontValue,
    idObversePhotos: identityCardBackValue,
    idClosePhotos: identityCardInHandValue,

    healthPaperworkType: initHealthPaperworkType ? `${initHealthPaperworkType}` : undefined,
    healthPaperworkNumber: initHealthPaperworkNumber,
    healthFrontPhotos: healthCertificateValue,
    healthObversePhotos: healthCertificateBackValue,
    healthClosePhotos: healthCertificateInHandValue,

    drivePaperworkType: initDrivePaperworkType ? `${initDrivePaperworkType}` : undefined,
    drivePaperworkNumber: initDrivePaperworkNumber,
    driveFrontPhotos: driveCertificateValue,
    driveObversePhotos: driveCertificateBackValue,
    driveClosePhotos: driveCertificateInHandValue,
  });

  const address = dot.get(res, 'bank_location', []); // 获取省市数据

  const collection = dot.get(res, 'bank_info.payment_type', EmployeeCollectionType.personal);

  collection === EmployeeCollectionType.personal && bankInfo.props.form.setFieldsValue({
    collection,
    cardholder: dot.get(res, 'bank_info.card_holder_name', undefined),
    account: dot.get(res, 'bank_info.card_holder_bank_card_no', undefined),
    bankName: dot.get(res, 'bank_info.bank_branch', undefined),
    branch: dot.get(res, 'bank_info.bank_branch_name', undefined),
    address: address.length > 0 ? { province: address[0], city: address[1] } : {},
    bankPositive,
  });

  collection === EmployeeCollectionType.collecting && bankInfo.props.form.setFieldsValue({
    collection,
    cardholder: dot.get(res, 'bank_info.card_holder_name', undefined),
    collectingGender: dot.get(res, 'bank_info.collect_sex', undefined),
    collectingPhone: dot.get(res, 'bank_info.collect_phone', undefined),
    identity: dot.get(res, 'bank_info.collect_id_card_no', undefined),
    bankPositives: bankPositive,
    account: dot.get(res, 'bank_info.card_holder_bank_card_no', undefined),
    bankName: dot.get(res, 'bank_info.bank_branch', undefined),
    branch: dot.get(res, 'bank_info.bank_branch_name', undefined),
    address: address.length > 0 ? { province: address[0], city: address[1] } : {},
    agreement,
    prove,
  });

  recommendedSourceInfo.props.form.setFieldsValue({
    applicationChannelId: `${applicationChannelId}`,
  });

  educationInfo.props.form.setFieldsValue({
    highestEducation,
    jobTitle,
    foreignLanguage,
    learnExperience: learnExperience.length > 0 ? learnExperience : [{}],
  });

  workExperienceInfo.props.form.setFieldsValue({
    workExperience: initWorkExperience.length > 0 ? initWorkExperience : [{}],
  });

  wageInfo.props.form.setFieldsValue({
    isSplitWage: initIsSplitWage ? 1 : 0,
    splitBase: initSplitBase ? initSplitBase / 100 : undefined,
  });

  costCenter && costCenter.props && costCenter.props.form && costCenter.props.form.setFieldsValue({
    costCenter: `${costCenterType}`,
    platformCode: platformList,
    supplierIds: supplierList,
    cityCodes: citySpellingList,
    citys: cityCodes,
  });
}

export default onResetStaff;
