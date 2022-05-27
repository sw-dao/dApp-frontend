import axios from "axios";

const handleError = (error: any) => {
  let errorData = "Unknown error";
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      errorData = error.response.data;
    }
  } else if (error.message) {
    errorData = error.message;
  }

  return errorData;
};

export { handleError };
