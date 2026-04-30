"use client";

import { useEffect } from "react";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h1>Что-то пошло не так</h1>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  );
};

export default Error;