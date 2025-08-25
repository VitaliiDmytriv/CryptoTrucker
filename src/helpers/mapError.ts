import { ErrorResponse } from "../types/index";

function isErrorResponse(err: any): err is ErrorResponse {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof err.message === "string" &&
    ("code" in err ? typeof err.code === "string" : true)
  );
}

export function mapError(err: unknown): ErrorResponse {
  if (isErrorResponse(err)) {
    return err;
  }

  if (err instanceof TypeError) {
    return {
      message: "No internet conection",
      code: "network",
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      code: "unexpected",
    };
  }

  return {
    message: "Unknown error occurred",
    code: "unknown",
  };
}
