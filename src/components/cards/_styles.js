export default ({ theme, sum, px }) => {
  const gap = 10

  return {
    // ALL CARDS
    cardStyles: {
      position: 'relative',
      backgroundColor: theme.cardBackground,
      borderRadius: 3,
      overflow: 'hidden',
      padding: px(sum(theme.cardHeaderHeight, theme.padding), theme.padding, theme.padding),
      ...theme.shadow2
    },
    itemStyles: {
      margin: px(0, theme.cardSpace, theme.cardSpace)
    },

    // FULL CARD
    cardFullStylesWithTabs: {
      position: 'relative',
      height: `calc(100vh - ${px(sum(
        theme.inputHeight,
        theme.headerOffset,
        theme.tabHeight,
        sum(theme.cardSpace, theme.cardSpace, 0, 0), // top right bottom left
        theme.footerHeight
      ))})`
    },
    cardFullStylesWithoutTabs: {
      position: 'relative',
      height: `calc(100vh - ${px(sum(
        theme.inputHeight,
        theme.headerOffset,
        sum(theme.cardSpace, theme.cardSpace, 0, 0), // top right bottom left
        theme.footerHeight
      ))})`
    },
    embedStyles: {
      padding: 0,
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: theme.cardHeaderHeight
    },

    // IMAGES CARD
    cardImagesStyles: {
      margin: 0,
      padding: 0
    },
    imagesStyles: {
      lineHeight: 0,
      columnCount: 5,
      columnGap: gap,
      '@media (max-width: 1200px)': {
        columnCount: 4
      },
      '@media (max-width: 1000px)': {
        columnCount: 3
      },
      '@media (max-width: 800px)': {
        columnCount: 2
      },
      '@media (max-width: 400px)': {
        columnCount: 1
      }
    },
    imgStyles: {
      width: '100%',
      height: 'auto',
      margin: px((gap / 2), 0)
    },

    // LIST CARD
    cardListStyles: {
      display: 'block',
      listStyleType: 'none',
      padding: 0,
      margin: '0.5rem 0 1rem 0',
      borderRadius: 2,
      ...theme.shadow1
    },
    cardListItemStyles: {
      backgroundColor: 'white',
      lineHeight: '1.9rem',
      padding: '10px 20px',
      margin: 0,
      borderBottom: '1px solid #e0e0e0'
    }
  }
}
