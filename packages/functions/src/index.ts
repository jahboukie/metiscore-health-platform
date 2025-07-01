import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { UserRecord } from "firebase-admin/auth";
import { User } from "@metiscore/types";

initializeApp();

export const onboardnewuser = onCall(async (request) => {
  // 1. Check that the user calling this function is authenticated.
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to call this function.");
  }

  // 2. Get the user data passed from the frontend.
  const user = request.data as UserRecord;
  const { uid, email, displayName } = user;

  // 3. Prepare the new user document.
  const newUser: User = {
    uid,
    email: email || null,
    displayName: displayName || null,
    role: "primary",
  };

  try {
    // 4. Create the document in the 'users' collection.
    await getFirestore().collection("users").doc(uid).set(newUser, { merge: true });
    console.log(`Successfully onboarded user ${uid}`);
    return { status: "success", message: `User ${uid} onboarded.` };
  } catch (error) {
    console.error(`Error onboarding user ${uid}:`, error);
    throw new HttpsError("internal", "An error occurred while creating the user profile.");
  }
});
