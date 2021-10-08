import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// import netlify from 'netlify-auth-providers';

import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.init({
  // container: '#netlify-modal', // defaults to document.body
  locale: 'en', // defaults to 'en'
});

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
}

// Bind to events
netlifyIdentity.on('init', (user) => console.log('init', user));
netlifyIdentity.on('login', (user) => console.log('login', user));
netlifyIdentity.on('logout', () => console.log('Logged out'));
netlifyIdentity.on('error', (err) => console.error('Error', err));
netlifyIdentity.on('open', () => console.log('Widget opened'));
netlifyIdentity.on('close', () => console.log('Widget closed'));

const App = () => {
  const user = netlifyIdentity.currentUser();

  console.log('user', user);
  const [data, setData] = useState<Customer[]>([]);

  // const [auth, setAuth] = useState<any>({});

  const handleSignoutClick = () => {
    netlifyIdentity.logout();
    // window.localStorage.removeItem('github-token');
    // setAuth({ token: null, error: null });
  };
  const handleLoginClick = async () => {
    // const data = await authWithGitHub().catch((error) => {
    //   console.log('Oh no', error);
    //   setAuth({ error, token: null });
    // });
    // console.log('auth data', data);
    netlifyIdentity.open();
    // const jwt = await netlifyIdentity.refresh();
    // window.localStorage.setItem('github-token', (data as any).token);
    // setAuth({ token: null, error: null });
  };

  const fetchData = async () => {
    const results = await (
      await fetch('/.netlify/functions/customers-read-all', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token?.access_token}`,
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
        {user?.token ? (
          <section>
            <p>Your token is: {JSON.stringify(user.token)}</p>
            <button onClick={handleSignoutClick}>Sign Out</button>
            <button onClick={fetchData}>Fetch data</button>
          </section>
        ) : (
          <section>
            <button onClick={handleLoginClick}>Sign In Here!</button>
            <button onClick={fetchData}>Fetch data</button>
          </section>
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

ReactDOM.render(<App />, document.getElementById('root'));
