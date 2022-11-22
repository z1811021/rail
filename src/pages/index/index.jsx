import { View, Image, Button, Input } from '@tarojs/components';
// import { ScrollView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Taro from '@tarojs/taro';
import JSEncrypt from 'jsencrypt';
import { AtForm, AtInput, AtMessage, AtButton } from 'taro-ui';
import { axios } from 'taro-axios';
import { useState, useEffect } from 'react';
import { apiDomain } from '../../../config/buildConfig';
import sleep from '../../utils/sleep';
import logo from '../../attch/logo.jpeg';
import './index.scss';

export default function Index() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  useEffect(() => {
    DeviceInfo.isHeadphonesConnected().then((enabled) => {
      console.log('🚀 ~ file: index.jsx ~ line 19 ~ DeviceInfo.isHeadphonesConnected ~ enabled', enabled)
      // true or false
    });
  }, []);
  function changeUserName(val) {
    setUsername(val);
  }
  function changePassword(val) {
    setPassword(val);
  }
  // 加密
  // publicKey传入的是公钥，用于加密
  // data为需要加密的数据
  function encryptedData(publicKey, data) {
    // 新建JSEncrypt对象
    let encryptor = new JSEncrypt();
    // 设置公钥
    encryptor.setPublicKey(publicKey);
    // 加密数据
    var encryptedData = encryptor.encrypt(data);
    return encryptedData;
  }
  async function submit() {
    if (username && password) {
      console.log(`${apiDomain}/jwt/login`);
      const keyObject = await axios.post(`${apiDomain}/jwt/getkey`);
      console.log(
        '🚀 ~ file: index.jsx ~ line 31 ~ submit ~ keyObject',
        keyObject,
      );
      const publickey = keyObject.data.publickey,
        keyUsername = encryptedData(publickey, username),
        keyPassword = encryptedData(publickey, password);

      const res = await axios.post(`${apiDomain}/jwt/login`, {
        username: keyUsername,
        password: keyPassword,
      });
      console.log('🚀 ~ file: index.jsx ~ line 29 ~ submit ~ res', res);
      if (res?.data?.code === 0 && res?.data?.token) {
        Taro.atMessage({
          message: '登陆成功',
          type: 'success',
        });
        Taro.setStorage({
          key: 'info',
          data: {
            token: res?.data?.token,
            username,
          },
        });
        await sleep(1000);
        Taro.reLaunch({
          url: '/pages/home/index',
        });
      } else {
        Taro.atMessage({
          message: res?.data?.msg || '网络有误，请稍后再试',
          type: 'error',
        });
      }
    }
  }
  return (
    <View className="index">
      <AtMessage />
      <View className="header">电气化铁路柔性接触网索</View>
      <View className="headerSub">故障监测及预警系统</View>
      <View className="headerSub2">
        <Image src={logo} style="width:30px" mode="widthFix" />
        <View className="headerSub2_title">手持安全终端</View>
      </View>
      <View style="height: 116px; background: transparent">
        <AtForm onSubmit={() => submit()}>
          <AtInput
            name="value"
            title="用户名"
            type="text"
            placeholder="请输入用户名"
            value={username}
            onChange={val => changeUserName(val)}
          />
          <AtInput
            name="password"
            title="密码"
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={val => changePassword(val)}
          />
          <Button
            className={
              username && password ? 'submitButton' : 'submitButtonEmpty'
            }
            formType="submit"
          >
            登录
          </Button>
        </AtForm>
      </View>
    </View>
  );
}
