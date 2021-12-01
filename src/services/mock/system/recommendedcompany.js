const count = 178;
export function recommendedData(params) {
  const { _meta: { page, limit }, state } = params;
  const data = [];
  for (let i = limit * (page - 1); i < limit * page; i++) {
    data.push({
      state,
      id: `${i}`,
      name: '上海闵浦人才服务有限公司',
      shortName: '闵浦公司',
      code: 'shmprcfwgs',
      platforms: ['美团', '饿了么'], 
      createTime: '2018-2-1 12:00',
      lastOprationTime: '2018-2-2 12:00',
      lastOprationName: '离地',
    });
  }
  return { data, meta: { count } };
}

export function serviceRange() {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      id: `${i}`,
      platformName: i % 3 === 0 ? '饿了么': '美团',
      supplierName: i % 2 === 0 ? '上海易即达': '南通润达',
      state: i % 4 === 0 ? -100 : 100,
    });
  }
  return data;
}

export function recommendedCompanyDetail() {
  return {
    state: 100,
    id: `xxxxxx`,
    name: '上海闵浦人才服务有限公司',
    abbreviation: '闵浦公司',
    code: 'shmprcfwgs',
    platforms: ['美团', '饿了么'], 
    createTime: '2018-2-1 12:00',
    lastOprationTime: '2018-2-2 12:00',
    lastOprationName: '离地',
  };
}
