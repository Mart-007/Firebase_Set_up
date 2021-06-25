const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSIgnedOut = document.getElementById('whenSignedout');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

//Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

// Firestore //
const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

let thingsRef; //reference to a database location
let unsubscribe; //turn off real time stream ( tell the app when to stop the stream)

auth.onAuthStateChanged(user => {
    //check the authentication state of the current user
    if(user){

        //database reference
        thingsRef = db.collection('things')

        createThing.onclick = () => {
            const { serverTimestamp } = firebase.firestore.Fielvalue;
        
            //create new document
            thingRef.add({
                //users has-many things
                uid: user.uid, 
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
        }

        //Query
        unsubscribe = thingRef
            .where('uid', '==', user.uid)
            //requires a query 
            .orderBy('createdAt') 
            .onSnapshot(querySnapshot => {
                
                //Map results to an array of li elements
                const items = querySnapshot.docs.map(doc => {

                //calling the data to the document
                    return `<li>${doc.data().name}</li>` 
                });

                thingsList.innerHTML = items.join('');
            });
    } else {
        // Unsubscribe when the user signs out 
        unsubscribe && unsubscribe();

    }
});