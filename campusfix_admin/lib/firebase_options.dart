import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        return web;
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyCFYsBiNSw5n581nFf6NlnCCynyG0sOaY4',
    appId: '1:1042223313585:web:39c3d3029cf0f45c46a890',
    messagingSenderId: '1042223313585',
    projectId: 'campusfix-360dd',
    authDomain: 'campusfix-360dd.firebaseapp.com',
    storageBucket: 'campusfix-360dd.firebasestorage.app',
    measurementId: 'G-1M3S9R36NV',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyCFYsBiNSw5n581nFf6NlnCCynyG0sOaY4',
    appId: '1:1042223313585:web:39c3d3029cf0f45c46a890',
    messagingSenderId: '1042223313585',
    projectId: 'campusfix-360dd',
    authDomain: 'campusfix-360dd.firebaseapp.com',
    storageBucket: 'campusfix-360dd.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyCFYsBiNSw5n581nFf6NlnCCynyG0sOaY4',
    appId: '1:1042223313585:web:39c3d3029cf0f45c46a890',
    messagingSenderId: '1042223313585',
    projectId: 'campusfix-360dd',
    authDomain: 'campusfix-360dd.firebaseapp.com',
    storageBucket: 'campusfix-360dd.firebasestorage.app',
  );
}
