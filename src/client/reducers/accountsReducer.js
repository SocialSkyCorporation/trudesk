/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 *  Author:     Chris Brame
 *  Updated:    2/24/19 7:39 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

import { fromJS, List } from 'immutable'
import { handleActions } from 'redux-actions'
import {
  CREATE_ACCOUNT,
  DELETE_ACCOUNT,
  ENABLE_ACCOUNT,
  FETCH_ACCOUNTS,
  SAVE_EDIT_ACCOUNT,
  UNLOAD_ACCOUNTS
} from 'actions/types'

const initialState = {
  accounts: List([])
}

const reducer = handleActions(
  {
    [FETCH_ACCOUNTS.SUCCESS]: (state, action) => {
      let arr = state.accounts.toArray()
      action.payload.response.users.map(i => {
        arr.push(i)
      })
      return {
        ...state,
        accounts: fromJS(arr)
      }
    },

    [CREATE_ACCOUNT.SUCCESS]: (state, action) => {
      const resAccount = action.response.account
      const insertedAccount = state.accounts.push(fromJS(resAccount))
      return {
        ...state,
        accounts: insertedAccount.sortBy(account => account.get('fullname'))
      }
    },

    [SAVE_EDIT_ACCOUNT.SUCCESS]: (state, action) => {
      const resUser = action.response.user
      const accountIndex = state.accounts.findIndex(u => {
        return u.get('_id') === resUser._id
      })
      return {
        ...state,
        accounts: state.accounts.set(accountIndex, fromJS(resUser))
      }
    },

    [DELETE_ACCOUNT.SUCCESS]: (state, action) => {
      const isDisabled = action.response.disabled
      const accountIndex = state.accounts.findIndex(u => {
        return u.get('username') === action.payload.username
      })
      let withDisabled
      withDisabled = state.accounts.setIn([accountIndex, 'deleted'], isDisabled)
      if (!isDisabled) withDisabled = state.accounts.delete(accountIndex)
      return {
        ...state,
        accounts: withDisabled
      }
    },

    [ENABLE_ACCOUNT.SUCCESS]: (state, action) => {
      const accountIndex = state.accounts.findIndex(u => {
        return u.get('username') === action.payload.username
      })
      return {
        ...state,
        accounts: state.accounts.setIn([accountIndex, 'deleted'], false)
      }
    },

    [UNLOAD_ACCOUNTS.SUCCESS]: state => {
      return {
        ...state,
        accounts: state.accounts.clear()
      }
    }
  },
  initialState
)

export default reducer
