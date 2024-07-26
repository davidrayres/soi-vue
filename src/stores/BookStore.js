import {defineStore} from 'pinia'
import dayjs from 'dayjs'

export const useBookStore = defineStore('bookStore', {
  //STATE
  state: () => ({
    betsRaw: [],
    betsStaged: [],
    unpaidBalances: [],
    loading: false,
  }),

  //GETTERS
  getters: {
    betDates: state => {
      let dates = state.betsRaw.map(bet => dayjs(bet.startDate.toDate()).format('MMM D, YYYY (ddd)'))
      dates = [...new Set(dates)]
      return dates
    },

    unpaidBalance: state => state.unpaidBalances.reduce((acc, val) => acc + +val, 0),

    runningBal: state => {
      const scoredBets = state.betsStaged.filter(bet => bet.result !== 'tbd')
      return scoredBets.reduce((acc, val) => acc + +val.result, 0)
    },
    runningWin: state => state.betsStaged.filter(bet => +bet.result > 0).length,
    runningLoss: state => state.betsStaged.filter(bet => +bet.result < 0).length,
    runningTie: state => state.betsStaged.filter(bet => +bet.result === 0).length,
  },

  //ACTIONS
  actions: {},
})
