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
}