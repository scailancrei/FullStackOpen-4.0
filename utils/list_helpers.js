const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const array = blogs.map((e) => {
    return e.likes
  })

  const likes = array.reduce((previousNum, nextNum) => {
    return previousNum + nextNum
  })
  return likes
}

const favouriteBlog = (blogs) => {
  const array = blogs.map((e) => {
    return e.likes
  })
  const mostLiked = array.reduce((previousNum, nextNum) => {
    return Math.max(previousNum, nextNum)
  })

  return blogs.filter((e) => e.likes === mostLiked)
}

const mostBlog = (blogs) => {
  const authors = blogs.reduce((accumulator, value) => {
    const aut = value.author
    accumulator[aut] = (accumulator[aut] || 0) + 1
    return accumulator
  }, {})

  const data = Object.entries(authors).reduce(
    (accumulator, [autor, blog]) => {
      if (blogs > accumulator) {
        return { autor, blog }
      }

      return accumulator
    },
    { author: "", blogs: 0 }
  )

  return data
}

const authorMostLiked = (blogs) => {
  const author = blogs.reduce((accumulator, value) => {
    const aut = value.author
    const likes = value.likes
    accumulator[aut] = (accumulator[aut] || 0) + likes

    return accumulator
  }, {})

  const data = Object.entries(author).reduce(
    (accumulator, [author, likes]) => {
      if (likes > accumulator.likes) {
        return { author, likes }
      }
      return accumulator
    },
    { author: "", likes: 0 }
  )
  return data
}

export default { dummy, totalLikes, favouriteBlog, mostBlog, authorMostLiked }
