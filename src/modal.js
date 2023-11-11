import { Suspense, use, useState } from "react";

export default function Modal() {
  const messagePromise = fetchMessage();

  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <ShowMessage messagePromise={messagePromise} />
    </Suspense>
  );
}

async function fetchMessage() {
  try {
    const url = "http://localhost:3100/api/slow?delay=2000";
    const response = await fetch(url);
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

function ShowMessage({ messagePromise }) {
  const message = use(messagePromise);
  console.log("ShowMessage: message:", message.message);
  return <p>Here is the message: {message.message}</p>;
}
