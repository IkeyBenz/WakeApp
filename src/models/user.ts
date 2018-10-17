import { auth, db } from './firebase';

export const User = (function() {

    function checkLoggedInState(callback) {
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log(user.uid);
                getProfileFor(user.uid).then(snapshot => {
                    callback({ user: snapshot.data() });
                }).catch(error => {
                    callback({ error: error });
                });
            } else {
                callback({});
            }
        });
    }

    function updateUser(uid, user) {
        if (user.password) { delete user.password }
        user['lastUpdated'] = new Date().toString();
        return db.collection('users').doc(uid).set(user);
    }

    function getProfileFor(uid) {
        return db.collection('users').doc(uid).get();
    }

    function register(user): Promise<firebase.User> {
        return new Promise(function(resolve, reject) {
            auth.createUserWithEmailAndPassword(user.email, user.password)
            .then(async (userCredential) => {
                let userName = `${user.name.first} ${user.name.last}`;
                await Promise.all([ 
                      userCredential.user.updateProfile({ displayName: userName, photoURL: '' }),
                      updateUser(userCredential.user.uid, user) 
                ]);
                return auth.signInWithCredential(userCredential.credential);
            })
            .then(newUser => resolve(newUser))
            .catch(error => reject(error.message));
        });
    }

    function logUserIn(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logUserOut() {
        auth.signOut();
    }

    return {
        update : updateUser,
        signUp : register,
        logIn  : logUserIn,
        logOut : logUserOut,
        getUser: getProfileFor,
        authStateChanged: checkLoggedInState
    }
})();