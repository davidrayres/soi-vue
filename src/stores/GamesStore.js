import {defineStore} from 'pinia'
import dayjs from 'dayjs'

export const useGamesStore = defineStore('gamesStore', {
  //STATE
  state: () => ({
    loading: false,
    gamesStartDate: dayjs(new Date()).format('YYYYMMDD'),
    games: [],
    sportSelection: {
      name: 'NCAAF',
      url: 'football/college-football',
      showFilter: true,
    },
    filter: {uiName: 'All FBS', dbName: 'games'},
    weekDates: [],
    betSlip: [],
  }),

  //GETTERS
  getters: {
    gamesEndDate() {
      return dayjs(this.gamesStartDate).add(7, 'day').format('YYYYMMDD')
    },

    top25() {
      return this.games.filter(game => {
        const team0 = game.competitions[0].competitors[0].curatedRank?.current
        const team1 = game.competitions[0].competitors[1].curatedRank?.current
        return team0 < 26 || team1 < 26
      })
    },
  },

  //ACTIONS
  actions: {
    async getGames() {
      this.loading = true
      const gamesUrl = `https://site.api.espn.com/apis/site/v2/sports/${this.sportSelection.url}/scoreboard?limit=1000&dates=${this.gamesStartDate}-${this.gamesEndDate}`
      const res = await fetch(gamesUrl)
      const data = await res.json()
      this.games = data.events
      console.log('GAMES', this.games)

      this.loading = false
    },

    setWeekDates() {
      this.weekDates = []

      for (let i = 0; i <= 7; i++) {
        const weekDate = dayjs(this.gamesStartDate).add(i, 'day').format('YYYY-MM-DD')
        this.weekDates.push(weekDate)
      }
    },
  },
})
