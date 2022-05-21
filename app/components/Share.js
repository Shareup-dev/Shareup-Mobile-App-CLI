import  Share  from "react-native-share";

const onShareHandler = (postData) => {
  Share.open({
    message: postData?.content,
    title: 'Sharing Post',
    url: `https://shareup.qa/post/${postData.id}/${postData.allPostsType}`,
  })
    .then(res => res)
    .catch(err => {
      err && console.error(err);
    });
};

export default onShareHandler;