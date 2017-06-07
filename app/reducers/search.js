export const search = (state={}, action) => {
  switch (action.type) {
    case 'SEARCH_RESULTS':
      return action.searchResults      
    default:
      return state
  }
}
