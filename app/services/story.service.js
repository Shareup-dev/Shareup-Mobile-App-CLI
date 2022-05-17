import AuthAxios from './authAxios';

class Story {
  addStory = (userId, data) => AuthAxios.post(`/stories/${userId}`, data);
  getStories = () => AuthAxios.get(`/stories`);
  getStoriesByEmail = email => AuthAxios.get(`stories/${email}`);
  updateStory = sid => AuthAxios.put(`stories/${sid}`, data);
  deleteStory = sid => AuthAxios.delete(`stories/${sid}`);
  // getStoriesOfFriends = (uid) => AuthAxios.get(`stories/friends_stories/${uid}`)
  getStoriesOfFriends = uid => AuthAxios.get(`stories/friends_stories_new/${uid}`);

  // Get all story’s viewers
  getStoryViewers = (sid, pageno, pagesize = 10) =>
    AuthAxios({
      method: 'GET',
      url: `stories/views/${sid}`,
      params: {
        pageno,
        pagesize,
      },
    });
  getViewsCount = sid => AuthAxios.get(`stories/views_count/${sid}`);
  AddViews = (sid, uid) => AuthAxios.put(`stories/get_story_add_views/${sid}/${uid}`);
}
export default new Story();
