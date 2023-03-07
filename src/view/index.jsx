/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useMemo, useState, useCallback, useLayoutEffect } from 'react';
import { SearchBar, Button,Avatar } from 'antd-mobile';

// import SearchBar from 'antd-mobile/es/components/SearchBar'


// import zhCN from 'antd-mobile/es/locale/zh_CN';
// import { CloseOutlined,CloseCircleOutlined } from 'antd-mobile-icons';
import { parseInt } from 'lodash';
import { getAvatarName } from '../utils/index';
import { useDebounce } from '../hooks/useDebounce';
import MainContent from './MainContent';
import DetailContent from './DetailContent';
import SearchPanel from './SearchPanel';
import { searchDepartFriend, getPersonInfo, getToken } from '../apis/user';

// import './assets/iconfont/iconfont.css'
import '../style/index.less';

// const { Search } = Input;
/**
 * 头像展示
 * @param list
 * @returns
 */
export const ActarBox = (props) => {
  const { item } = props;
  if (item.isDep) {
    return <></>;
  }
  return (
    <>
      {item.src ? (
        <Avatar src={item.src} style={{ '--size': '0.38rem' }} shape="square" />
      ) : (
        <Avatar shape="square" className={item.sex === '1' ? 'girl' : 'boy'} style={{ '--size': '0.38rem' }}>
          <span className="avatarSize">{item.AvatarName}</span>
        </Avatar>
      )}
    </>
  );
};


/**
 * 头像右侧文案展示
 * @param props
 * @returns
 */
export const ActarName = (props) => {
  const { item, searchText } = props;
  // 渲染搜索结果
  const setSearchName = (name) => {
    const bluename = name.substring(0, searchText.length);
    const endname = name.substring(searchText.length);
    return (
      <>
        <span className="theme">{bluename}</span>
        <span>{endname}</span>
      </>
    );
  };
  // 添加一个人多个部门显示支持
  const setUserDepartName = (depItem) => {
    const depNames = depItem.depName && depItem.depName.split(',');
    if (Array.isArray(depNames) && depNames.length > 0) {
      return depNames.map((child) => (
        <div className="userDepartName" key={child}>
          {child}
          {item.position && child && '-'} {item.position}
        </div>
      ));
    }
    return (
      <div className="userDepartName">
        {item.depName}
        {item.position && item.depName && '-'} {item.position}
      </div>
    );
  };
  if (item.isDep) {
    return (
      <>
        <span className="userDepartment" title={item.name}>
          {searchText ? setSearchName(item.name) : item.name}
        </span>
      </>
    );
  }
  return (
    <span className="userInfo">
      <div className="userName" title={item.name}>
        {searchText ? setSearchName(item.name) : item.name}
      </div>
      {setUserDepartName(item)}
    </span>
  );
};
/**
 * 人员选择框
 * @param props  data:初始化已选的人员 setData:获取已选择的人员
 * @returns 已选人或部门
 */
