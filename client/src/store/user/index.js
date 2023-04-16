import { clearSession, setSession } from "../../util/auth";
import axiosInstance from "../../util/axios";
import { toast } from "vue3-toastify";

export const userModule = {
  namespaced: true,
  state() {
    return {
      isLoggedIn: false,
      user: null,
      authToken: null,
    };
  },
  mutations: {
    login(state, payload) {
      const { user, token } = payload;
      state.isLoggedIn = true;
      state.user = user;
      state.authToken = token;
      setSession(token);
    },
    logout(state) {
      clearSession();
      state.isLoggedIn = false;
      state.user = null;
      state.authToken = null;
    },
  },
  actions: {
    async login(context, payload) {
      console.log("CALLING login API");
      try {
        const { email, password } = payload;
        const response = await axiosInstance.post("/admin/login", {
          email,
          password,
        });
        context.commit("login", {
          user: response.data.user,
          token: response.data.token,
        });
        toast.success("Logged in");
      } catch (error) {
        toast.error(error?.message || "Something went wrong");
        console.log("ERROR ", error);
      }
    },
    async getMyself(context) {
      console.log("CALLING getMyself API");

      try {
        const response = await axiosInstance.get("/user/me");
        context.commit("login", {
          user: response.data.user,
          token: response.data.token,
        });
      } catch (error) {
        toast.success("Logged out");
        context.commit("logout");
      }
    },
    async logout(context) {
      console.log("CALLING logout API");
      try {
        await axiosInstance.post("/user/logout");
        context.commit("logout");
        toast.success("Logged out");
      } catch (error) {
        toast.success("Logged out");
        context.commit("logout");
      }
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
  },
};
