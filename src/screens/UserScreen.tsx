import {Picker} from '@react-native-picker/picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FadeInImage} from '../components/FadeInImage';
import {componentStyles} from '../components/styles';
import {useUser} from '../hooks/useUser';
import {UsersStackParams} from '../navigator/UsersNavigator';
import {Loading} from './Loading';
import Text from '../components/CustomText';
import {ModalEditPhoto} from '../components/ModalEditPhoto';

interface Props
  extends NativeStackScreenProps<UsersStackParams, 'UserScreen'> {}

export const UserScreen = ({
  route: {
    params: {id: idFromParams = '', name: nameFromParams = ''},
  },
  navigation,
}: Props) => {
  const {
    loading,
    loadingMutation,
    refreshing,
    modalVisible,
    tempImage,
    user,
    roles,
    openModal,
    closeModal,
    refetchUser,
    onChange,
    updateUserFunction,
    takePhoto,
    takePhotoFromGallery,
  } = useUser(idFromParams, nameFromParams);

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetchUser}
            progressViewOffset={10}
            progressBackgroundColor="#205375"
            colors={['#EFEFEF', '#F66B0E']}
          />
        }>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#EFEFEF"
              style={{
                height: 280,
              }}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={componentStyles.avatarContainer}
              onPress={() => {
                openModal();
              }}>
              <FadeInImage
                source={
                  tempImage || user?.image
                    ? {
                        uri: tempImage?.uri || user?.image,
                      }
                    : require('../assets/avatar-placeholder.png')
                }
                style={componentStyles.avatar}
              />
            </TouchableOpacity>
          )}

          <Text style={styles.label}>User Email:</Text>
          <Text style={styles.emailLabel}>{user.email}</Text>

          <Text style={styles.label}>User Name</Text>
          <TextInput
            placeholder="Usuario"
            style={styles.textInput}
            placeholderTextColor="#b5b5b5"
            value={user?.name}
            onChangeText={value => onChange(value, 'name')}
          />
          <Text style={styles.label}>Seleccione el rol</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={user?.role}
              style={styles.pickerStyle}
              onValueChange={itemValue => {
                onChange(itemValue, 'role');
              }}>
              {roles?.map(role => (
                <Picker.Item
                  style={styles.pickerItem}
                  label={role.name}
                  value={role.id}
                  key={role.id}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonStyle}
            onPress={async () => {
              await updateUserFunction();
              navigation.goBack();
            }}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        <ModalEditPhoto
          modalVisible={modalVisible}
          closeModal={closeModal}
          takePhoto={takePhoto}
          takePhotoFromGallery={takePhotoFromGallery}
        />
      </ScrollView>
      {loadingMutation && <Loading />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 10, marginHorizontal: 20},
  label: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5,
    fontFamily: 'RobotoCondensed-Bold',
  },
  emailLabel: {
    marginBottom: 10,
    fontSize: 15,
  },
  pickerContainer: {
    borderRadius: 25,
    borderColor: '#205375',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 5,
  },
  pickerStyle: {
    fontSize: 18,
  },
  pickerItem: {
    fontFamily: 'RobotoCondensed-Light',
    color: '#EFEFEF',
  },
  buttonStyle: {
    marginVertical: 20,
    backgroundColor: '#F66B0E',
    // backgroundColor: '#205375',
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 40,
  },
  buttonText: {fontSize: 20, fontFamily: 'RobotoCondensed-Bold'},
  textInput: {
    color: '#EFEFEF',
    fontFamily: 'RobotoCondensed-Light',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: '#205375',
    height: 45,
    marginTop: 5,
    marginBottom: 15,
  },
});
