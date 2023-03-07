import React, { useEffect, useState, useMemo } from 'react';
// import { PartitionOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd-mobile';
// import InfiniteScroll from 'react-infinite-scroller';
import { getAvatarName } from '../utils/index';
import { fetchDepartAndUserInfo } from '../apis/user';
// import level from './assets/level.png';
// import disabled from './assets/disablelevel.png';
import { ActarBox, ActarName } from './index';
/**
 * 通讯录展示组件-通讯录面板
 */
 const DetailContent = (props) => {
  // eslint-disable-next-line max-len
  const {
    chooseUsers,
    checkedUserList,
    onSetChooseUsers,
    onSetUserIds,
    currentuserInfo,
    setShowPage,
    corpInfo,
    accesstoken,
  } = props;
  const [userList, setUserList] = useState([]);
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  const [checkAll, setCheckAll] = useState(false); // 是否全选
  // 重新组织数据
  const getNewList = (users, departs) => {
    const newusers = users
      ? users.map((item) => ({
          id: parseInt(item.uid),
          name: item.unm,
          sex: item.sex,
          depName: item.dnm,
          position: item.up,
          src: item.url,
          isDep: false,
          account: item.account,
          AvatarName: getAvatarName(item.unm),
        }))
      : [];
    const newdeparts = departs
      ? departs.map((item) => ({
          id: parseInt(item.did),
          name: item.dnm,
          sex: '0',
          position: '',
          src: '',
          isDep: true,
          account: '',
          depNo: item.depNo,
          depName: item.dnm,
          AvatarName: getAvatarName(item.dnm),
        }))
      : [];

    return [...newusers, ...newdeparts];
  };
  // 滚动加载(暂时不用)
  // const handleInfiniteOnLoad = (page: any) => {
  //   console.log(page);
  // };
  // 获取当前对象
  const getUserObj = (id) => userList.find((obj) => obj.id === id);

  // let ruleIdList: any[] = [];
  // 获取当前组织机构信息
  const getDepartAndUserInfo = async (params) => {
    const { crumbs, personAll, depart, ruleIds } = await fetchDepartAndUserInfo(params, corpInfo);
    if (corpInfo.type === '1') {
      const newCrumbs = crumbs.reverse();
      newCrumbs.unshift({
        departId: -1,
        departName: '联系人',
        parentId: null,
      });
      setBreadcrumbList(newCrumbs);
    } else {
      // 将面包屑反转
      setBreadcrumbList(crumbs.reverse());
    }
    onSetUserIds(ruleIds);
    // ruleIdList =ruleIds ;
    // setDepartList(getNewList(depart))
    setUserList(getNewList(personAll, depart));
  };
  // 单选项发生变化
  const handleUserItemChange = (e, id) => {
    if (e.target.checked) {
      onSetChooseUsers([...new Set([...chooseUsers, getUserObj(id)])]);
    } else {
      onSetChooseUsers(
        chooseUsers.filter((item) => item.id !== id),
        // ruleIdList,
      );
    }
  };
  // 获取当前列表的用户id
  const userIds = useMemo(() => {
    const userids = userList ? userList.map((item) => item.id) : [];
    return new Set(userids); // 设置初始的已选的最近联系人
  }, [userList]);
  // 更新全选选中状态
  const setIntersectionAction = () => {
    // eslint-disable-next-line max-len
    const intersection = checkedUserList
      ? checkedUserList.filter((item) => userIds.has(item))
      : [];
    // 更改通讯录全选框选中状态
    if (intersection.length === userList.length && userList.length > 0) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  };
  // 更改面包屑
  const changeBreadcrumb = (item) => {
    // eslint-disable-next-line no-empty
    if (item.departId === -1) {
      setShowPage(true);
    } else {
      getDepartAndUserInfo({
        accesstoken,
        departId: item.departId, // 父级部门id
      });
    }
  };
  useEffect(() => {
    if (corpInfo.corpId && corpInfo.corpSecret) {
      getDepartAndUserInfo({
        accesstoken,
        departId: null, // 父级部门id
      });
    }
  }, []);
  // 根据选中人数，更新全选状态
  useEffect(() => {
    setIntersectionAction();
  }, [chooseUsers, userList]);
  // 如果已选中，禁止点击下级；选中，获取当前节点下级数据
  const checkSelected = (item) => {
    if (!checkedUserList.includes(item.id)) {
      getDepartAndUserInfo({
        accesstoken,
        departId: item.id, // 父级部门id
      });
    }
    return false;
  };
  const isHaveUser = (id) => checkedUserList && checkedUserList.includes(id);
  // 选中全部
  const onChooseUsers = (checked) => {
    if (checked) {
      userList.forEach((item) => {
        if (!isHaveUser(item.id)) {
          // 选中全部
          onSetChooseUsers((pre) => [...pre, getUserObj(item.id)]);
        }
      });
    } else {
      userList.forEach((item) => {
        if (!(corpInfo.type === '1' && item.id === currentuserInfo.id)) {
          // 取消选中全部
          onSetChooseUsers((pre) => pre.filter((user) => user.id !== item.id));
        }
      });
    }
  };
  const handleCheckAllChange = (e) => {
    setCheckAll(e.target.checked); // 设置全选
    onChooseUsers(e.target.checked);
  };
  return (
    <div className="detail-content">
      {/* <Breadcrumb className="detail-content-breadcrumb">
        {breadcrumbList &&
          breadcrumbList.map((item) => (
            <Breadcrumb.Item key={item}>
              <span style={{ cursor: 'pointer' }} onClick={() => changeBreadcrumb(item)}>
                {item.departName}
              </span>
            </Breadcrumb.Item>
          ))}
      </Breadcrumb> */}
      <div className="detail-list">
        {userList.length > 0 && (
          <div className="detail-select-allUser">
            <Checkbox onChange={handleCheckAllChange} checked={checkAll}>
              全选
            </Checkbox>
          </div>
        )}
        {userList.length === 0 && <div className="nodata-panel">暂无数据</div>}
        <div className="detail-infiniteScroll-panel">
          {/* <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={handleInfiniteOnLoad}
            hasMore={false}
            useWindow={false}
          > */}
          <Checkbox.Group
            value={checkedUserList}
            // onChange={onUserChange}
            className="detail-select-panel"
          >
            {userList &&
              userList.map((item) => (
                <div className="detail-select-user" key={item.id}>
                  <Checkbox
                    value={item.id}
                    disabled={corpInfo.type === '1' && item.id === currentuserInfo.id}
                    className="select-user-check"
                    onChange={e => handleUserItemChange(e, item.id)}
                  ></Checkbox>
                  <div className="choose-content">
                    <span className="contentInfo">
                      <ActarBox item={item} />
                      <ActarName item={item} />
                    </span>
                    {item.isDep && (
                      <span
                        className={isHaveUser(item.id) ? 'detail-panel-disable' : 'detail-panel'}
                        onClick={() => checkSelected(item)}
                      >
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-Level"></use>
                        </svg>
                        <span className="toDetail">下级</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </Checkbox.Group>
          {/* </InfiniteScroll> */}
        </div>
      </div>
    </div>
  );
 };


export default DetailContent;
