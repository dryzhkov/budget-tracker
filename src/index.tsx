import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
interface Paycheck {
  id: number;
  date: string;
  income: {
    title: string;
    amount: number;
  }[];
}

// Bind to events
const App = () => {
  const [data, setData] = useState<Paycheck[]>([]);
  const {
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
    user,
  } = useAuth0();

  const handleSignoutClick = () => {
    logout();
  };
  const handleLoginClick = async () => {
    loginWithRedirect();
  };

  const fetchData = async () => {
    const accessToken = await getAccessTokenSilently();
    const results = await (
      await fetch(`/.netlify/functions/all-paychecks-by-year?year=2021`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).json();

    const paychecks: Paycheck[] = results.map((r: any) => {
      return {
        id: getId(r),
        date: r.data.date,
        income: r.data.income,
      };
    });
    setData(paychecks);
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <div>
        {isAuthenticated && user ? (
          <section>
            <p>Your token is: {JSON.stringify(user)}</p>
            <div>
              <img src={user.picture} alt={user.name} />
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
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
          Date: {c.date} Income: {JSON.stringify(c.income)}
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

ReactDOM.render(
  <Auth0Provider
    domain="dimaryz.auth0.com"
    clientId="ehnorKu18hGNn09pl5MzItqPYciDl7UX"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
