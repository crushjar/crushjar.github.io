import React from 'react';
import Profile from './components/profile/Profile'
import Jar from './components/jar/Jar'
import './App.css';
import './scss/custom.scss';
import { useState, useMemo, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

type Profile = {
    _id: string;
    name: string;
    numMentions: number;
    __v: number
}

function App() {
  const queryClient = new QueryClient()
  const [mentions, setMentions] = useState<Profile[]>([])

  async function callPostApi(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST", 
      mode: "cors", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    });
    return response.json().then(res => res.access_token); 
  }

  const getMentions = useCallback(async () => {
    const response = await fetch(`${process.env.REACT_APP_MONGO_ENDPOINT_URL}`,
      {headers: new Headers({'Authorization': `Bearer ${await callPostApi(process.env.REACT_APP_MONGO_URL, {key: process.env.REACT_APP_MONGO_KEY})}`})})
    const initialMentions = await response.json()
    setMentions(initialMentions)
  }, [])

  const loading = useMemo(() => {
    getMentions()
    return mentions.length !== 0 ? false : true
  }, [mentions.length, getMentions])

  const filterMentionByName = (name: string) => {
    console.log(mentions?.filter((profile) => profile.name === name))
    return mentions?.filter((profile) => profile.name === name)[0]?.numMentions
  }

  const totalNumMentions: number = mentions.reduce((sum, mention) => sum + mention.numMentions, 0);

  if (loading) return (<div className="App App-header">Loading...</div>)

  
  console.log(mentions)

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Profile mentions={filterMentionByName('Christina')} name='Christina'/>
        <Profile mentions={filterMentionByName('Daphne')} name='Daphne'/>
        <Profile mentions={filterMentionByName('Anna')} name='Anna'/>
        <Profile mentions={filterMentionByName('Emmy')} name='Emmy'/>
        <Jar totalAmount={totalNumMentions}/>
      </div>
    </QueryClientProvider>
  );
}

export default App;
