// Fetch profile data from profile.json
(async function(){
  let profile = {
    birthdate: '1999-08-17',
    countriesVisited: ['USA', 'India', 'Abu Dhabi'],
    currentCity: 'Dallas, TX'
  };
  try {
    const res = await fetch('/src/assets/data/profile.json');
    if(res.ok) profile = await res.json();
  } catch(e) {}

  function getLiveAge(dobStr) {
    const dob = new Date(dobStr);
    const now = new Date();
    const diff = now - dob;
    const years = diff / (365.2425 * 24 * 60 * 60 * 1000);
    return years;
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

    // Insert a span for live age
    const html = `
      <h1>Stats</h1>
      <h2>About me</h2>
      <table>
        <tbody>
          <tr><td>Current age</td><td><strong id="live-age">${getLiveAge(profile.birthdate).toFixed(9)}</strong></td></tr>
          <tr><td>Countries visited</td><td><strong>${profile.countriesVisited.length} (${profile.countriesVisited.join(", ")})</strong></td></tr>
          <tr><td>Current city</td><td><strong>${profile.currentCity}</strong></td></tr>
        </tbody>
      </table>

      <h2>This site</h2>
      <table>
        <tbody>
          <tr><td>Stars this repository has on github</td><td><strong>${repo?.stargazers_count ?? 0}</strong></td></tr>
          <tr><td>Number of people watching this repository</td><td><strong>${repo?.subscribers_count ?? repo?.watchers_count ?? 0}</strong></td></tr>
          <tr><td>Number of forks</td><td><strong>${repo?.forks_count ?? 0}</strong></td></tr>
          <tr><td>Number of spoons</td><td><strong>${FALLBACK.site.spoons}</strong></td></tr>
          <tr><td>Number of linter warnings</td><td><strong>${FALLBACK.site.linterWarnings}</strong></td></tr>
          <tr><td>Open github issues</td><td><strong>${repo?.open_issues_count ?? FALLBACK.site.openIssues}</strong></td></tr>
          <tr><td>Last updated at</td><td><strong>${repo?.updated_at ? new Date(repo.updated_at).toLocaleString() : FALLBACK.site.lastUpdated}</strong></td></tr>
          <tr><td>Lines of TypeScript powering this website</td><td><strong>${FALLBACK.site.linesOfTS}</strong></td></tr>
        </tbody>
      </table>
    `
    container.innerHTML = html

    // Live age update
    const dob = new Date(1999, 7, 17); // August is month 7 (0-based)
    const ageEl = document.getElementById('live-age');
    function updateAge() {
      if (ageEl) {
        ageEl.textContent = getLiveAge(dob).toFixed(9);
      }
    }
    updateAge();
    setInterval(updateAge, 43);
  }

  render()
})()
