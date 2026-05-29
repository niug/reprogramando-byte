import { doc, updateDoc, arrayUnion, serverTimestamp, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export function useProgress(uid) {
  const saveExecution = async (challengeId, code, success, output) => {
    if (!uid) return;
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      [`executions.${challengeId}`]: arrayUnion({
        code,
        success,
        output: output.slice(0, 500),
        timestamp: new Date().toISOString()
      }),
      [`executionCount.${challengeId}`]: (await getDoc(ref)).data()
        ?.executionCount?.[challengeId] + 1 || 1
    });
  };

  const completeChallenge = async (blockId, challengeId) => {
    if (!uid) return;
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      [`progress.${blockId}.${challengeId}`]: true,
      [`progress.${blockId}.completedAt`]: serverTimestamp()
    });
  };

  return { saveExecution, completeChallenge };
}