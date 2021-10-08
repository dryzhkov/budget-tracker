import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import netlify from 'netlify-auth-providers';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
}

const App = () => {
  const [data, setData] = useState<Customer[]>([]);

  const [auth, setAuth] = useState<any>({});

  const handleSignoutClick = () => {
    window.localStorage.removeItem('github-token');
    setAuth({ token: null, error: null });
  };
  const handleLoginClick = async () => {
    const data = await authWithGitHub().catch((error) => {
      console.log('Oh no', error);
      setAuth({ error, token: null });
    });
    console.log('auth data', data);
    window.localStorage.setItem('github-token', (data as any).token);
    setAuth({ token: (data as any).token, error: null });
  };

  const fetchData = async () => {
    const results = await (
      await fetch('/.netlify/functions/customers-read-all', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      })
    ).json();
    console.log(results);

    const customers = results.map((r: any) => {
      return {
        id: getId(r),
        firstName: r.data.firstName,
        lastName: r.data.lastName,
      };
    });
    setData(customers);
  };

  return (
    <>
      <div>
        {auth.token ? (
          <section>
            <p>Your token is: {auth.token}</p>
            <button onClick={handleSignoutClick}>Sign Out</button>
            <button onClick={fetchData}>Fetch data</button>
          </section>
        ) : (
          <button onClick={handleLoginClick}>Sign In Here!</button>
        )}
      </div>
      {data?.map((c) => (
        <div key={c.id}>
          {c.firstName} {c.lastName}
        </div>
      ))}
    </>
  );
};

function getId(item: any) {
  if (!item.ref) {
    return null;
  }
  return item.ref['@ref'].id;
}

async function authWithGitHub() {
  return new Promise((resolve, reject) => {
    const authenticator = new netlify({
      site_id: '5bec16cd-560a-4046-9c9b-1eb23e2561c3',
    });
    authenticator.authenticate(
      { provider: 'github', scope: 'public_repo,read:org,read:user' },
      function (err: Error, data: any) {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
}

ReactDOM.render(<App />, document.getElementById('root'));
