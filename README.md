# react-suspense-rest-abort-problem

Posted to StackOverflow: 

[https://stackoverflow.com/questions/77465975/problems-aborting-fetch-in-react-18-with-suspense-when-component-dismounts-reac](https://stackoverflow.com/questions/77465975/problems-aborting-fetch-in-react-18-with-suspense-when-component-dismounts-reac)

I need to abort fetch calls when a React component dismounts for any reason. The small example I've created to show this, simply creates a div with a mouse in and out event that shows and hides a component. Here is that component.

```
export default function App() {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <div className="position-relative d-inline-block">
            <div
                onMouseEnter={() => {
                    console.log("onMouseEnter");
                    setShowPopup(true);
                }}
                onMouseLeave={() => {
                    console.log("onMouseLeave");
                    setShowPopup(false);
                }}
            >
                HOVER OVER ME TO START REST DOWNLOAD, HOVER OFF TO END REST DOWNLOAD EARLY
            </div>
            {showPopup && <Modal />}
        </div>
    )
}
```

The component `Modal` is self contained in that it uses the hook `use` to resolve a promise that fetches data from REST GET endpoint that simply returns after a few seconds with a string result.

Here is that component along with the functions it uses to fetch the data.

```
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

function ShowMessage({ messagePromise }) {
  const message = use(messagePromise);
  console.log("ShowMessage: message:", message.message);
  return <p>Here is the message: {message.message}</p>;
}
```

To demonstrate the problem, all you have to do is to mouse over the displayed text and that will start the fetch. If you wait 2 seconds, the resulting string will download. If you mouse out of the div, the `abortController` should signal causing the fetch to be stopped.

What happens instead, is that as soon as you mouse over, the fetch starts and is cancelled immediately.

What I'm wanting is a good pattern to follow to be able to cancel the fetch cleanly when the component is unmounted.  Any and all advice is appreciated. As this is a Canary release I'm using, my understanding is that the React team believes this is stable enough so that frameworks can include it for production, so I'm assuming this should be very possible.

Like I said at the top, this code can all be downloaded and run at the github repo:

This REPO: https://github.com/pkellner/react-suspense-rest-abort-problem





