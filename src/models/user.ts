import { auth, db, firebase } from './firebase';

export const User = (function() {

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
        return db.collection('users').doc(auth.currentUser.uid).update(updates);
    }

    function getProfileFor(uid) {
        return db.collection('users').doc(uid).get();
    }

    function register(newUser) {
        return auth.createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(userCredential => {
                let userName = `${newUser.name.first} ${newUser.name.last}`;
                delete newUser.password;
                return userCredential.user.updateProfile({ displayName: userName, photoURL: '' })
                    .then(() => db.collection('users').doc(userCredential.user.uid).set(newUser))
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
        return db.collection('users').doc(auth.currentUser.uid).update({
            groups: firebase.FieldValue.arrayUnion(groupId)
        });
    }

    function groupsUpdated(callback) {
        db.collection('users').doc(auth.currentUser.uid)
        .onSnapshot(snapshot => callback(snapshot.data().groups));
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
        authStateChanged: checkLoggedInState
    }
    
})();