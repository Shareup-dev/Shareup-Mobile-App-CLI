import AuthAxios from './authAxios';


class HangShareService {
    createHang = (uid,data) => 
     AuthAxios.post(`hangshare/new_hangshare/${uid}`,data)
    getAllHangData = () =>
        AuthAxios.get(`hangshare`)
}
export default new HangShareService();