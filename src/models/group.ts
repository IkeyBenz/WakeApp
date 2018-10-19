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
        return db.collection('groups').where('title', '==', title).where('accessCode', '==', accessCode).get()
        .then(querySnap => {
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
    
    function getGroupsWithIds(ids): Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            if (!ids) return reject("You aren't in any groups.");
            let groups = [];
            for (let id of ids) {
                let group = await db.collection('groups').doc(id).get();
                groups.push({ ...group.data(), id: group.id });
            }
            resolve(groups);
        });
    }

    return {
        create: createGroup,
        addCurrentUser: addUserToGroupWithTitleAndAccessCode,
        getGroupsWithIds: getGroupsWithIds
    }
})();