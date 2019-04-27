import { firebaseConfig } from './firebase_config';
import * as firebase from './external/firebase';

export class Database {
    constructor() {
        this.db = null;
        this.updateCallback = null;
    }

    init() {
      firebase.initializeApp(firebaseConfig);
  
      this.db = firebase.firestore();
  
      // We require a closure for 'callback' to be in scope of the onSnapshot callback function
      var snapShotCallback = (function (callback) {
        return function(querySnapshot) {
          try {
            callback(querySnapshot.docs[0].data());
          }
          catch(e) {
            if (e.name == 'TypeError') {
              console.log('No database update callback function defined. Please call init() after setting the callback function with setOnUpdateCallback.');
            }
            else {
              throw e; // rethrow (don't know how to deal with it)
            }
          }
        };
      })(this.updateCallback);
  
      this.db.collection("devices").orderBy("timeStamp", "desc").limit(1).onSnapshot(snapShotCallback);
    }

    setOnUpdateCallback(callback) {
      this.updateCallback = callback;
    }

    getLastEntry(table, callback) {
      var promise = this.db.collection(table).orderBy("timeStamp", "desc").limit(1).get({source: 'server'});
      
      promise.then(function(querySnapshot) {
        // Document was found in the server. If no server document exists,
        // an error will be returned to the 'catch' block below.
        querySnapshot.forEach(function(doc) {
          callback(doc.data());
        });
      })
      .catch(function(error) {
        console.log("Error getting server document while getting last entry:", error);
      });

      return promise;
    }

    addData(table, data) {
      data.timeStamp = firebase.firestore.FieldValue.serverTimestamp();

      this.db.collection(table).add(data)
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
          throw error;
      });
    }
}