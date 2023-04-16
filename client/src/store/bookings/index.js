import axiosInstance from "../../util/axios";
import { toast } from "vue3-toastify";
import { sleeper } from "../../util/helper";

export const bookingsModule = {
  namespaced: true,
  state() {
    return {
      bookings: [],
      filteredBooking: [],
      completedBookings: 0,
      pendingBookings: 0,
    };
  },
  mutations: {
    fillBookings(state, payload) {
      state.bookings = payload.bookings;
      state.filteredBooking = payload.bookings;
      state.completedBookings = payload.completedBookings;
      state.pendingBookings = payload.pendingBookings;
    },
    filterBooking(state, payload) {
      state.filteredBooking = state.bookings.filter((booking) => {
        return booking.owner.email.startsWith(payload);
      });
    },
  },
  actions: {
    async getBookings(context) {
      console.log("CALLING getBookings API");
      try {
        const response = await axiosInstance.get("/admin/bookings");
        await sleeper({ duration: 1500 });
        context.commit("fillBookings", response.data);
      } catch (error) {
        toast.error(error?.message || "Something went wrong");
        console.log("ERROR ", error);
      }
    },
    async markCompleted(context, payload) {
      try {
        const response = await axiosInstance.post("/admin/markCompleted", {
          bookingId: payload,
        });
        await sleeper({ duration: 1500 });
        context.commit("fillBookings", response.data);
      } catch (error) {
        toast.error(error?.message || "Something went wrong");
        console.log("ERROR ", error);
      }
    },
  },
  getters: {
    bookings(state) {
      return state.filteredBooking;
    },
    completedBookings(state) {
      return state.completedBookings;
    },
    pendingBookings(state) {
      return state.pendingBookings;
    },
  },
};
