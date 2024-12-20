export const environment={
    production: false, 
    firebase: {
      apiKey: "AIzaSyCfexypHBvDSXGk9OhRy_nktWRyZ6HmawI",
      authDomain: "invoicehub-467aa.firebaseapp.com",
      databaseURL: "https://invoicehub-467aa.firebaseio.com", // Realtime Database URL
      projectId: "invoicehub-467aa",
      storageBucket: "invoicehub-467aa.appspot.com",
      messagingSenderId: "297320637437",
      appId: "1:297320637437:web:583d9da041d44eb1716f94",
      measurementId: "G-WRQ7CVBPY3",
    },
    apiEndpoints: {
      firestore: `https://firestore.googleapis.com/v1/projects/invoicehub-467aa/databases/(default)/documents`,
      realtimeDatabase: `https://invoicehub-467aa.firebaseio.com`,
      register:`/firebase-api/v1/accounts:signUp?key=`,
      login:`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=`,
      proxy:`/firebase-api/v1/accounts:signInWithPassword?key=`,

    },
} ;

