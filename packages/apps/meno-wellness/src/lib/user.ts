import { getFunctions, httpsCallable } from "firebase/functions";
import { User as FirebaseAuthUser } from "firebase/auth";

const functions = getFunctions();
const onboardNewUserCallable = httpsCallable(functions, 'onboardnewuser');

export async function onboardUser(user: FirebaseAuthUser) {
  try {
    console.log(`Calling onboardnewuser for ${user.uid}...`);
    const result = await onboardNewUserCallable(user.toJSON());
    console.log("Onboarding result:", result.data);
  } catch (error) {
    console.error("This error is expected if the user document already exists:", error);
  }
}
