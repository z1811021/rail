import { useState, useEffect } from 'react';
import { View, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export default function Index() {
  function gotoMine() {
    Taro.navigateTo({
      url: '/pages/mine/index',
    });
  }
  function gotoAdd() {
    Taro.navigateTo({
      url: '/pages/add/index',
    });
  }
  return (
    <View className="home">
      <Button className="home_mine" onClick={gotoAdd}>
        新增设备
      </Button>
      <Button className="home_add" onClick={gotoMine}>
        设备列表
      </Button>
    </View>
  );
}
