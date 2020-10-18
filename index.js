require('dotenv').config()
const axios = require('axios').default;
const { performance } = require('perf_hooks');
const sheet = require('./sheets')

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.GITHUB_AUTH_TOKEN}`;

const t0 = performance.now()
const repo = "referrals"
const headerSheet = ['id_sha', 'url', 'author', 'date', 'description']

const getCommits = async (repository) => {
  return await axios({
    method: 'get',
    url: 'https://api.github.com/repos/sumup/' + repository + '/commits?since=2020-09-01T20:11:10+0300&per_page=10'
  })
    .then(function (response) {
      const lastCommits = response.data;
      const commitArray = [];
      for (comm of lastCommits) {
        const commObj = {
          id_sha: comm.sha,
          url: comm.url,
          author: comm.commit.author.name,
          date: (comm.commit.author.date.slice(0, 10)),
          description: comm.commit.message
        }
        commitArray.push(commObj);
      }
      console.log(`Total commits: ${commitArray.length}`)
      return commitArray;
    });
}

function formatPerformanceTime(t0, t1) {
  let result = t1 - t0;
  var seconds = ((result % 60000) / 1000).toFixed(2);
  console.log('It took ' + seconds + ' seconds');
}

const listCommits = async (repo) => {
  return await getCommits(repo);
}

const fillSheetWithCommits = async (header, repository) => {
  listCommits(repository)
    .then(async commits => {
      await sheet.populateSheet(header, commits)

      const t1 = performance.now()
      formatPerformanceTime(t0, t1)
    })
}

fillSheetWithCommits(headerSheet, repo)
