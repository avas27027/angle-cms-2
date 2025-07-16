
import { Button } from "@heroui/react";
import DefaultLayout from "../layouts/default.tsx";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import Firebase from "../config/firebase.tsx";

export default function IndexPage() {
  const provider = new GoogleAuthProvider();
  const auth = Firebase.auth;
  const [userName, setUserName] = useState("")

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        setUserName(result.user.displayName || "No Name");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  return (
    <DefaultLayout title="Titulo">
      <section>
        <h1 className="">user: {userName}</h1>
        <Button onPress={signIn}>Login</Button>
      </section>
    </DefaultLayout>
  );
}
