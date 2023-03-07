import React, { useState, useEffect } from 'react';
import { RightOutline ,MovieOutline,PicturesOutline,DownOutline} from 'antd-mobile-icons';
import { Input, Checkbox, Avatar } from 'antd-mobile';
import { getAvatarName } from '../utils';
import { fetchRecentContacts } from '../apis/user';
import { ActarBox } from './index';
/**
 * 首页
 * @returns 首次渲染
 */
 const MainContent = (props) => {
  // eslint-disable-next-line max-len
  const {
    corpInfo,
    chooseUsers,
    checkedUserList,
    onSetChooseUsers,
    currentuserInfo,
    onChangeDetail,
  } = props;
  const [recentContact, setRecentContact] = useState([]);
  const [toggleContact, setToggleContact] = useState(false);
   
  useEffect(() => {
    getRecentContacts();
  }, []);

  const getRecentContacts = async () => {
    // const newdata = (await fetchRecentContacts());
    // const newusers = newdata.map((item) => ({
    //   ...item,
    //   AvatarName: getAvatarName(item.name),
    // }));
    const newusers = [ {
      id: 1,
      name: '郝敬伟一号',
      sex: '1',
      depName: '前端',
      position: 'uc线-前端工程师',
      src: '',
      isDep: false,
    },
    {
      id: 2,
      name: '郝敬伟一号',
      sex: '1',
      depName: '前端',
      position: 'uc线-前端工程师',
      src: '',
      isDep: false,
      },
    {
      id: 3,
      name: '郝敬伟一号',
      sex: '1',
      depName: '前端',
      position: 'uc线-前端工程师',
      src: '',
      isDep: false,
      },
    {
      id: 4,
      name: '郝敬伟一号',
      sex: '1',
      depName: '前端',
      position: 'uc线-前端工程师',
      src: '',
      isDep: false,
      },
    {
      id: 5,
      name: '郝敬伟一号',
      sex: '1',
      depName: '前端',
      position: 'uc线-前端工程师',
      src: '',
      isDep: false,
      },
    {
      id: 6,
      name: '郝敬伟一号',
      sex: '1',
      depName: '前端',
      position: 'uc线-前端工程师',
      src: '',
      isDep: false,
      },
    {
      id: 7,
      name: '郝敬伟一号',
      sex: '1',
      depName: '前端',
      position: 'uc线-前端工程师',
      src: '',
      isDep: false,
    },
    {
      id: 8,
      name: '郝敬伟二号',
      sex: '0',
      depName: '前端',
      position: 'uc线-前端工程师',
      src: '',
      isDep: false,
    },]

    setRecentContact(newusers);
  };
  // const isHaveUser = (id: any) => checkedUserList.includes(id);
  const [userlist] = useState([
    {
      id: 1,
      icon: '',
      title: '组织通讯录',
    },
    {
      id: 2,
      icon: '',
      title: '事件干系人',
    },
  ]);
  // 获取当前对象
   const getUserObj = (id) => recentContact.find(obj => obj.id === id);
   

  // const getAllUserObj = (id) => recentContact.find(obj => obj.id === id);


  // 单选全选项发生变化
   const handleUserItemChange = (e, id) => {
     if (typeof id == 'number') {
      //  单选
       if (e) {
          console.log([...chooseUsers, getUserObj(id)])
          onSetChooseUsers([...new Set([...chooseUsers, getUserObj(id)])]);
        } else {
          onSetChooseUsers(chooseUsers.filter((item) => item.id !== id));
        }
     } else {
      //  全选
       if (e) {
         console.log([...chooseUsers, id])
        onSetChooseUsers([...new Set([...chooseUsers, ...id])]);
       } else {
         onSetChooseUsers(chooseUsers.filter((item) => {
           const index = recentContact.findIndex(val => val.id == item.id)
           return index > -1 ? false : true
        }));
       }
     }
  };
   
  // 展开收起 事件干系人
  const handleContact = () => {
    setToggleContact(!toggleContact)
  }
 
  return (
    <div className="main-content">
      <div className="left-address-entry">
        {userlist.map((item) => (
          <div key={item.id} className="address-entry" onClick={() => item.id === 1 ? onChangeDetail(item) : handleContact()}>
            <div className='address-info'>
              {item.id === 1 && (
                <Avatar className="rlyzzjg" style={{ '--size': '24px' }}>
                  <MovieOutline />
                </Avatar>
              )}
              {item.id === 2 && (
                <Avatar className="myfriend" style={{ '--size': '24px' }}>
                  <PicturesOutline />
                </Avatar>
              )}
              <span >{item.title}</span>
            </div>
            <div className="address-entry-todetail">
               {
                toggleContact && item.id === 2?<DownOutline /> :<RightOutline />
              }
            </div>
          </div>
        ))}
      </div>
      {
         toggleContact &&  <div className="left-recent-contact">
          {recentContact.length === 0 && <div className="nodata-panel">暂无数据</div>}
          <Checkbox
            className="AvatarBox"
            indeterminate={checkedUserList.length > 0 && checkedUserList.length < recentContact.length}
            checked={checkedUserList.length === recentContact.length}
            onChange={checked => handleUserItemChange(checked,recentContact)}
          >
            全选
          </Checkbox>
        <Checkbox.Group
          style={{ width: '100%' }}
          value={checkedUserList}
          className="contactContent"
        >
          {recentContact.map((item) => (
            <Checkbox
              value={item.id}
              className="AvatarBox"
              key={item.id}
              onChange={e => handleUserItemChange(e, item.id)}
              disabled={corpInfo.type === '1' && item.id === currentuserInfo.id}
            >
              <div className='check-item'>
                <ActarBox item={item} />
                <span className="avatar-info">
                  <span className="avatarName">{item.name}</span>
                  <span className="avatarDepart">{item.position}</span>
                </span>
              </div>
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>
      }
      {/* <div className="left-group-name">
        <div className="contactTitle">
          群名称<span className="chooseWrite"> - 选填</span>
        </div>
        <Input placeholder="取个群名称" onChange={changeGroupName}></Input>
      </div> */}
    </div>
  );
 };



export default MainContent;
