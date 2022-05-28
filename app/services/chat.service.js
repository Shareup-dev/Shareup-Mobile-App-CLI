import ChatAxios  from './chatAxios';

class ChatService {
    getAllConversations = (username) => ChatAxios.get(`/getAllConversations/${username}`);
    getConversation = (username, friend) => ChatAxios.get(`/getConversation/${username}/${friend}`)
    getAllArchivedChat = (email) => ChatAxios.get(`/getArchivedConversations/${email}`)
    archiveChat = (email) => ChatAxios.get(`/archiveConversation/${email}`)
    unArchiveChat = (email) => ChatAxios.get(`/unarchiveConversation/${email}`)
    removeConversations = (cid,email) => ChatAxios.get(`/removeConversation/${cid}/${email}`)
}

export default new ChatService();
