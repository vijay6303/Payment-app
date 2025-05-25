import { atom } from "recoil";

export const tokenAtom = atom({
  key: "tokenAtom",
  default: localStorage.getItem("token") || null,
});

export const userAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user")) || {
    _id: "",
    firstname: "",
    lastname: "",
    balance: 0
  },
});
