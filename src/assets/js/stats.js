(function(){
  // Fallback values copied from your reference
  const FALLBACK = {
    about: {
      currentAge: 35.98242039275,
      countriesVisited: 53,
      currentCity: 'New York, NY'
    },
    site: {
      stars: 1615,
      watchers: 23,
      forks: 953,
      spoons: 0,
      linterWarnings: 0,
      openIssues: 1,
      lastUpdated: 'January 28, 2026',
      linesOfTS: 2272
    }
  }

  // Try fetching repo info from GitHub for live numbers
  async function getRepo(owner, repo){
    try{
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      if(!res.ok) return null
      return await res.json()
    }catch(e){
      return null
    }
  }

  async function render(){
    const container = document.querySelector('.content') || document.body

    const repo = await getRepo('RushyanthNarindi','Website')

    const html = `
      <h1>Stats</h1>
      <h2>About me</h2>
      <table>
        <tbody>
          <tr><td>Current age</td><td><strong>${FALLBACK.about.currentAge}</strong></td></tr>
          <tr><td>Countries visited</td><td><strong>${FALLBACK.about.countriesVisited}</strong></td></tr>
          <tr><td>Current city</td><td><strong>${FALLBACK.about.currentCity}</strong></td></tr>
        </tbody>
      </table>

      <h2>This site</h2>
      <table>
        <tbody>
          <tr><td>Stars this repository has on github</td><td><strong>${repo?.stargazers_count ?? FALLBACK.site.stars}</strong></td></tr>
          <tr><td>Number of people watching this repository</td><td><strong>${repo?.subscribers_count ?? repo?.watchers_count ?? FALLBACK.site.watchers}</strong></td></tr>
          <tr><td>Number of forks</td><td><strong>${repo?.forks_count ?? FALLBACK.site.forks}</strong></td></tr>
          <tr><td>Number of spoons</td><td><strong>${FALLBACK.site.spoons}</strong></td></tr>
          <tr><td>Number of linter warnings</td><td><strong>${FALLBACK.site.linterWarnings}</strong></td></tr>
          <tr><td>Open github issues</td><td><strong>${repo?.open_issues_count ?? FALLBACK.site.openIssues}</strong></td></tr>
          <tr><td>Last updated at</td><td><strong>${repo?.updated_at ? new Date(repo.updated_at).toLocaleString() : FALLBACK.site.lastUpdated}</strong></td></tr>
          <tr><td>Lines of TypeScript powering this website</td><td><strong>${FALLBACK.site.linesOfTS}</strong></td></tr>
        </tbody>
      </table>
    `

    container.innerHTML = html
  }

  render()
})()
