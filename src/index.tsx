import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
  const [data, setData] = useState<Customer[]>([]);

  const handleSignoutClick = () => {
    netlifyIdentity.logout();
  };
  const handleLoginClick = async () => {
    netlifyIdentity.open();
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
