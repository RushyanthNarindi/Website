import React, { useEffect, useState } from 'react'

type Repo = {
  id: number
  name: string
  html_url: string
  stargazers_count: number
  language: string | null
}

const GITHUB_USERNAME = 'RushyanthNarindi' // change this to your GitHub username if needed
const GITHUB_REPO = 'Website' // repository to show "this site" stats

// Load profile data from profile.json

const HARDCODED_BIRTHDATE = '1999-08-17';
const [profile, setProfile] = useState({
  countriesVisited: ['USA', 'India', 'Abu Dhabi'],
  currentCity: 'Dallas, TX'
});

useEffect(() => {
  fetch('/src/assets/data/profile.json')
    .then(res => res.ok ? res.json() : null)
    .then(data => { if(data) setProfile(data); });
}, []);

export default function Stats(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [followers, setFollowers] = useState<number | null>(null)
  const [publicRepos, setPublicRepos] = useState<number | null>(null)
  const [totalStars, setTotalStars] = useState<number | null>(null)
  const [topRepos, setTopRepos] = useState<Repo[]>([])
  const [repoStats, setRepoStats] = useState<any | null>(null)
  const [liveAge, setLiveAge] = useState<number>(() => getLiveAge(HARDCODED_BIRTHDATE))

  // Live age calculation
  function getLiveAge(dobStr: string) {
    const dob = new Date(dobStr);
    const now = new Date();
    const diff = now.getTime() - dob.getTime();
    const years = diff / (365.2425 * 24 * 60 * 60 * 1000);
    return years;
  }

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      setError(null)
      try{
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
        if(!userRes.ok) throw new Error(`GitHub user request failed: ${userRes.status}`)
        const user = await userRes.json()

        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`)
        if(!reposRes.ok) throw new Error(`GitHub repos request failed: ${reposRes.status}`)
        const repos: Repo[] = await reposRes.json()

        const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0)
        const sorted = repos.slice().sort((a,b) => b.stargazers_count - a.stargazers_count).slice(0,5)

        if(!mounted) return
        setFollowers(user.followers ?? 0)
        setPublicRepos(user.public_repos ?? repos.length)
        setTotalStars(stars)
        setTopRepos(sorted)
        // try to fetch repo-level stats for this site (owner/repo)
        try{
          const repoRes = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`)
          if(repoRes.ok){
            const repoJson = await repoRes.json()
            if(mounted) setRepoStats(repoJson)
          }
        }catch(e){
          // ignore repo fetch errors, we'll use fallback values
        }
      }catch(e:any){
        if(!mounted) return
        setError(e?.message || 'Unknown error')
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // Live age interval
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAge(getLiveAge(HARDCODED_BIRTHDATE));
    }, 43);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container content">
      <h1>Stats</h1>

      {loading && <p>Loading statistics…</p>}
      {error && <p style={{color:'var(--accent-1)'}}>Error: {error}</p>}

      {!loading && !error && (
        <section>
          <h2>About me</h2>
          <table>
            <tbody>
              <tr><td>Current age</td><td><strong>{liveAge.toFixed(9)}</strong></td></tr>
              <tr><td>Countries visited</td><td><strong>{profile.countriesVisited.length} ({profile.countriesVisited.join(", ")})</strong></td></tr>
              <tr><td>Current city</td><td><strong>{profile.currentCity}</strong></td></tr>
            </tbody>
          </table>

          <p>GitHub user: <strong>{GITHUB_USERNAME}</strong></p>
          <ul>
            <li>Followers: <strong>{followers ?? '—'}</strong></li>
            <li>Public repos: <strong>{publicRepos ?? '—'}</strong></li>
            <li>Total stars (sum): <strong>{totalStars ?? 0}</strong></li>
          </ul>

          <h2>This site</h2>
          <table>
            <tbody>
              <tr><td>Stars this repository has on GitHub</td><td><strong>{repoStats?.stargazers_count ?? 0}</strong></td></tr>
              <tr><td>Number of people watching this repository</td><td><strong>{repoStats?.subscribers_count ?? repoStats?.watchers_count ?? 0}</strong></td></tr>
              <tr><td>Number of forks</td><td><strong>{repoStats?.forks_count ?? 0}</strong></td></tr>
              <tr><td>Number of spoons</td><td><strong>0</strong></td></tr>
              <tr><td>Number of linter warnings</td><td><strong>0</strong></td></tr>
              <tr><td>Open GitHub issues</td><td><strong>{repoStats?.open_issues_count ?? 0}</strong></td></tr>
              <tr><td>Last updated at</td><td><strong>{repoStats?.updated_at ? new Date(repoStats.updated_at).toLocaleString() : 'N/A'}</strong></td></tr>
              <tr><td>Lines of TypeScript powering this website</td><td><strong>0</strong></td></tr>
            </tbody>
          </table>

          <h2>Top repositories</h2>
          {topRepos.length === 0 && <p>No repos found.</p>}
          <ol>
            {topRepos.map(r => (
              <li key={r.id} style={{marginBottom:8}}>
                <a href={r.html_url} target="_blank" rel="noreferrer" style={{color:'var(--link)'}}>{r.name}</a>
                <span style={{marginLeft:8,color:'var(--muted)'}}>⭐ {r.stargazers_count}{r.language ? ` — ${r.language}` : ''}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
