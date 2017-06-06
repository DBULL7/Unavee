 export const checkDatabaseForSearch = (search, setState, scrubbedTweets) => {
  fetch(`/api/v1/${search}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    databaseSearchResult(data, setState, scrubbedTweets)
    setState({search: search})
  }).catch(error => {
    console.log(error)
    fullContactAPICall(search, setState, scrubbedTweets)
  })
}

const databaseSearchResult = (data, setState, scrubbedTweets) => {
  const { name, organization, title, location, picture, LinkedIn, twitter, twitterID } = data[0]
  setState({ name: name,
                  organization: organization,
                  title: title,
                  location: location,
                  picture: picture,
                  LinkedIn: LinkedIn,
                  twitter: twitter,
                  twitterID: twitterID
                })
  getTweets(twitterID, setState, scrubbedTweets)
}


const fullContactAPICall = (search, setState, scrubbedTweets) => {
  fetch(`/api/v1/user?email=${search}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: search
    })
  })
  .then(results => results.json())
  .then((data) => {
    console.log(data)
    scrubSearch(data, setState, scrubbedTweets, search)
  }).catch(error => {
    console.log(error)
    setState({errorMessage: true})
  })
}

const scrubSearch = (data, setState, scrubbedTweets, search) => {
  const { contactInfo, demographics, socialProfiles, organizations, photos } = data
  let twitter = ''
  let linkedin = ''
  let twitterID = ''
  if (socialProfiles) {
    socialProfiles.forEach(account => {
      if (account.type === 'twitter') {
        twitter = account.url
        twitterID = account.id
        getTweets(account.id, scrubbedTweets)
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
  const test = (organizations) => {
    if (organizations) {
      return organizations[0].title
    } else {
      return ''
    }
  }
  const test2 = (organizations) => {
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
  fetch('/api/v1/searches/new', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
                          search: search,
                          name: contactInfo.fullName,
                          organization: test2(organizations),
                          title: test(organizations),
                          location: location(demographics),
                          picture: picture,
                          LinkedIn: linkedin,
                          twitter: twitter,
                          twitterID: twitterID
    })
  }).then(res => res.json())
  .then(data => {
    console.log(data)
  })
}

const getTweets = (twitterID, setState, scrubbedTweets) => {
  if(twitterID) {
    fetch('api/v1/tweets', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: twitterID})
    })
    .then(results => results.json())
    .then((data) => {
      console.log(data)
      scrubTweets(data, scrubbedTweets)
      setState({lookedUpTweets: data})
    }).catch(error => {
      console.log(error)
    })
  }
}

const scrubTweets = (data, scrubbedTweets) => {
  console.log(data);
  data.forEach((tweet) => {
    scrubbedTweets.contentItems.push({
      "content": tweet.text,
      "contenttype": "text/plain",
      "id": tweet.id,
      "language": "en"
    })
  })
  console.log(scrubbedTweets.contentItems);
}
