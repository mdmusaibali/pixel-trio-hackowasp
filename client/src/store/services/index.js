import axiosInstance from "../../util/axios";
import { toast } from "vue3-toastify";
import { sleeper } from "../../util/helper";

export const serviceModule = {
  namespaced: true,
  state() {
    return {
      services: [],
    };
  },
  mutations: {
    fillServices(state, payload) {
      state.services = payload;
    },
    prependService(state, payload) {
      state.services.unshift(...payload);
    },
    popService(state, payload) {
      state.services = state.services.filter(
        (service) => service._id !== payload
      );
    },
  },
  actions: {
    async getServices(context) {
      console.log("CALLING getServices API");
      try {
        const response = await axiosInstance.get("/admin/services");
        await sleeper({ duration: 1500 });
        context.commit("fillServices", response.data.services);
      } catch (error) {
        toast.error(error?.message || "Something went wrong");
        console.log("ERROR ", error);
      }
    },
    async addService(context, payload) {
      try {
        const response = await axiosInstance.post("/admin/addServices", {
          services: [payload],
        });
        await sleeper({ duration: 1500 });
        context.commit("prependService", response.data.services);
        toast.success("Added Service");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        console.log(error);
      }
    },
    async deleteService(context, payload) {
      try {
        await axiosInstance.delete(`/admin/service?serviceId=${payload}`);
        await sleeper({ duration: 1500 });
        context.commit("popService", payload);
        toast.success("Service is deleted");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        console.log(error);
      }
    },
  },
  getters: {
    services(state) {
      return state.services;
    },
  },
};
