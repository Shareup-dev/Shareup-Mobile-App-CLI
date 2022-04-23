const common = {
    privacyOptions : [
        {
          icon: require('../assets/post-privacy-options-icons/public-icon.png'),
          label: 'Public',
          value: 'Public',
          description: 'Anyone on or off Shareup',
        },
        {
          icon: require('../assets/post-privacy-options-icons/friends-icon.png'),
          label: 'Friends',
          value: 'Friends',
          description: 'Your friends on Shareup',
        },
        {
          icon: require('../assets/post-privacy-options-icons/friends-except-icon.png'),
          label: 'Friends except...',
          value: 'Friends except...',
          description: "Don't show to some friends",
        },
        {
          icon: require('../assets/post-privacy-options-icons/specific-friends-icon.png'),
          label: 'Specific friends',
          value: 'Specific friends',
          description: 'Only show to some friends',
        },
      ],
    shareUpOptions : [
        {
          title: 'Share Feed',
          icon: { image: require('../assets/icons/gray-feed-icon.png') },
          onPress: () => {
            alert('Share Feed');
          },
        },
        {
          title: 'Share time',
          icon: { image: require('../assets/icons/gray-share-time-icon.png') },
          onPress: () => {
            alert('Share time');
          },
        },
        {
          title: 'Share Friends',
          icon: { image: require('../assets/icons/gray-share-friends-icon.png') },
          onPress: () => {
            alert('Share Friends');
          },
        },
        {
          title: 'Share Point',
          icon: { image: require('../assets/icons/gray-share-point-icon.png') },
          onPress: () => {
            alert('Share Point');
          },
        },
        {
          title: 'Share Groups',
          icon: { image: require('../assets/icons/gray-share-groups-icon.png') },
          onPress: () => {
            alert('Share Groups');
          },
        },
        {
          title: 'Sell and Share',
          icon: {
            image: require('../assets/icons/gray-sell-and-share-icon.png'),
          },
          onPress: () => {
            alert('Sell and Share');
          },
        },
      ],
    createPostoptions : [{
        title: 'Photos',
        icon: {
          image: require('../assets/add-post-options-icons/photo-gradient-icon.png'),
        },
        onPress: () => {
          handelPickImage();
        },
      },
      {
        title: 'Tag People',
        icon: {
          image: require('../assets/add-post-options-icons/tag-people-gradient-icon.png'),
        },
        onPress: () => {
          navigation.navigate(routes.TAG_PEOPLE);
        },
      },
      {
        title: 'Sell and Share',
        icon: {
          image: require('../assets/add-post-options-icons/sell-and-share-gradient-icon.png'),
        },
        onPress: () => {
          alert('Sell and Share');
        },
      },
      {
        title: 'Feeling/Activity',
        icon: {
          image: require('../assets/add-post-options-icons/feeling-gradient-icon.png'),
        },
        onPress: () => {
          navigation.navigate(routes.FEELING_ACTIVITY);
        },
      },
      {
        title: 'Location',
        icon: {
          image: require('../assets/add-post-options-icons/location-gradient-icon.png'),
        },
        onPress: () => {
          alert('Location');
        },
      },
      {
        title: 'Live',
        icon: {
          image: require('../assets/add-post-options-icons/live-gradient-icon.png'),
        },
        onPress: () => {
          alert('Live');
        },
      },
    ],
    sharePostOptions : [{
        title: 'Tag People',
        icon: {
          image: require('../assets/add-post-options-icons/tag-people-gradient-icon.png'),
        },
        onPress: () => {
          navigation.navigate(routes.TAG_PEOPLE);
        },
      },
  
      {
        title: 'Feeling/Activity',
        icon: {
          image: require('../assets/add-post-options-icons/feeling-gradient-icon.png'),
        },
        onPress: () => {
          navigation.navigate(routes.FEELING_ACTIVITY);
        },
      },]
} 
export default common;