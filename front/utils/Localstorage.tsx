// utils/localStorage.ts
export const loadState = (): any => {
  try {
    // 브라우저 환경에서만 localStorage 사용
    if (typeof window === "undefined") {
      return undefined;
    }
    const serializedState = localStorage.getItem("posts");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Failed to load state from localStorage:", err);
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    if (typeof window === "undefined") {
      return;
    }
    const serializedState = JSON.stringify(state);
    localStorage.setItem("posts", serializedState);
  } catch (err) {
    console.error("Failed to save state to localStorage:", err);
  }
};
