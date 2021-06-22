import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [data, setData] = useState();

  useEffect(() => {
    (async function () {
      const { message } = await (
        await fetch('/api/HttpTrigger1?name=Dima')
      ).json();
      setData(message);
    })();
  }, []);

  return <h1>{data}</h1>;
};

ReactDOM.render(<App />, document.getElementById('root'));
