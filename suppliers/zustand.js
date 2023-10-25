// zustand.js
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:3000";

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const useStore = create((set, get) => ({
    isUserAuthenticated: false,
    user: null,
    page: "signup",
    users: [],
    availableUsers: [],
    chats: [],
    // details -> {username, password}
    checkUserAlreadyAuthenticated: () => {
        const isAlreadyAuthenticated = localStorage.getItem('isAlreadyAuthenticated')
        if (isAlreadyAuthenticated) {
            set({
                isUserAuthenticated: true,
            });
        } else {
            set({
                isUserAuthenticated: false,
            });
        }
    },
    getUsers: async () => {
        try {
            const res = await api.get("/users")
            set({
                users: res.data.message,
            });
        } catch (e) {
            toast.error(e.message);
        }
    },
    setPage: (page) => {
        set({
            page,
        });
    },
    signup: async (details) => {
        try {
            const { username, password } = details;
            const res = await api.post(`/user/signup`, {
                username,
                password,
            });
            toast.success("Signup successful");
            set({
                isUserAuthenticated: true,
                user: res.data.message,
            });
            localStorage.setItem("isAlreadyAuthenticated", true);
            localStorage.setItem("token", res.data.message.token);
        } catch (e) {
            toast.error(e.message);
            set({
                isSignuped: false,
            });
        }
    },
    signin: async (details) => {
        try {
            const { username, password } = details;
            const res = await api.post(`/user/signin`, {
                username,
                password,
            });
            toast.success("Signin successful");
            console.log(res.data.message)
            set({
                isUserAuthenticated: true,
                user: res.data.message,
            });
            localStorage.setItem("isAlreadyAuthenticated", true);
            localStorage.setItem("token", res.data.message.token);
        } catch (e) {
            toast.error(e.message);
            set({
                isSignined: false,
            });
        }
    },
    getMyProfile: async () => {
        try {
            const res = await api.get("/profile");
            set({
                user: res.data.message,
            });
        } catch (e) {
            toast.error(e.message);
        }
    },
    logout: () => {
        localStorage.removeItem("isAlreadyAuthenticated");
        localStorage.removeItem("token");
        set({
            isUserAuthenticated: false,
            user: null,
            users: [],
        });
    },
    getChats: async () => {
        try {
            const res = await api.get(`/chats`)
            set({
                chats: res.data.message,
            });
        } catch (e) {
            toast.error(e.message);
        }
    },
    getAvailableUsers: async () => {
        try {
            const res = await api.get(`/available-users`)
            set({
                availableUsers: res.data.message,
            });
        } catch (e) {
            toast.error(e.message);
        }
    },
    createChatIndividual: async (members) => {
        try {
            const res = await api.post(`/create-chat-individual`, {
                members,
            });
            toast.success("Chat created successful");
            // remove the users from the users list and add the chat to the chats list
            const users = useStore.getState().users
            const chats = useStore.getState().chats
            const newUsers = users.filter(user => user._id !== members[0])
            const newChats = [...chats, res.data.message]
            console.log(newChats)
            set({
                users: newUsers,
                chats: newChats
            });

        } catch (e) {
            toast.error(e.message);
        }
    },
    createChatGroup: async (members, name) => {
        try {
            const res = await api.post(`/create-chat-group`, {
                members,
                name
            });
            toast.success("Chat created successful");
            // remove the users from the users list and add the chat to the chats list
            const chats = useStore.getState().chats
            const newChats = [...chats, res.data.message]
            set({
                chats: newChats
            });

        } catch (e) {
            toast.error(e.message);
        }
    },
}));
