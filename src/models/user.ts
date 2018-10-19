import { auth, db, firebase } from './firebase';

export const User = (function() {

    const ref = db.collection('users');

    function checkLoggedInState(callback) {
        auth.onAuthStateChanged(user => {
            if (user) {
                getProfileFor(user.uid).then(snapshot => {
                    console.log(snapshot)
                    callback({ user: snapshot.data() });
                }).catch(error => {
                    callback({ error: error });
                });
            } else {
                callback({});
            }
        });
    }

    function updateCurrentUser(updates) {
        if (!auth.currentUser)
            return Promise.reject('Not Logged In.');
        if (updates.password) { delete updates.password }
        return ref.doc(auth.currentUser.uid).update(updates);
    }

    function getProfileFor(uid) {
        return ref.doc(uid).get();
    }

    function register(newUser) {
        return auth.createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(userCredential => {
                let userName = `${newUser.name.first} ${newUser.name.last}`;
                delete newUser.password;
                return userCredential.user.updateProfile({ displayName: userName, photoURL: '' })
                    .then(() => ref.doc(userCredential.user.uid).set(newUser))
                    .then(() => auth.signInWithCredential(userCredential.credential));
            });
    }

    function logUserIn(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logUserOut() {
        auth.signOut();
    }

    function joinGroup(groupId) {
        if (!auth.currentUser)
            return Promise.reject('Not signed in.');
        return ref.doc(auth.currentUser.uid).update({
            groups: firebase.FieldValue.arrayUnion(groupId)
        });
    }

    function groupsUpdated(callback) {
        ref.doc(auth.currentUser.uid)
        .onSnapshot(snapshot => callback(snapshot.data().groups));
    }
    
    function getAllWithIds(uids) {
        return new Promise(async (resolve, reject) => {
            let members = [];
            for (let id of uids) {
                let snapshot = await ref.doc(id).get();
                members.push(snapshot.data());
            }
            resolve(members);
        });
    }
    return {
        signUp : register,
        logIn  : logUserIn,
        logOut : logUserOut,
        update : updateCurrentUser,
        joinGroup: joinGroup,
        getUser: getProfileFor,
        onGroupsUpdated: groupsUpdated,
        currentUser: auth.currentUser,
        authStateChanged: checkLoggedInState,
        getAllWithIds: getAllWithIds
    }
    
})();