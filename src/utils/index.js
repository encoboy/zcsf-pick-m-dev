export function getAvatarName(name) {
  if (name) {
    const firstChar = name.charCodeAt(0);
    // 如果第一个字符是英文，返回首字母
    if (firstChar < 255) {
      return name.charAt(0).toUpperCase();
    }
    if (isChinese(name)) {
      return name.length < 3 ? name : name.substring(name.length - 2);
    }
    // eslint-disable-next-line no-plusplus
    return name.charAt(0);
  }
  return '';
}
// 是否是纯中文
function isChinese(name) {
  let chinese = false; // true
  let englist = false; // true
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < name.length; i++) {
    if (name.charCodeAt(i) > 255) {
      chinese = true;
    } else {
      englist = true;
    }
  }
  if (chinese && englist) {
    return false;
  }
  return true;
}
