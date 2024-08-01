import React from "react";
import { useRouteError } from "react-router-dom";
// a hook in react which automatically catches the error object
function ErrorElement() {
  let routingError = useRouteError();
  console.log(routingError);
  return (
    <div className="error text-center mt-5 p-5 bg-warning">
      <h1>
        Error {routingError.status}: {routingError.error.message}
      </h1>
    </div>
  );
}

export default ErrorElement;
