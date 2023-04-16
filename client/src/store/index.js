import { createStore } from "vuex";
import { userModule } from "./user";
import { serviceModule } from "./services";
import { bookingsModule } from "./bookings";

// Create a new store instance.
export const store = createStore({
  modules: {
    user: userModule,
    services: serviceModule,
    bookings: bookingsModule,
  },
});
