import { ErrorResponse } from "../types/index";

function isStructuredError(err: any): err is ErrorResponse {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof err.message === "string" &&
    "code" in err &&
    typeof err.code === "string"
  );
}

export function mapError(err: unknown): ErrorResponse {
  if (isStructuredError(err)) {
    return err;
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      code: "server-error",
      status: 0,
    };
  }

  return {
    message: "An unknown application error occurred.",
    code: "unknown",
    status: 0,
  };
}
