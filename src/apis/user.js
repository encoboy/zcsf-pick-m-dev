import { get, post } from '../utils/axios.js';

// const accesstoken = localStorage.getItem('access_token');
/**
 * 获取 access_token
 * @param params 企业id和密钥
 */
export async function getToken(corpInfo) {
  const data = {
    corpid: corpInfo.corpId,
    corpsecret: corpInfo.corpSecret,
  };
  const res = await get(`${corpInfo.baseURl}/rest/accessToken/getToken`, data);
  // localStorage.setItem('access_token', res.access_token);
  return res;
}
/**
 * 获取组织所有信息接口
 * @param params 企业id和密钥
 */
export async function fetchDepartAndUserInfo(params, corpInfo) {
  const data = {
    departId: params.departId ? params.departId : null, // 父级部门id,用于获取子部门
    corpId: corpInfo.corpId, // 企业密钥id
    corpSecret: corpInfo.corpSecret, // 企业密钥
    compId: corpInfo.compId, // 企业id
    departType: corpInfo.departType, // 必传：0全部,1授权的组织
    userId: corpInfo.userId, // 获取授权组织需要传登陆用户id
  };
  const res = await post(
    `${corpInfo.baseURl}/rest/org/getDepartAndUserInfo?access_token=${params.accesstoken}`,
    data,
  );
  if (res.Response) {
    return res.Response.body;
  }
  return {
    crumbs: [],
    personAll: [],
    depart: [],
  };
}
/**
 *
 * @param params
 */
export async function getPersonInfo(params, corpInfo) {
  const res = await post(
    `${corpInfo.baseURl}/rest/org/getPersonInfo?access_token=${params.accesstoken}`,
    params,
  );
  return res.Response.body;
}
/**
 * 获取最近联系人
 * @param data 参数
 */
export async function searchDepartFriend(params, corpInfo) {
  const data = {
    compid: corpInfo.compId, // 企业id
    searchValue: params.searchValue, // 搜索值
    page: 0, // 页码
    pageSize: 200, // 条数
    departType: corpInfo.departType, // 必传：0全部,1授权的组织
    userId: corpInfo.userId,
  };
  const res = await post(
    `${corpInfo.baseURl}/rest/org/searchDepartFriend?access_token=${params.accesstoken}`,
    data,
  );
  return res.Response.body;
}
/**
 * 获取最近联系人
 * @param data 参数
 */
export async function fetchRecentContacts() {
  return new Promise(resolve => {
    // const newdata = [];
    // // eslint-disable-next-line no-plusplus
    // for (let i = 0; i < 60; i++) {
    //   const haschildren = i % 2 === 0;
    //   newdata.push({
    //     id: i + 3,
    //     name: `${i}data最近联系人`,
    //     sex: 1,
    //     department: '集团技术管理部',
    //     position: '前端工程师',
    //     src: '',
    //     haschildren,
    //   });
    // }
    resolve([]);
  });
}



/**
 * 获取部门列表
 * @param data 参数
 */
export async function getDepartInfo1(params, corpInfo) {
 
  return  [
                {
                    "comp_id": 1,
                    "depNo": "WM2ZDIEW",
                    "did": "468",
                    "dnm": "测试部门",
                    "dpid": "",
                    "dshortName": "",
                    "level": 1,
                    "multilevel": 0,
                    "order": "0",
                    "userCount": 18
                },
                {
                    "comp_id": 2,
                    "depNo": "JRH2SXXI",
                    "did": "494",
                    "dnm": "开发部门",
                    "dpid": "",
                    "dshortName": "",
                    "level": 1,
                    "multilevel": 0,
                    "order": "0",
                    "userCount": 4
                },
                {
                    "comp_id": 3,
                    "depNo": "8CWKHNCK",
                    "did": "461",
                    "dnm": "产品部门",
                    "dpid": "",
                    "dshortName": "",
                    "level": 1,
                    "multilevel": 0,
                    "order": "0",
                    "userCount": 9
                },
                {
                    "comp_id": 4,
                    "depNo": "CTSJHRBC",
                    "did": "537",
                    "dnm": "研发部",
                    "dpid": "",
                    "dshortName": "",
                    "level": 1,
                    "multilevel": 0,
                    "order": "0",
                    "userCount": 3
                },
                {
                    "comp_id": 5,
                    "depNo": "JSN8F63Z",
                    "did": "444",
                    "dnm": "销售部",
                    "dpid": "",
                    "dshortName": "",
                    "level": 1,
                    "multilevel": 0,
                    "order": "1",
                    "userCount": 41
                },
            ];
}