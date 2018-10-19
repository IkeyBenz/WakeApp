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

    function updateUser(uid, updates) {
        if (updates.password) { delete updates.password }
        updates['lastUpdated'] = new Date().toString();
        return getProfileFor(uid)
        .then(docRef => db.collection('users').doc(uid).set({ ...docRef.data(), ...updates }))
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

    return {
        signUp : register,
        logIn  : logUserIn,
        logOut : logUserOut,
        update : updateUser,
        joinGroup: joinGroup,
        getUser: getProfileFor,
        currentUser: auth.currentUser,
        authStateChanged: checkLoggedInState
    }
    
})();