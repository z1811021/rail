import { useState, useEffect } from 'react';
import { View, Text, Button, Picker, ScrollView } from '@tarojs/components';
import { axios } from 'taro-axios';
import Taro from '@tarojs/taro';
import { AtList, AtListItem, AtInput, AtMessage, AtForm } from 'taro-ui';
import { apiDomain } from '../../../config/buildConfig';
import sleep from '../../utils/sleep';
import './index.scss';

export default function Index() {
  const [dateSel, setDateSel] = useState('');
  const [dateSelEnd, setDateSelEnd] = useState('');
  // const [value, setVal] = useState('')
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  useEffect(() => {
    Taro.getStorage({
      key: 'info',
      success: async function(res) {
        console.log(res.data.token);
        setToken(res.data.token);
        await handleSearch(pageIndex, false, res.data.token);
        console.log(
          'π ~ file: index.jsx ~ line 24 ~ success:function ~ pageIndex',
          pageIndex,
        );
      },
      fail: async function() {
        Taro.atMessage({
          message: 'η»ε½θΏζοΌ θ―·ιζ°η»ε½',
          type: 'warn',
        });
        await sleep(1500);
        Taro.reLaunch({
          url: '/pages/index/index',
        });
      },
    });
  }, []);
  function onDateChange(val) {
    console.log('π ~ file: index.jsx ~ line 10 ~ onDateChange ~ val', val);
    setDateSel(val.detail.value);
  }
  // function handleChangeVal(val) {
  //   console.log('π ~ file: index.jsx ~ line 15 ~ handleChangeVal ~ val', val)
  //   setVal(val)
  // }
  function onDateChangeEnd(val) {
    console.log('π ~ file: index.jsx ~ line 10 ~ onDateChange ~ val', val);
    setDateSelEnd(val.detail.value);
  }

  const scrollToLower = () => {
    console.log(1);
    handleSearch(pageIndex, false.valueOf, token);
  };
  const search = () => handleSearch(pageIndex, true, token);
  async function handleSearch(index, isNewSearch, key) {
    const params = {
      // scanNum: value,
      // startDate: dateSel,
      // endDate: dateSelEnd,
      pageNum: isNewSearch ? '1' : String(index),
      pageSize: '10',
      isAsc: true,
    };
    console.log(
      'π ~ file: index.jsx ~ line 65 ~ handleSearch ~ params',
      params,
    );
    try {
      console.log(1);
      console.log(key);
      const resData = await axios.post(`${apiDomain}/api/device/list`, params, {
        withCredentials: false, // θ·¨εζδ»¬ζζΆ false
        headers: {
          'Content-Type': 'application/json',
          token: key,
        },
      });
      console.log(
        'π ~ file: index.jsx ~ line 73 ~ handleSearch ~ resData',
        resData,
      );
      if (resData.data.code === 0 && resData?.data?.rows.length !== 0) {
        isNewSearch
          ? setData(resData?.data?.rows)
          : setData(prev => [...prev, ...resData?.data?.rows]);
        isNewSearch ? setPageIndex(2) : setPageIndex(prev => prev + 1);
      } else if (resData.data.code == 500) {
        Taro.atMessage({
          message: resData.data.msg,
          type: 'error',
        });
        await sleep(1500);
        Taro.reLaunch({
          url: '/pages/home/index',
        });
      }
    } catch (e) {
      Taro.atMessage({
        message: 'η½η»ζ³’ε¨θ―·η¨εεθ―',
        type: 'error',
      });
      await sleep(1500);
      Taro.reLaunch({
        url: '/pages/index/index',
      });
    }
  }
  function getStatus(val) {
    console.log('π ~ file: index.jsx ~ line 111 ~ getStatus ~ val', val);
    switch (val) {
      case '10':
        return <View className="mine_item_text_suc">ηΆζ: ζ­£εΈΈ</View>;
        break;
      case '20':
        return <View className="mine_item_text_warn">ηΆζ: ι’θ­¦</View>;
        break;
      case '30':
        return <View className="mine_item_text_alert">ηΆζ: ζ₯θ­¦</View>;
        break;
      case '99':
        return <View className="mine_item_text">ηΆζ: η¦»ηΊΏ</View>;
        break;
      default:
        return <View className="mine_item_text">ηΆζ: ζ </View>;
        break;
    }
  }
  function update(item) {
    Taro.navigateTo({
      url: '/pages/add/index?id=' + item.id,
    });
    Taro.setStorage({
      key: 'item',
      data: item,
    });
  }
  return (
    <View className="mine">
      <AtMessage />
      {/* <View className="mine_date_start">
          <Picker mode="date" onChange={onDateChange}>
            <AtList>
              <AtListItem title="θ―·ιζ©εΌε§ζ₯ζ" extraText={dateSel} />
            </AtList>
          </Picker>
        </View>
        <View className="mine_date_end">
          <Picker mode="date" onChange={onDateChangeEnd}>
            <AtList>
              <AtListItem title="θ―·ιζ©η»ζζ₯ζ" extraText={dateSelEnd} />
            </AtList>
          </Picker>
        </View>
        <View>
          <Button onClick={search} className="mine_search_button">
            ζη΄’
          </Button>
        </View> */}
      <ScrollView
        scrollY
        lowerThreshold={100}
        onScrollToLower={scrollToLower}
        className="mine_scroll"
        scrollWithAnimation
      >
        {data &&
          data.map((item, index) => {
            return (
              <View className="mine_item_con" key={index}>
                <View className="mine_item_con_flex">
                  <View className="mine_item_text">
                    θ?Ύε€ε·:
                    <Text className="mine_item_text">
                      {item?.deviceNum || ''}
                    </Text>
                  </View>
                  <Button onClick={() => update(item)}>δΏ?ζΉ</Button>
                </View>
                <View className="mine_item_text">
                  ιζ?΅:
                  <Text className="mine_item_text">
                    {item?.anchorNum || ''}
                  </Text>
                </View>
                <View className="mine_item_text">
                  ζε·:
                  <Text className="mine_item_text">{item?.rodNum || ''}</Text>
                </View>
                <View className="mine_item_text">
                  {item?.wireType === 10
                    ? 'ηΊΏηΌη±»ε: ζ₯θ§¦η½'
                    : item?.wireType === 20
                    ? 'ηΊΏηΌη±»ε: ζΏεη΄’'
                    : 'ηΊΏηΌη±»ε: ζ₯θ§¦η½'}
                </View>
                <View className="mine_item_text">
                  {item?.pointType === 10
                    ? 'ηΊΏηΌδ½η½?: ε€΄η«―'
                    : item?.pointType === 20
                    ? 'ηΊΏηΌδ½η½?: ε°Ύη«―'
                    : 'ηΊΏηΌδ½η½?: ε€΄η«―'}
                </View>
                <View className="mine_item_text">
                  {item?.lineType === 10
                    ? 'ιθ·―ζΉε: δΈθ‘'
                    : item?.lineType === 20
                    ? 'ιθ·―ζΉε: δΈθ‘'
                    : 'ιθ·―ζΉε: δΈθ‘'}
                </View>
                <View className="mine_item_text">
                  {item?.placeType === 10
                    ? 'ε?θ£δ½η½?: ζ·ε€'
                    : item?.placeType === 20
                    ? 'ιθ·―ζΉε: ι§ιε'
                    : 'ιθ·―ζΉε: ζ·ε€'}
                </View>
                <View className="mine_item_text">
                  {item?.weightHeight ? `ε η £ι«εΊ¦: ${item?.weightHeight}` : ''}
                </View>
                <View className="mine_item_text">
                  {item?.groundHeight ? `ζ?ε°ι«εΊ¦: ${item?.groundHeight}` : ''}
                </View>
                <View className="mine_item_text">
                  {item?.createAt ? `εΌε§ζΆι΄: ${item?.createAt}` : ''}
                </View>
                <View className="mine_item_text">
                  {item?.updateAt ? `ζ΄ζ°ζΆι΄: ${item?.updateAt}` : ''}
                </View>
                <View className="mine_item_text">
                  {item?.longitude
                    ? `η»ηΊ¬εΊ¦: ${item?.longitude || ''} , ${item?.latitude ||
                        ''}`
                    : ''}
                </View>
                {item?.status ? getStatus(item?.status) : ''}
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}
