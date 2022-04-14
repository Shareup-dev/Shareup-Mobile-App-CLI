import AuthAxios from "./authAxios";

class ReelService {
  // getAllReels = () => AuthAxios.get(`reels`); 
  getAllReels = (rid,uid) => AuthAxios.get(`reels/${rid}/${uid}`); 
  deleteReel = (rid) => AuthAxios.delete(`reels/${rid}`);
  addReel = (uid,data) => AuthAxios.post(`new_reel/${uid}`,data);

  getReelsByUser = (uid) => AuthAxios.get(`reels/user/${uid}`);
  getReelById = (rid) => AuthAxios.get(`reels/reel-by-id/${rid}`);
  exploreReels = (uid) => AuthAxios.get(`Explore_reels/${uid}`);
  getFriendsReels= (uid) => AuthAxios.get(`Explore_myfriends_reels/${uid}`);
  
  likeUnLike = (uid,rid,data) => AuthAxios.put(`reels/${uid}/like-unlike/${rid}`,data);
  addComment = (uid,rid,data) => AuthAxios.post(`comment_on_reel/${uid}/${rid}`,data);
  getReelsComments =  (rid) => AuthAxios.get(`get_reel_comments/${rid}`);
}

export default new ReelService();
