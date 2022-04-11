import AuthAxios from "./authAxios";

class ReelService {
  addReel =  (userId, reelData) =>  AuthAxios.post(`/reelslocal/${userId}`, reelData);
  getReels = _ => AuthAxios.get(`/reels`);
}

export default new ReelService();
