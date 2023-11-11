import {Suspense, use} from "react";

async function fetchMessage(signal = null) {
    // const response =  fetch("https://hub.dummyapis.com/delay?seconds=2", { signal });
    // return await response.text();
    try {
        const url = "http://localhost:3100/api/slow?delay=1000"
        const response = await fetch(url, { signal });
        console.log("fetchMessage: response:", response);

        if (!response.ok) {
            // Log and throw a new error with more context
            const error = new Error(`HTTP error! Status: ${response.status}`);
            console.error('Error fetching attendee data:', error);
            throw error;
        }
        return await response.json();
    } catch (error) {
        console.error('Error occurred during fetching data:', error.name);
        return { error: true, message: error.message };
    }
}

export default function Modal() {

    const messagePromise = fetchMessage();

    return (
        <Suspense fallback={<p>⌛Downloading message...</p>}>
            <ShowMessage messagePromise={messagePromise} />
        </Suspense>
    )
}

function ShowMessage({ messagePromise}) {
    const message = use(messagePromise);
    console.log("ShowMessage: message:", message.message);
    return <p>Here is the message: {message.message}</p>;
}