import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Button, Picker, Text } from '@tarojs/components';
import { AtForm, AtInput, AtButton, AtList, AtListItem } from 'taro-ui';
import { apiDomain } from '../../../config/buildConfig';
import { axios } from 'taro-axios';
import sleep from '../../utils/sleep';
import './index.scss';

export default function Index() {
  const [inputInfo, setInputInfo] = useState({
    wireType: '',
    pointType: '',
    lineType: '',
    placeType: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  useEffect(() => {
    if (Taro.getCurrentInstance()?.router?.params.id) {
      Taro.getStorage({
        key: 'item',
        success: function(res) {
          Taro.removeStorage({
            key: 'item',
            success: function(res2) {
              console.log(
                '๐ ~ file: index.jsx ~ line 34 ~ useEffect ~ res',
                res,
              );
              setInputInfo(res.data);
            },
          });
        },
      });
    }
  }, []);
  function takePhoto(key) {
    // ๅชๅ่ฎธไป็ธๆบๆซ็ 
    Taro.scanCode({
      onlyFromCamera: true,
      success: res => {
        setInputInfo(Object.assign({}, inputInfo, { [key]: res.result }));
      },
    });
  }
  function changeVal(key, value) {
    setInputInfo(Object.assign({}, inputInfo, { [key]: value }));
  }
  function changeSelectorVal(type, e) {
    console.log(
      '๐ ~ file: index.jsx ~ line 29 ~ changeSelectorVal ~ e',
      e.detail.value,
    );
    setInputInfo(
      Object.assign({}, inputInfo, { [type]: e.detail.value == 0 ? 10 : 20 }),
    );
  }
  function getLong() {
    if (inputInfo?.longitude !== undefined) {
      console.log(inputInfo.longitude + ', ' + inputInfo.latitude);
      return inputInfo.longitude + ', ' + inputInfo.latitude;
    } else {
      if (!Taro.getCurrentInstance()?.router?.params.id) {
        Taro.getLocation({
          type: 'wgs84',
          success: function(res) {
            console.log('๐ ~ file: index.jsx ~ line 50 ~ getLong ~ res', res);
            setInputInfo(
              Object.assign({}, inputInfo, {
                longitude: res.longitude,
                latitude: res.latitude,
              }),
            );
            return `${res.longitude}, ${res.latitude}`;
          },
          fail: async function(res) {
            Taro.showToast({
              title: '่ฏทๆๅผๅฐ็ไฝ็ฝฎไปฅไพฟๆฅ่ฏขๆจ็ๅๆ ',
              icon: 'error',
              duration: 2000,
            });
            await sleep(1500);
            Taro.reLaunch({
              url: '/pages/home/index',
            });
          },
        });
      }
    }
  }
  function backTest() {
    Taro.reLaunch({
      url: '/pages/home/index',
    });
  }
  async function submit() {
    console.log(
      '๐ ~ file: index.jsx ~ line 88 ~ submit ~ inputInfo',
      inputInfo,
    );
    const validateArr = [
      ['่ฎพๅคๅท', 'deviceNum'],
      ['้ๆฎตๅท', 'anchorNum'],
      ['ๆๅท', 'rodNum'],
      ['ๅ ็ ฃ้ซๅบฆ', 'weightHeight'],
      ['ๆฎๅฐ้ซๅบฆ', 'groundHeight'],
      ['้่ทฏๆนๅ', 'lineType'],
      ['็บฟ็ผ็ฑปๅ', 'wireType'],
      ['็บฟ็ผไฝ็ฝฎ', 'pointType'],
      ['ๅฎ่ฃไฝ็ฝฎ', 'placeType'],
    ];
    for (let i of validateArr) {
      const key = i[1];
      const name = i[0];
      if (!inputInfo[key]) {
        Taro.showToast({
          title: name + 'ไธ่ฝไธบ็ฉบ',
          icon: 'error',
          duration: 2000,
        });
        return;
      }
    }
    if (
      isNaN(Number(inputInfo.weightHeight)) ||
      isNaN(Number(inputInfo.groundHeight))
    ) {
      Taro.showToast({
        title: 'ๅ ็ ฃ้ซๅบฆๆๆฎๅฐ้ซๅบฆ่ฏท่พๅฅๆฐๅญ',
        icon: 'error',
        duration: 2000,
      });
      return;
    }
    if (
      Number(inputInfo.weightHeight) < 50 ||
      Number(inputInfo.weightHeight) > 500
    ) {
      Taro.showToast({
        title: 'ๅ ็ ฃ้ซๅบฆไธ่ฝๅคงไบ500ๆๅฐไบ50',
        icon: 'error',
        duration: 2000,
      });
      return;
    }
    if (
      Number(inputInfo.groundHeight) < 10 ||
      Number(inputInfo.groundHeight) > 450
    ) {
      Taro.showToast({
        title: 'ๅ ็ ฃ้ซๅบฆไธ่ฝๅคงไบ450ๆๅฐไบ10',
        icon: 'error',
        duration: 2000,
      });
      return;
    }
    Taro.getStorage({
      key: 'info',
      success: async function(res) {
        console.log(res.data.token);
        try {
          setIsLoading(true);
          setIsDisabled(true);
          const resData = await axios.post(
            `${apiDomain}/api/device/${
              Taro.getCurrentInstance()?.router?.params.id ? 'edit' : 'add'
            }`,
            inputInfo,
            {
              withCredentials: false, // ่ทจๅๆไปฌๆๆถ false
              headers: {
                token: res?.data?.token || '',
              },
            },
          );
          console.log(
            '๐ ~ file: index.jsx ~ line 76 ~ success:function ~ resData',
            resData,
          );
          if (resData.data.code === 0) {
            setIsLoading(false);
            setIsDisabled(false);
            Taro.showToast({
              title: resData.data.msg,
              icon: 'success',
              duration: 2000,
            });
            await sleep(1500);
            Taro.reLaunch({
              url: '/pages/home/index',
            });
          } else {
            setIsLoading(false);
            setIsDisabled(false);
            Taro.showToast({
              title: resData.data.msg,
              icon: 'error',
              duration: 2000,
            });
            // await sleep(1500);
            // Taro.redirectTo({
            //   url: '/pages/home/index',
            // });
          }
        } catch (e) {
          setIsLoading(false);
          setIsDisabled(false);
          Taro.showToast({
            title: '็ฝ็ปๆณขๅจ่ฏท็จๅๅ่ฏ',
            icon: 'error',
            duration: 2000,
          });
          await sleep(1500);
          Taro.reLaunch({
            url: '/pages/index/index',
          });
        }
      },
      fail: async function() {
        setIsLoading(false);
        setIsDisabled(false);
        Taro.showToast({
          title: '็ปๅฝ่ฟๆ๏ผ ่ฏท้ๆฐ็ปๅฝ',
          icon: 'warn',
          duration: 2000,
        });
        await sleep(1500);
        Taro.reLaunch({
          url: '/pages/index/index',
        });
      },
    });
  }
  return (
    <View className="add">
      <AtForm>
        <AtInput
          title="่ฎพๅคๅท"
          className="add_order_input"
          type="text"
          placeholder="่ฏท้่ฟ็ธๆบๆซๆ"
          value={inputInfo?.deviceNum || ''}
          onChange={val => changeVal('deviceNum', val)}
        >
          <Button
            className="photo_button"
            onClick={() => takePhoto('deviceNum')}
          >
            ๆซ็ 
          </Button>
        </AtInput>
        <AtInput
          title="้ๆฎตๅท"
          type="text"
          placeholder="่ฏท้่ฟ็ธๆบๆซๆ"
          value={inputInfo?.anchorNum || ''}
          onChange={val => changeVal('anchorNum', val)}
          className="add_order_input"
        >
          <Button
            className="photo_button"
            onClick={() => takePhoto('anchorNum')}
          >
            ๆซ็ 
          </Button>
        </AtInput>
        <AtInput
          title="ๆๅท"
          type="text"
          placeholder="่ฏท้่ฟ็ธๆบๆซๆ"
          value={inputInfo?.rodNum || ''}
          onChange={val => changeVal('rodNum', val)}
          className="add_order_input"
        >
          <Button className="photo_button" onClick={() => takePhoto('rodNum')}>
            ๆซ็ 
          </Button>
        </AtInput>
      </AtForm>
      <View className="add_order_list_space_height"></View>
      <Picker
        mode="selector"
        range={['ๆฅ่งฆ็บฟ', 'ๆฟๅ็ดข']}
        onChange={val => changeSelectorVal('wireType', val)}
        className="page-section"
        value={
          inputInfo?.wireType
            ? inputInfo?.wireType == 10
              ? 'ๆฅ่งฆ็บฟ'
              : 'ๆฟๅ็ดข'
            : ''
        }
      >
        <View className="picker">
          ้ๆฉ็บฟ็ผ็ฑปๅ๏ผ
          {inputInfo?.wireType
            ? inputInfo?.wireType == 10
              ? 'ๆฅ่งฆ็บฟ'
              : 'ๆฟๅ็ดข'
            : ''}
        </View>
      </Picker>
      <View className="add_order_list_space_height"></View>
      <Picker
        mode="selector"
        range={['ๅคด็ซฏ', 'ๅฐพ็ซฏ']}
        onChange={val => changeSelectorVal('pointType', val)}
        className="page-section"
        value={
          inputInfo?.pointType
            ? inputInfo?.pointType == 10
              ? 'ๅคด็ซฏ'
              : 'ๅฐพ็ซฏ'
            : ''
        }
      >
        <View className="picker">
          ้ๆฉ็บฟ็ผไฝ็ฝฎ๏ผ
          {inputInfo?.pointType
            ? inputInfo?.pointType == 10
              ? 'ๅคด็ซฏ'
              : 'ๅฐพ็ซฏ'
            : ''}
        </View>
      </Picker>
      <View className="add_order_list_space_height"></View>
      <Picker
        mode="selector"
        range={['ไธ่ก', 'ไธ่ก']}
        onChange={val => changeSelectorVal('lineType', val)}
        className="page-section"
        value={
          inputInfo?.lineType
            ? inputInfo?.lineType == 10
              ? 'ไธ่ก'
              : 'ไธ่ก'
            : ''
        }
      >
        <View className="picker">
          ้ๆฉ้่ทฏๆนๅ๏ผ
          {inputInfo?.lineType
            ? inputInfo?.lineType == 10
              ? 'ไธ่ก'
              : 'ไธ่ก'
            : ''}
        </View>
      </Picker>
      <View className="add_order_list_space_height"></View>
      <Picker
        mode="selector"
        range={['ๆทๅค', '้ง้ๅ']}
        onChange={val => changeSelectorVal('placeType', val)}
        className="page-section"
        value={
          inputInfo?.placeType
            ? inputInfo?.placeType == 10
              ? 'ๆทๅค'
              : '้ง้ๅ'
            : ''
        }
      >
        <View className="picker">
          ้ๆฉๅฎ่ฃไฝ็ฝฎ๏ผ
          {inputInfo?.placeType
            ? inputInfo?.placeType == 10
              ? 'ๆทๅค'
              : '้ง้ๅ'
            : ''}
        </View>
      </Picker>
      <View className="add_order_list_space_height"></View>
      <AtForm>
        <AtInput
          title="ๅ ็ ฃ้ซๅบฆ"
          type="number"
          placeholder="ๅ ็ ฃ้กถ็ซฏ่ทๅฐ้ซๅบฆ"
          value={inputInfo?.weightHeight || ''}
          onChange={val => changeVal('weightHeight', val)}
          className="add_order_input"
        >
          <View>ๅ็ฑณ</View>
        </AtInput>
        <AtInput
          title="่ทๅฐ้ซๅบฆ"
          type="number"
          placeholder="ๅ ็ ฃๅบ็ซฏ่ทๅฐ้ซๅบฆ"
          value={inputInfo?.groundHeight || ''}
          onChange={val => changeVal('groundHeight', val)}
          className="add_order_input"
        >
          <View>ๅ็ฑณ</View>
        </AtInput>
        <AtInput
          title="็ป็บฌๅบฆ"
          type="text"
          placeholder=""
          value={getLong()}
          disabled
          className="add_order_input_long"
        />
      </AtForm>
      <View className="add_order_list_space_height"></View>
      <View className="add_order_list_button">
        <Button className="add_order_list_button_back" onClick={backTest}>
          ่ฟๅ
        </Button>
        <Button
          className="add_order_list_button_submit"
          onClick={submit}
          loading={isLoading}
          disabled={isDisabled}
        >
          ็กฎ่ฎค
        </Button>
      </View>
      <View className="add_order_list_space_height"></View>
    </View>
  );
}
