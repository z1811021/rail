/*
 * @Author: gongxi33
 * @Date: 2022-04-30 18:17:20
 * @LastEditTime: 2022-08-26 02:03:12
 * @LastEditors: gongxi33
 * @Description:
 * @FilePath: /rail-all/src/utils/sleep.js
 */
export default function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
