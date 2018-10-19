import { db, firebase } from './firebase';

export const Chat = (function() {

    let currentChat;
    const ref = db.collection('groups');

    function _updateCurrentChatTo(groupId) {
        currentChat = groupId;
    }

    function getChatInfo() {
        return ref.doc(currentChat).get()
        .then(snapshot => { return snapshot.data() });
    }

    function postMessage(message) {
        return ref.doc(currentChat).update({
            messages: firebase.FieldValue.arrayUnion(message)
        }).then(() => ref.doc(currentChat).update({
            recentMessage: message
        }));
    }
    function updateChatInfo(updates) {
        return ref.doc(currentChat).update(updates);
    }

    function onUpdate(callback) {
        ref.doc(currentChat).onSnapshot(snapshot => {
            callback({ ...snapshot.data(), id: snapshot.id });
        });
    }


    return {
        load: getChatInfo,
        update: updateChatInfo,
        postMessage: postMessage,
        onUpdate: onUpdate,
        setCurrentChat: _updateCurrentChatTo,
        currentChat: currentChat
    }
})();