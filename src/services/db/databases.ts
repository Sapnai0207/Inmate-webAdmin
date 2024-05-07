import { MongoCollection } from "./dbConfig";
import { Customer, Diagnose, Treatment, User, Notification } from "./types";

export const UserCollection = MongoCollection<User>("users");
export const CustomerCollection = MongoCollection<Customer>("customers");
export const TreatmentCollection = MongoCollection<Treatment>("treatments");
export const DiagnoseCollection = MongoCollection<Diagnose>("diagnoses");
export const NotificationCollection =
  MongoCollection<Notification>("notification");
