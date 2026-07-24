import { db, doc, getDoc, setDoc, auth } from '../lib/firebase';
import { AutomationFlow, PlatformNode, Campaign, ShortLink, AffiliateNode, SystemLog } from '../types';

export interface UserAppData {
  flows: AutomationFlow[];
  nodes: PlatformNode[];
  campaigns: Campaign[];
  shortLinks: ShortLink[];
  affiliates: AffiliateNode[];
  logs: SystemLog[];
}

export const loadUserDataFromFirestore = async (uid: string): Promise<{ data: UserAppData; isNewUser: boolean }> => {
  if (!uid) {
    return {
      data: { flows: [], nodes: [], campaigns: [], shortLinks: [], affiliates: [], logs: [] },
      isNewUser: true,
    };
  }

  const localKey = `balesin_appdata_${uid}`;

  // If user is not authenticated in Firebase Auth yet or uid doesn't match
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    const cached = localStorage.getItem(localKey);
    if (cached) {
      try {
        return { data: JSON.parse(cached), isNewUser: false };
      } catch (e) {}
    }
    return {
      data: { flows: [], nodes: [], campaigns: [], shortLinks: [], affiliates: [], logs: [] },
      isNewUser: true,
    };
  }

  const dataDocRef = doc(db, 'users', uid, 'appData', 'main');

  try {
    const snap = await getDoc(dataDocRef);
    if (snap.exists()) {
      const data = snap.data() as UserAppData;
      const appData: UserAppData = {
        flows: data.flows || [],
        nodes: data.nodes || [],
        campaigns: data.campaigns || [],
        shortLinks: data.shortLinks || [],
        affiliates: data.affiliates || [],
        logs: data.logs || [],
      };
      // Save cache locally
      localStorage.setItem(localKey, JSON.stringify(appData));
      return { data: appData, isNewUser: false };
    } else {
      // Check local storage for this uid if document doesn't exist
      const cached = localStorage.getItem(localKey);
      if (cached) {
        try {
          const appData = JSON.parse(cached);
          return { data: appData, isNewUser: false };
        } catch (e) {}
      }

      // NEW USER -> initialize empty
      const emptyData: UserAppData = {
        flows: [],
        nodes: [],
        campaigns: [],
        shortLinks: [],
        affiliates: [],
        logs: [],
      };

      // Save initial empty dataset for this new user in Firestore
      await setDoc(dataDocRef, emptyData, { merge: true });
      localStorage.setItem(localKey, JSON.stringify(emptyData));

      return { data: emptyData, isNewUser: true };
    }
  } catch (error) {
    console.error('Error loading user data from Firestore:', error);
    // Fallback to local storage if available
    const cached = localStorage.getItem(localKey);
    if (cached) {
      try {
        return { data: JSON.parse(cached), isNewUser: false };
      } catch (e) {}
    }

    return {
      data: { flows: [], nodes: [], campaigns: [], shortLinks: [], affiliates: [], logs: [] },
      isNewUser: true,
    };
  }
};

export const saveUserDataToFirestore = async (uid: string, data: UserAppData): Promise<void> => {
  if (!uid) return;
  const localKey = `balesin_appdata_${uid}`;
  localStorage.setItem(localKey, JSON.stringify(data));

  // Only sync to Firestore if user is logged in and authenticated matching uid
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    return;
  }

  try {
    const dataDocRef = doc(db, 'users', uid, 'appData', 'main');
    await setDoc(dataDocRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
  }
};
