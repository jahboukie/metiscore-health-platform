import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { User } from "@metiscore/types";

admin.initializeApp();
const db = admin.firestore();

// V1 syntax with an explicit region specified.
export const onUserCreate = functions
  .region("us-central1") // You can change this to your preferred region
  .auth.user()
  .onCreate(async (user) => {
    const { uid, email, displayName } = user;

    const newUser: User = {
      uid,
      email: email || null,
      displayName: displayName || null,
      role: "primary",
    };

    try {
      await db.collection("users").doc(uid).set(newUser);
      console.log(`Successfully created user document for ${uid}`);
    } catch (error) {
      console.error(`Error creating user document for ${uid}:`, error);
    }
  });
