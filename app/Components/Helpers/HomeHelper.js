 export const checkDatabaseForSearch = (search, setState, handleSearchResult, handleTweets) => {
  fetch(`/api/v1/${search}`)
  .then(res => res.json())
  .then(data => {
    databaseSearchResult(data, setState, handleSearchResult, handleTweets)
    setState({search: search})
  }).catch(error => {
    fullContactAPICall(search, setState, handleSearchResult, handleTweets)
  })
}

const databaseSearchResult = (data, setState, handleSearchResult, handleTweets) => {
  const { search, name, organization, title, location, picture, LinkedIn, twitter, twitterID } = data[0]
  setState({
                  // search: search,
                  name: name,
                  organization: organization,
                  title: title,
                  location: location,
                  picture: picture,
                  LinkedIn: LinkedIn,
                  twitter: twitter,
                  twitterID: twitterID
                })
  getTweets(twitterID, setState, handleTweets)
  handleSearchResult({
                      search: search,
                      name: name,
                      organization: organization,
                      title: title,
                      location: location,
                      picture: picture,
                      LinkedIn: LinkedIn,
                      twitter: twitter,
                      twitterID: twitterID
                    })
}


const fullContactAPICall = (search, setState, handleSearchResult, handleTweets) => {
  console.log(search);
  fetch(`/api/v1/user?email=${search}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: search
    })
  })
  .then(results => results.json())
  .then((data) => {
    console.log(data);
    scrubSearch(data, setState, search, handleSearchResult, handleTweets)
  }).catch(error => {
    console.log(error);
    handleSearchResult({})
    setState({errorMessage: true})
  })
}

const scrubSearch = (data, setState, search, handleSearchResult, handleTweets) => {
  const { contactInfo, demographics, socialProfiles, organizations, photos } = data
  let twitter = ''
  let linkedin = ''
  let twitterID = ''
  if (socialProfiles) {
    socialProfiles.forEach(account => {
      if (account.type === 'twitter') {
        twitter = account.url
        twitterID = account.id
        getTweets(account.id, handleTweets)
        setState({twitter: account.url})
      } else if (account.type === 'linkedin') {
        setState({LinkedIn: account.url})
        linkedin = account.url
      }
    })
  }
  let picture = ''
  if (photos) {
    let photo = photos.forEach(photo => {
      if(photo.isPrimary) {
        setState({picture: photo.url})
        picture = photo.url
      }
    })
  }

  if (organizations) {
    setState({organization: organizations[0].name, title: organizations[0].title})
  }
  if(demographics) {
    setState({location: demographics.locationGeneral})
  }
  setState({
    name: contactInfo.fullName,
  })
  const organizationTitle = (organizations) => {
    if (organizations) {
      return organizations[0].title
    } else {
      return ''
    }
  }
  const organizationName = (organizations) => {
    if (organizations) {
      return organizations[0].name
    } else {
      return ''
    }
  }
  const location = (demographics) => {
    if(demographics) {
      return demographics.locationGeneral
    } else {
      return ''
    }
  }
  handleSearchResult({
                      search: search,
                      name: contactInfo.fullName,
                      organization: organizationName(organizations),
                      title: organizationTitle(organizations),
                      location: location(demographics),
                      picture: picture,
                      LinkedIn: linkedin,
                      twitter: twitter,
                      twitterID: twitterID
                    })

  fetch('/api/v1/searches/new', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
                          search: search,
                          name: contactInfo.fullName,
                          organization: organizationName(organizations),
                          title: organizationTitle(organizations),
                          location: location(demographics),
                          picture: picture,
                          LinkedIn: linkedin,
                          twitter: twitter,
                          twitterID: twitterID
    })
  }).then(res => res.json())
  .then(data => {
    console.log(data);
  }).catch(error => {
    console.log(error);
  })
}

const getTweets = (twitterID, setState, handleTweets) => {
  if(twitterID) {
    fetch('api/v1/tweets', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: twitterID})
    })
    .then(results => results.json())
    .then((data) => {
      scrubTweets(data, handleTweets)
      setState({lookedUpTweets: data})
    }).catch(error => {
      console.log(error);
    })
  }
}

const scrubTweets = (data, handleTweets) => {
  const scrubbedTweets = { "contentItems": []}
  data.forEach((tweet) => {
    scrubbedTweets.contentItems.push({
      "content": tweet.text,
      "contenttype": "text/plain",
      "id": tweet.id,
      "language": "en"
    })
  })
  handleTweets(scrubbedTweets)
}
