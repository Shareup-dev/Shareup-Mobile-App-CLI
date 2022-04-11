import AuthAxios from "./authAxios";

class ReelService {
  getAllReels = () => AuthAxios.get(`reels`); 
  addComment = (uid,rid,comment) => AuthAxios.post(`comment_on_reel/${uid}/${rid}`,comment);
  addReel = (uid,reel) => AuthAxios.post(`reels/${uid}`,reel);
  getReelsByUser = (uid) => AuthAxios.get(`reels/user/${uid}`);
  getReelById = (rid) => AuthAxios.get(`reels/reel-by-id/${rid}`);

  getFriendsReels = (uid) => AuthAxios.get(`Explore_reels/${uid}`);
  exploreReels = (uid) => AuthAxios.get(`Explore_myfriends_reels/${uid}`);
}

export default new ReelService();
