import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import routes from './Routes';
import SignupStepThree from '../../Screens/Signup/Signup-step3';
// import routes from './Routes';
// import AppNavigator from './AppNavigator';
import CommentsScreen from '../../Screens/CommentsScreen';
// import AddStoryScreen from '../../Screens/AddStoryScreen';
// import AddNewReel from '../../Screens/AddNewReel';
// import AddPostScreen from '../../Screens/AddPostScreen';
// import TagPeople from '../../Screens/tagPeople';
// import FeelingAndActivity from '../../Screens/feelingAndActivity';
// import MessagesNavigator from './MessagesNavigator';
// import ReelPlayer from '../../Screens/ReelPlayer';
// import StoryViewScreen from '../../Screens/StoryViewScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen name={routes.APP_NAVIGATOR} component={AppNavigator} /> */}
        <Stack.Screen name={routes.COMMENTS} component={CommentsScreen} />
        <Stack.Screen
          name={routes.SIGNUP_STEP_THREE}
          component={SignupStepThree}
        />
        {/* <Stack.Screen name={routes.ADDS_STORY} component={AddStoryScreen} /> */}
        {/* <Stack.Screen name={routes.ADD_NEW_REEL} component={AddNewReel} />
        <Stack.Screen name={routes.ADD_POST} component={AddPostScreen} />
        <Stack.Screen name={routes.TAG_PEOPLE} component={TagPeople} />
        <Stack.Screen
          name={routes.FEELING_ACTIVITY}
          component={FeelingAndActivity}
        />
        <Stack.Screen
          name={routes.MESSAGES_NAVIGATOR}
          component={MessagesNavigator}
        />
        <Stack.Screen
          name={routes.STORY_VIEW_SCREEN}
          component={StoryViewScreen}
        />

        <Stack.Screen name={routes.REEL_PLAYER} component={ReelPlayer} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
