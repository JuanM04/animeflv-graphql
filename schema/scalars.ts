import { asNexusMethod } from "@nexus/schema";
import { GraphQLDate } from "graphql-iso-date";

export const Date = asNexusMethod(GraphQLDate, "date", "Date");