export default function (props) {
  console.log("prop2",props)
  const { initialData, onDataChange, organizationInfo } = props;
  
  const [currentUserInfo, setCurrentUserInfo] = useState({ id: 0, name: '' });
  const [chooseNum, setChooseNum] = useState(0); // 已选人数
  const [groupName, setGroupName] = useState('');
  const [ruleIds, setRuleIds] = useState([]);
  const initCorpInfo =
    organizationInfo && Object.prototype.toString.call(organizationInfo) === '[object Object]'
      ? organizationInfo
      : {
          corpId: '', // 企业密钥id
          corpSecret: '', // 企业密钥
          compId: -1, // 企业id
          departType: 0, // 必传：0全部,1授权的组织，默认为1
          userId: 0, // 获取授权组织需要传登陆用户id，默认为空
          type: '1', // 组件类型 ： ”1“：表示新建群聊 ”2“：表示获取通讯录数据，默认为“1”。
          baseURl: '',
        //   locale: 'zhCN', // zhCN，zhTW，enUS
        };
  const [corpInfo] = useState(initCorpInfo); // 已选部门
  const [locale, setLocale] = useState(); // 是否获取了tooken

  const [tooken, setTooken] = useState("123213"); // 是否获取了tooken
  const [departmentNum, setDepartmentNum] = useState(0); // 已选部门
  const initChooseUsers = initialData && Array.isArray(initialData) ? initialData : [];
  const [chooseUsers, setChooseUsers] = useState(initChooseUsers); // 已选人员
  const [showPage, setShowPage] = useState(true); // 是否显示新建群组页（默认显示）
  const [searchResult, setSearchResult] = useState([]); // 搜索结果数据
  const [searchText, setSearchText] = useState('');
  // 获取当前用户信息
  const getPersonInfos = async () => {
    // eslint-disable-next-line max-len
    const { voipinfo } = await getPersonInfo(
      { accesstoken: tooken, type: 3, userAccounts: [corpInfo.userId] },
      corpInfo,
    );
    if (voipinfo && voipinfo.length > 0) {
      const currentUser = {
        id: parseInt(voipinfo[0].uid),
        name: voipinfo[0].username,
        sex: voipinfo[0].sex,
        position: voipinfo[0].duty,
        src: voipinfo[0].photourl,
        isDep: false,
        depNo: '',
        account: voipinfo[0].account,
        depName: voipinfo[0].depart_name,
      };
      setCurrentUserInfo(currentUser);
    } else {
      // Message.error('获取当前用户信息出错');
    }
  };
  
  const getTokens = async () => {
    // localStorage.setItem('access_token', '');
    // const res = await getToken(corpInfo);
    // if (!res.access_token) {
    //   Message.error('获取access_token异常');
    // }
    // setTooken(res.access_token);
    setTooken("12323213213");

  };
  useLayoutEffect(() => {
    // setCorpInfo(organizationInfo)
    
    if (corpInfo.corpId && corpInfo.corpSecret) {
      getTokens();
    }
    if (corpInfo.locale && corpInfo.locale === 'zh_TW') {
      setLocale();
    } else if (corpInfo.locale && corpInfo.locale === 'zh_CN') {
      setLocale();
    } else if (corpInfo.locale && corpInfo.locale === 'en_US') {
      setLocale();
    }
  }, []);
  useEffect(() => {
    if (tooken && corpInfo.type === '1') {
      // getPersonInfos();
    }
  }, [tooken]);
  const setNum = () => {
    const departments = chooseUsers ? chooseUsers.filter(item => item.isDep) : [];
    setChooseNum(chooseUsers && chooseUsers.length);
    setDepartmentNum(departments.length);
  };
  // 获取查询结果
  const getfSearchResult = useCallback(
    async (searchValue, token) => {
      const result = await searchDepartFriend({ accesstoken: token, searchValue }, corpInfo);

      const newusers = result.data
        ? // eslint-disable-next-line arrow-body-style
          result.data.map((item) => {
            return item.uid
              ? {
                  id: parseInt(item.uid),
                  name: item.unm,
                  sex: item.sex,
                  depName:
                    Array.isArray(item.departs) &&
                    item.departs.length > 0 &&
                    item.departs.map((depart) => depart.departName).join(','),
                  position: item.up,
                  src: item.url,
                  isDep: false,
                  account: item.account,
                  AvatarName: getAvatarName(item.unm),
                }
              : {
                  id: parseInt(item.udid),
                  name: item.dnm,
                  sex: '0',
                  position: '',
                  src: '',
                  isDep: true,
                  depNo: '',
                  depName: item.dnm,
                  account: '',
                  AvatarName: getAvatarName(item.dnm),
                };
          })
        : [];
      setSearchResult(newusers );
    },
    [searchText, corpInfo, tooken],
  );
  // 初始化操作
  useEffect(() => {
    if (corpInfo.type && corpInfo.type === '1') {
      // setChooseUsers([currentUserInfo]); // 新建群组，默认群主
      setShowPage(true);
    } else {
      setShowPage(false);
    }
  }, [currentUserInfo]);

  // 查询
  const handleSearch = useDebounce((newValue, token) => {
    if (token) {
      setSearchText(newValue);
      getfSearchResult(newValue.trim(), token);
    }
  }, 300);
  // 已选中的用户列表id
  const checkedUserList = useMemo(() => {
    const choosedids = chooseUsers && chooseUsers.map((item) => item.id);
    return choosedids; // 设置初始的已选的最近联系人
  }, [chooseUsers]);
  // 删除用户
  const deleteChooseUser = (id) => {
    setChooseUsers((pre) => pre.filter((item) => item.id !== id));
  };
  // 清空已选用户
  const clearChooseData = () => {
    if (corpInfo.type && corpInfo.type === '1') {
      setChooseUsers([currentUserInfo]);
    } else {
      setChooseUsers([]);
    }
  };
  // 进入通讯录详情
  const handleChangeDetail = (item) => {
    console.log(item);
    setShowPage(false);
  };
  const handleSetChooseUsers = (users) => {
    setChooseUsers(users);
  };
  const handleSetUserIds = (ruleIdList) => {
    setRuleIds(ruleIdList);
  };
  const handleChangeGroupName = (groupname) => {
    setGroupName(groupname);
  };
  // 监听已选人员的变化
  useEffect(() => {
    if (typeof onDataChange === 'function') {
      let responseData = {};
      if (corpInfo.type === '1') {
        responseData = {
          groupName,
          UserList: chooseUsers,
          ruleIds,
        };
      } else {
        responseData = {
          UserList: chooseUsers,
          ruleIds,
        };
      }
      onDataChange(responseData);
    }
    setNum();
  }, [chooseUsers, groupName, ruleIds]);
  // eslint-disable-next-line consistent-return
  const ShowPanel = () => {
    if (showPage) {
      // eslint-disable-next-line max-len
      return (
        <MainContent
          corpInfo={corpInfo}
          onChangeGroupName={handleChangeGroupName}
          chooseUsers={chooseUsers}
          onSetChooseUsers={handleSetChooseUsers}
          checkedUserList={checkedUserList}
          onChangeDetail={handleChangeDetail}
          currentuserInfo={currentUserInfo}
        />
      );
    }
    return (
      <DetailContent
        corpInfo={corpInfo}
        accesstoken={tooken}
        setShowPage={setShowPage}
        chooseUsers={chooseUsers}
        checkedUserList={checkedUserList}
        onSetChooseUsers={handleSetChooseUsers}
        onSetUserIds={handleSetUserIds}
        currentuserInfo={currentUserInfo}
      />
    );
  };
  return (
    // <ConfigProvider locale={locale}>
      <div className="main-panel">
        {/* <div className='main-header'>
          <div className="header-txt">发起快速应急处理</div>
          <CloseOutlined  className='header-close' onClick={() => deleteChooseUser()} />
        </div> */}
      <div className='main-box'>
        <div className="search-panel">
        <div className="searchinput">
            <SearchBar placeholder='搜索'
              onChange={val => handleSearch(val, tooken)}
              onSearch={text => handleSearch(text, tooken)}
            />

            {/* <SearchBar
              placeholder="搜索联系人、部门"
              onChange={event => handleSearch(event.target.value, tooken)}
              onSearch={text => handleSearch(text, tooken)}
            ></SearchBar> */}
          </div>
          {searchText ? (
            <SearchPanel
              corpInfo={corpInfo}
              chooseUsers={chooseUsers}
              onSetChooseUsers={handleSetChooseUsers}
              checkedUserList={checkedUserList}
              searchResult={searchResult}
              searchText={searchText}
              currentuserInfo={currentUserInfo}
            ></SearchPanel>
          ) : (
            <>{tooken && ShowPanel()}</>
          )}
        </div>
        {/* <div className="choose-panel">
          <div className="choose-title">
            <span>
              已选{chooseNum}人
            </span>
            <span className="clear-choose-data" onClick={clearChooseData}>
              清空
            </span>
          </div>
          <div className="choose-main">
            {chooseUsers &&
              chooseUsers.map(item => (
                <div className="selected-user" key={item.id}>
                  <span className="contentInfo">
                    <ActarBox item={item} />
                    <ActarName item={item} />
                  </span>
                  <span className="operateUser">
                    {corpInfo.type === '1' && item.id === currentUserInfo.id ? (
                      <span className="groupLeader">群主</span>
                    ) : (
                      <CloseCircleOutlined onClick={() => deleteChooseUser(item.id)} />
                    )}
                  </span>
                </div>
              ))}
          </div>
        </div> */}
      </div>
      <div className='main-footer'>
         <span>已选{chooseNum}人</span>
          <Button color='primary' size='small'>确定({chooseNum}/1000)</Button>
        </div>
      </div>
    // </ConfigProvider>
  );
}
