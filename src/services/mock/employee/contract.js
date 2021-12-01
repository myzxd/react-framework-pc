const randomList = [];
  randomList.push({
      id: 1,
      state: 1,
      name: '张三',
      phone: '13876787678',
      knightType: 1,
      platformId: 2,
      supplier: '欧克云有限公司',
      platform: '饿了么',
      city: '北京市',
      district: '酒仙桥',
      contract: '趣活新盈',
  },{
    id: 2,
    state: 50,
    name: '张三',
    phone: '13876787678',
    knightType: 50,
    platformId: 3,
    supplier: '欧克云有限公司',
    platform: '饿了么',
    city: '北京市',
    district: '酒仙桥',
    contract: '趣活新盈',
}, {
  id: 3,
  state: 100,
  name: '张三',
  phone: '13876787678',
  knightType: 50,
  change: 130002,
  platformId: 4,
  supplier: '欧克云有限公司',
  platform: '饿了么',
  city: '北京市',
  district: '酒仙桥',
  contract: '趣活新盈',
});
export const list = {
  // 合同列表mock
  meta: {
    resultCount: 500,
  },
  data: randomList,
};

export const detail = {
  // 合同详情mock
  name: '张三',
  phone: '13876787678',
  genderId: 10,
  knightType: 1,
  state: 3,
  supplier: '趣活新盈',
  platform: '饿了么',
  city: '北京市',
  district: '酒仙桥',
  contract: '趣活新盈',
  signContractType: 1,
  recommendedChannels: 5002,
  signContractDate: '2017-02-07',
  signContractCycle: 1,
  releaseDate: '2019-01-20',
  contractUrl: 'http://localhost:8081/react-docs.pdf',
  householdType: 1,
  address: '北京市',
}
