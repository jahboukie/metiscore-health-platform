import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { UserRecord } from "firebase-admin/auth";
import { User } from "@metiscore/types";

initializeApp();

export const onboardnewuser = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }
  const user = request.data as UserRecord;
  const { uid, email, displayName } = user;
  const newUser: User = {
    uid,
    email: email || null,
    displayName: displayName || null,
    role: "primary",
  };
  try {
    await getFirestore().collection("users").doc(uid).set(newUser, { merge: true });
    return { status: "success", message: `User ${uid} onboarded.` };
  } catch (error) {
    console.error(`Error onboarding user ${uid}:`, error);
    throw new HttpsError("internal", "Error creating user profile.");
  }
});
