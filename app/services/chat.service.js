import ChatAxios  from './chatAxios';

class ChatService {
    getAllConversations = (username) => ChatAxios.get(`/getAllConversations/${username}`);
    getConversation = (username, friend) => ChatAxios.get(`/getConversation/${username}/${friend}`)
}

export default new ChatService();
