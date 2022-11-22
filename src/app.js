/*
 * @Author: gongxi33
 * @Date: 2022-08-20 17:03:00
 * @LastEditTime: 2022-08-29 23:44:20
 * @LastEditors: gongxi33
 * @Description:
 * @FilePath: /rail-all/src/app.js
 */
import { Component } from 'react';

import './app.scss';
// import 'taro-ui/dist/style/index.scss';
class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}
export default App;
