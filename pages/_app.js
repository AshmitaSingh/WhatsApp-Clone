import { useEffect } from 'react';
import '../styles/globals.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import firebase from "firebase";

function MyApp({ Component, pageProps }) {

  const [user, loading] = useAuthState(auth);

  // Whenever the component mounts, the below code triggers (In this case, whenever the user logs in or logs out, it will fire the below code)
  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL
      },
        { merge: true }
      )
    }
  }, [user])

  // To display a spinner/loader while we refresh the app
  if(loading) return <Loading/>;

  // If the user is not logged in, then 'Login Page' pops
  if(!user) return <Login/>

  return <Component {...pageProps} />
}

export default MyApp
