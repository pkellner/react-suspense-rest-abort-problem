import { Suspense, use, useEffect, useRef, useState } from "react";

async function fetchMessage(signal = null) {
  try {
    const url = "http://localhost:3100/api/slow?delay=2000";
    const response = await fetch(url, { signal });
    console.log("fetchMessage: response:", response);

    if (!response.ok) {
      // Log and throw a new error with more context
      const error = new Error(`HTTP error! Status: ${response.status}`);
      console.error("Error fetching attendee data:", error);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error occurred during fetching data:", error.name);
    return { error: true, message: error.message };
  }
}

export default function Modal() {
  const [messagePromise, setMessagePromise] = useState(null);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    console.log(
      "Modal: useEffect: abortControllerRef.current:",
      abortControllerRef.current,
    );
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      setMessagePromise(() => fetchMessage(signal));
    }
    return () => {
      console.log(
        "Modal:cleanup: useEffect: abortControllerRef.current:",
        abortControllerRef.current,
      );
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <>
      {messagePromise && (
        <Suspense fallback={<p>⌛Downloading message...</p>}>
          <ShowMessage messagePromise={messagePromise} />
        </Suspense>
      )}
    </>
  );
}

function ShowMessage({ messagePromise }) {
  const message = use(messagePromise);
  console.log("ShowMessage: message:", message.message);
  return <p>Here is the message: {message.message}</p>;
}
