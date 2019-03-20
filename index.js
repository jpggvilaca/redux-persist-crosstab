const KEY_PREFIX = require('redux-persist/lib/constants').KEY_PREFIX
const REHYDRATE = require('redux-persist/lib/constants').REHYDRATE

module.exports = function (store, persistConfig, crosstabConfig = {}) {
  const keyPrefix = crosstabConfig.keyPrefix || KEY_PREFIX

  const { key } = persistConfig

  window.addEventListener('storage', handleStorageEvent, false)

  function handleStorageEvent (e) {
    if (e.key && e.key.indexOf(keyPrefix) === 0) {
      if (e.oldValue === e.newValue) {
        return
      }

      const statePartial = JSON.parse(e.newValue)

      const state = Object.keys(statePartial).reduce((state, reducerKey) => {

        state[reducerKey] = JSON.parse(statePartial[reducerKey])

        return state
      }, {})

      store.dispatch({
        key,
        payload: state,
        type: REHYDRATE,
      })
    }
  }
}
