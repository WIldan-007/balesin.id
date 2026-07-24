import { 
  auth, 
  googleProvider, 
  db, 
  signInWithPopup, 
  signOut, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  User 
} from '../lib/firebase';
import { UserProfile } from '../types';

export const calculateTrialStatus = (userData: Partial<UserProfile>) => {
  const tier = userData.tier || 'FREE_TRIAL';
  
  if (tier !== 'FREE_TRIAL') {
    return {
      isTrialExpired: false,
      trialDaysLeft: 999,
    };
  }

  const trialEndsAtStr = userData.trialEndsAt;
  if (!trialEndsAtStr) {
    return {
      isTrialExpired: false,
      trialDaysLeft: 7,
    };
  }

  const endTime = new Date(trialEndsAtStr).getTime();
  const now = Date.now();
  const diffMs = endTime - now;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0 || daysLeft <= 0) {
    return {
      isTrialExpired: true,
      trialDaysLeft: 0,
    };
  }

  return {
    isTrialExpired: false,
    trialDaysLeft: daysLeft,
  };
};

export const syncUserProfileWithFirestore = async (firebaseUser: User): Promise<UserProfile> => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  const now = new Date();

  if (snap.exists()) {
    const data = snap.data();
    const trialStatus = calculateTrialStatus(data as Partial<UserProfile>);

    return {
      id: firebaseUser.uid,
      name: data.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Operator',
      email: firebaseUser.email || data.email || '',
      avatar: firebaseUser.photoURL || data.avatar || '',
      tier: data.tier || 'FREE_TRIAL',
      isLoggedIn: true,
      createdAt: data.createdAt || now.toISOString(),
      trialStartDate: data.trialStartDate || now.toISOString(),
      trialEndsAt: data.trialEndsAt || new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString(),
      trialDaysLeft: trialStatus.trialDaysLeft,
      isTrialExpired: trialStatus.isTrialExpired,
    };
  } else {
    // First time user registration -> 7-Day Free Trial
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const newUserData = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Operator',
      email: firebaseUser.email || '',
      avatar: firebaseUser.photoURL || '',
      tier: 'FREE_TRIAL',
      createdAt: now.toISOString(),
      trialStartDate: now.toISOString(),
      trialEndsAt: trialEnd.toISOString(),
    };

    await setDoc(userRef, newUserData);

    return {
      id: firebaseUser.uid,
      name: newUserData.name,
      email: newUserData.email,
      avatar: newUserData.avatar,
      tier: 'FREE_TRIAL',
      isLoggedIn: true,
      createdAt: newUserData.createdAt,
      trialStartDate: newUserData.trialStartDate,
      trialEndsAt: newUserData.trialEndsAt,
      trialDaysLeft: 7,
      isTrialExpired: false,
    };
  }
};

export const loginWithGoogle = async (): Promise<UserProfile> => {
  const result = await signInWithPopup(auth, googleProvider);
  return await syncUserProfileWithFirestore(result.user);
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const updateUserSubscriptionInDb = async (uid: string, newTier: 'PLUS' | 'PRO' | 'AGENCY'): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    tier: newTier,
    upgradedAt: new Date().toISOString(),
  });
};
