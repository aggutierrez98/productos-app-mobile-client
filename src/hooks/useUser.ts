import {useMutation, useQuery} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import {useEffect, useState} from 'react';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {UPDATE_IMAGE_CLOUDINARY} from '../graphql/mutations';
import {UPDATE_USER} from '../graphql/mutations/users';
import {GET_USER} from '../graphql/queries';
import {GET_ROLES} from '../graphql/queries/roles';
import {GetUserRes, GetRolesRes} from '../interfaces';
import {useForm} from './useForm';

export const useUser = (id: string, name: string) => {
  const [tempImage, setTempImage] = useState<Asset>();
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const openModal = () => setModalVisible(true);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: userData,
    loading: loadingGet,
    refetch,
  }: GetUserRes = useQuery(GET_USER, {
    variables: {id},
  });
  const [updateUser, {loading: loadingUpdate}] = useMutation(UPDATE_USER);
  const [updateImage, {loading: loadingUpdateImage}] = useMutation(
    UPDATE_IMAGE_CLOUDINARY,
  );

  const userFromApi = userData?.getUser;
  const {data: rolesData}: GetRolesRes = useQuery(GET_ROLES);
  const roles = rolesData?.getRoles.roles;

  const refetchUser = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const {
    form: user,
    onChange,
    setFormValues,
  } = useForm({
    id: '',
    email: '',
    name: '',
    role: '',
    image: '',
  });

  useEffect(() => {
    setFormValues({
      id: userFromApi?.id || id,
      name: userFromApi?.name || name,
      email: userFromApi?.email || '',
      role: userFromApi?.role.id || '',
      image: userFromApi?.image || '',
    });
  }, [id, name, setFormValues, userFromApi]);

  const updateUserFunction = async () => {
    await updateUser({
      variables: {
        user: {
          id,
          name: user.name,
          role: user.role,
          // // password,
        },
      },
      onError: err => {
        console.log({err});
      },
    });

    if (tempImage) uploadImage(tempImage);
  };

  const uploadImage = async (data: Asset) => {
    const fileToUpload = new ReactNativeFile({
      uri: data.uri!,
      type: data.type,
      name: data.fileName,
    });

    updateImage({
      variables: {
        image: fileToUpload,
        id,
        collection: 'users',
      },
      onError: error => {
        console.log({error});
      },
      update: (cache, {data: newUserData}) => {
        cache.modify({
          fields: {
            getUsers(oldGetUsersData) {
              const newUsers = oldGetUsersData.users.map((oldUser: any) => {
                if (oldUser.id === newUserData.id) {
                  return newUserData;
                } else return oldUser;
              });

              return {
                ...oldGetUsersData,
                users: newUsers,
              };
            },
          },
        });
      },
    });
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets || resp.assets.length === 0) return;

        setTempImage(resp.assets[0]);
        closeModal();
      },
    );
  };

  const takePhotoFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets || resp.assets.length === 0) return;

        setTempImage(resp.assets[0]);
        closeModal();
      },
    );
  };

  return {
    tempImage,
    user,
    roles,
    loading: loadingGet,
    loadingMutation: loadingUpdate || loadingUpdateImage,
    refreshing,
    modalVisible,
    openModal,
    closeModal,
    updateUserFunction,
    onChange,
    takePhoto,
    takePhotoFromGallery,
    refetchUser,
  };
};
