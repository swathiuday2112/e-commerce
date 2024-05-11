document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();

    // Listen for changes in the user's authentication state
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = "order.html";
        }
    });
});

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            console.log(user.displayName);
            
            // Add user to Firestore database
            const database = firebase.firestore();
            const userId = user.uid;
            const email = user.email;
            console.log(userId,email);
            const usersRef = firebase.firestore().collection('users');
            // Check if user already exists in the database
            usersRef.doc(userId).get()
                .then(doc => {
                    if (doc.exists) {
                        console.log("User already exists in the database");
                        window.location.href = "order.html";
                    } else {
                        // Add the user to the database
                        usersRef.doc(userId).set({
                            email: email,
                            cart: {}
                        })
                        .then(function() {
                            console.log("User added to the database");
                            window.location.href = "order.html";
                        })
                        .catch(function(error) {
                            console.error("Error adding user to the database: ", error);
                        });
                    }
                })
                .catch(function(error) {
                    console.error("Error checking if user exists: ", error);
                });
        })
        .catch(console.log);
}
