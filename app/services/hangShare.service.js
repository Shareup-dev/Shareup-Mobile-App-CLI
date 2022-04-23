import AuthAxios from './authAxios';


class HangShareService {
    createHang = (uid,data) => 
     AuthAxios.post(`hangshare/new_hangshare/${uid}`,data)
    getAllHangData = () =>
        AuthAxios.get(`hangshare`)
    getAllGiftsForHang = () =>
        AuthAxios.get(`hangshare/Gifts`)
    getallMealsForHang = () => 
        AuthAxios.get(`hangshare/Meals`)
    acceptHang = (hsid,uid,data) =>
        AuthAxios.put(`hangshare/accept/${hsid}}/${uid}`,data)   
    editHang = (uid,hsid,data) => 
        AuthAxios.put(`hangshare/${uid}/edit/${hsid}`,data)    
    deleteHang = (uid,hsid) => 
        AuthAxios.delete(`hangshare/${uid}/delete/${hsid}`)
                          
}
export default new HangShareService();