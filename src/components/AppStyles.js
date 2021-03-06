export default ({ theme }) => ({
  scrollBar: {
    ...theme.scrollBar
  },
  bodyStyles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.backgroundColor,
    color: theme.color
  },
  contentStyles: {
    position: 'absolute',
    top: theme.headerOffset + theme.inputHeight,
    left: 0,
    right: 0,
    bottom: 54
  }
})
