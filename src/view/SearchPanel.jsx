import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd-mobile';
import { getAvatarName } from '../utils/index';
import { ActarBox, ActarName } from './index';
/**
 * 通讯录展示组件-查询面板
 */
const SearchPanel = (props) => {
  // eslint-disable-next-line max-len
  const {
    corpInfo,
    checkedUserList,
    searchText,
    searchResult,
    chooseUsers,
    currentuserInfo,
    onSetChooseUsers,
  } = props;
  const [newResultList, setNewResultList] = useState([]);
  // 重新组织数据
  const setUserList = (users) => {
    const newusers = users.map((item) => ({
      ...item,
      AvatarName: getAvatarName(item.name),
    }));
    setNewResultList(newusers);
  };
  // 获取当前对象
  const getUserObj = (id) => searchResult.find((obj) => obj.id === id);

  // 单选项发生变化
  const handleUserItemChange = (e, id) => {
    if (e.target.checked) {
      onSetChooseUsers([...new Set([...chooseUsers, getUserObj(id)])]);
    } else {
      onSetChooseUsers(chooseUsers.filter((item) => item.id !== id));
    }
  };
  useEffect(() => {
    setUserList(searchResult);
  }, [searchResult]);
  return (
    <div className="detail-content">
      {newResultList.length === 0 && <div className="nodata-panel">暂无数据</div>}
      <Checkbox.Group value={checkedUserList} className="detail-select-panel detail-search-panel">
        {newResultList.map((item) => (
          <div className="detail-select-user" key={item.id}>
            <Checkbox
              value={item.id}
              className="select-user-check"
              disabled={
                corpInfo.type === '1' && item.id.toString() === currentuserInfo.id.toString()
              }
              onChange={e => handleUserItemChange(e, item.id)}
            ></Checkbox>
            <div className="choose-content">
              <span className="contentInfo">
                <ActarBox item={item} />
                <ActarName item={item} searchText={searchText} />
              </span>
            </div>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );
};

export default SearchPanel;
