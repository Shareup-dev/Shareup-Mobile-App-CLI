import AuthAxios from "./authAxios";

class ReelService {
  getAllReels = () => AuthAxios.get(`reels`); 
  addComment = (uid,rid,data) => AuthAxios.post(`comment_on_reel/${uid}/${rid}`,data);
  addReel = (uid,data) => AuthAxios.post(`reels/${uid}`,data);
  getReelsByUser = (uid) => AuthAxios.get(`reels/user/${uid}`);
  getReelById = (rid) => AuthAxios.get(`reels/reel-by-id/${rid}`);

  getFriendsReels = (uid) => AuthAxios.get(`Explore_reels/${uid}`);
  exploreReels = (uid) => AuthAxios.get(`Explore_myfriends_reels/${uid}`);
  likeUnLike = (uid,rid,data) => AuthAxios.put(`reels/${uid}/like-unlike/${rid}`,data);
}

export default new ReelService();
