import { HookCallbacks } from "async_hooks";
import axios from "axios";
import { Navigate, NavigateFunction, useNavigate } from "react-router";
import { toast } from "react-toastify";

export const handleError = (error: any) => {
  debugger;
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const status = error.response?.status;

    if (status === 401) {
      toast.warning("Please login");
    } else if (Array.isArray(data)) {
      for (let val of data) {
        toast.warning(val?.description ?? JSON.stringify(val));
      }
    } else if (typeof data === "string") {
      toast.warning(data);
    } else if (typeof data === "object" && data !== null) {
      toast.warning("An unexpected error occurred.");
    } else {
      toast.warning("An unknown error occurred.");
    }
  } else {
    console.error("Unknown error:", error);
    toast.error("Unexpected error occurred.");
  }
};
