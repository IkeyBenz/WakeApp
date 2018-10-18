import { auth, db, firebase } from './firebase';
import { User } from './user';

export const Group = (function() {

    async function createGroup(group) {
        if (!auth.currentUser) 
            return Promise.reject("You're not logged in.");
        let newGroup = { ...group, members: [auth.currentUser.uid] }
        const docRef = await db.collection('groups').add(newGroup);
        const docSnap = await User.getUser(auth.currentUser.uid);
        let userData = docSnap.data();
        if (!userData.groups) {
            userData['groups'] = [docRef.id];
        }
        else {
            userData.groups.push(docRef.id);
        }
        return User.update(auth.currentUser.uid, { groups: userData.groups });
    }
    function addUserToGroupWithTitleAndAccessCode(title, accessCode) {
        if (!auth.currentUser)
            return Promise.reject('You are not logged in.');
        return db.collection('groups')
        .where('title', '==', title)
        .where('accessCode', '==', accessCode)
        .get().then(querySnap => {
            if (querySnap.docs.length == 0)
                return Promise.reject("That group doesn't exist, idiot!");
            if (querySnap.docs[0].data().members.includes(auth.currentUser.uid))
                return Promise.reject("You're already in that group, idiot!");
            return querySnap.docs[0].ref.update({
                members: firebase.FieldValue.arrayUnion(auth.currentUser.uid)
            }).then(() => Promise.resolve(querySnap.docs[0].id))
            .catch(error => Promise.reject(error.message));
        });
    }

    function leaveGroup() {

    }
    function readGroup(groupId) {
        return db.collection('groups').doc(groupId).get();
    }
    return {
        create: createGroup,
        addCurrentUser: addUserToGroupWithTitleAndAccessCode
    }
})();