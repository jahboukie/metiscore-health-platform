import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { UserRecord } from "firebase-admin/auth";
import { onUserCreation } from "firebase-functions/v2/identity";
import { User } from "@metiscore/types";

initializeApp();

export const createuserdocument = onUserCreation(async (event: { data: UserRecord }): Promise<void> => {
  const user = event.data;
  const { uid, email, displayName } = user;

  const newUser: User = {
    uid,
    email: email || null,
    displayName: displayName || null,
    role: "primary",
  };

  try {
    await getFirestore().collection("users").doc(uid).set(newUser);
    console.log(`Successfully created user document for ${uid}`);
  } catch (error) {
    console.error(`Error creating user document for ${uid}:`, error);
  }
});
