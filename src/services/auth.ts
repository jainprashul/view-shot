import {
  ConfirmationResult,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { userDB } from "./db";

const GProvider = new GoogleAuthProvider();
GProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
GProvider.setCustomParameters({
  login_hint: "user@example.com",
});

async function updateDBAfterSignIn(user: User) {
  const userExist = userDB.exists(user.uid);
  if (!userExist) {
    await userDB.put(user.uid, {
      id: user.uid,
      name: user.displayName ?? "New User",
      username: user.email,
      email: user.email,
      avatar: user.photoURL,
      phone: user.phoneNumber,
      createdAt: user.metadata.creationTime,
      lastSignIn: user.metadata.lastSignInTime,
      verified: user.emailVerified,
    });
  }
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, GProvider);
    const creds = GoogleAuthProvider.credentialFromResult(result);
    const token = creds?.accessToken;
    if (token) localStorage.setItem("token", token);

    const user = result.user;
    console.log(user);
    await updateDBAfterSignIn(user);

    localStorage.setItem("user", JSON.stringify(user.toJSON()));
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    // const email = error.customData.email;
    // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);

    if (errorCode === "auth/account-exists-with-different-credential") {
      console.log(
        "You have already signed up with a different auth provider for that email."
      );
      // If you are using multiple auth providers on your app you should handle linking
      // the user's accounts here.
    }

    console.log("SIGNIN ERROR : ", error);
    throw new Error(errorMessage);
  }
}

let confirmation: ConfirmationResult;
export function loginWithPhone(phone: string) {
  // @ts-ignore
  const RecaptchaVerifier = new RecaptchaVerifier(
    "sign-in-button",
    {
      size: "invisible",
      callback: async (response: string) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
        console.log(response);
        confirmation = await signInWithPhoneNumber(
          auth,
          phone,
          RecaptchaVerifier
        );
      },
    },
    auth
  );
}

export async function phoneConfirmationSubmit(code: string) {
  try {
    const res = await confirmation.confirm(code);
    console.log(res);
    await updateDBAfterSignIn(res.user);
    localStorage.setItem("user", JSON.stringify(res.user.toJSON()));
    return res.user;
  } catch (error) {
    console.log(error);
  }
}

export async function signOut() {
  await auth.signOut();
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user")!);
}

export function onAuthChanged() {
  onAuthStateChanged(
    auth,
    (user) => {
      console.log(user);
    },
    (error) => {
      console.log(error);
    }
  );
}
