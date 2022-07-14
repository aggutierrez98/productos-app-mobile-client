import React from 'react';
import {View} from 'react-native';
import Text from '../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {componentStyles} from './styles';

export const Logo = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: '#F66B0E',
          fontSize: 30,
          fontFamily: 'RobotoCondensed-Bold',
          marginRight: 15,
          ...componentStyles.textShadowStyle,
        }}>
        PRODUCTS APP
      </Text>
      <Icon
        style={{paddingBottom: 7.5, ...componentStyles.textShadowStyle}}
        name="card-giftcard"
        size={70}
        color="#F66B0E"
      />
    </View>
  );
};
