import { create } from "zustand";
import type { ApiResponse } from "../types";

interface DataState {
  user: ApiResponse.User | null;
  setUser: (user: ApiResponse.User) => void;
}

const defaultUser: ApiResponse.User = {
  user_id: 0,
  user_name: "",
}

const useAppStore = create<DataState>((set) => ({
  user: defaultUser,
  setUser: (user) => set({ user }),
}))

export default useAppStore;