import React from 'react'
import debounce from 'lodash/debounce'
import config from 'config'
import marked from 'marked'
import {shell} from 'electron'

const SEARCH_COMPONENT = 'com.robinmalfait.spm.search'

export default robot => {
  const {Blank} = robot.cards
  const {A, StyleSheet, css, color, px} = robot.UI
  const {TextField, Dialog, Checkbox} = robot.UI.material

  const gap = 16
  const styles = StyleSheet.create({
    wrapper: {
      margin: 0,
      marginTop: 20 + gap,
      padding: 0,
      columnCount: 3,
      columnGap: gap,
      '@media (max-width: 1200px)': {
        columnCount: 2
      },
      '@media (max-width: 800px)': {
        columnCount: 1
      }
    },
    clean: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: gap,
      pointerEvents: 'none',
      border: '1px solid #d9d9d9'
    },
    item: {
      listStyle: 'none',
      position: 'relative',
      pageBreakInside: 'avoid',
      WebkitColumnBreakInside: 'avoid',
      breakInside: 'avoid',
      paddingBottom: gap
    },
    contents: {
      padding: gap
    },
    title: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      height: 49,
      borderBottom: `1px solid ${color('grey', 200)}`,
      color: 'rgba(0, 0, 0, 0.541176)',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: px(48),
      paddingLeft: gap
    },
    description: {
      marginTop: 0
    },
    keywords: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '100%',
      display: 'inline-block',
      height: 22,
      whiteSpace: 'nowrap'
    },
    keyword: {
      color: color('grey'),
      padding: px(4, 2),
      fontSize: 12,
      marginRight: 3,
      display: 'inline-block',
      ':hover': {
        color: color('grey', 400)
      }
    },
    actions: {
      position: 'absolute',
      right: 16,
      bottom: 36,
      paddingLeft: 3,
      backgroundColor: 'white'
    },
    action: {
      backgroundColor: color('grey', 100),
      padding: px(4, 8),
      fontSize: 12,
      marginRight: 3,
      borderRadius: 2,
      display: 'inline-block',
      float: 'right'
    },
    version: {
      float: 'right',
      color: color('grey', 400),
      fontSize: 12,
      marginRight: gap,
      fontWeight: 200
    },
    badge: {
      float: 'right',
      color: color('grey', 400),
      fontSize: 12,
      marginRight: gap,
      fontWeight: 200
    },
    readme: {
      marginTop: 20
    }
  })

  const BASE = 'http://npmsearch.com/query'
  const options = {
    q: [
      'smithers',
      'plugin'
    ].join(','),
    fields: [
      'description',
      'keywords',
      'author',
      'name',
      'readme',
      'repository',
      'version'
    ].join(',')
  }

  const Search = React.createClass({
    getInitialState () {
      return {
        query: this.props.q,
        result: [],
        active: undefined,
        filters: {
          installed: true,
          notInstalled: true
        }
      }
    },
    getDefaultProps () {
      return {
        q: ''
      }
    },
    componentWillMount () {
      this.search = debounce(this.search, 500)

      this.search()
    },
    isInstalled (plugin) {
      return config.get('plugins.external').includes(plugin)
    },
    search () {
      return robot.fetchJson(`${BASE}?${robot.httpBuildQuery(options)}`)
        .then(({results}) => {
          this.setState({result: results.map(item => {
            return {
              name: item.name.join(''),
              keywords: item.keywords,
              version: item.version.join(', '),
              description: item.description.join(', '),
              readme: item.readme.join('\n'),
              rendered: marked(item.readme.join('\n'))
            }
          })})
        })
    },
    handleChange (value) {
      this.setState({query: value})
      this.search()
    },
    applyFilters (items) {
      return items.filter(item => {
        const isInstalled = this.isInstalled(item.name)

        if (isInstalled) {
          return this.state.filters.installed
            ? item
            : undefined
        }

        return this.state.filters.notInstalled
          ? item
          : undefined
      }).filter(x => !!x)
    },
    renderItem (item) {
      return (
        <div>
          <div className={css(styles.title)}>
            <A target='_blank' href={`https://www.npmjs.com/package/${item.name}`}>{item.name}</A>
            <span className={css(styles.version)}>v{item.version}</span>
            {this.isInstalled(item.name) && <span className={css(styles.badge)}>installed</span>}
          </div>
          <div className={css(styles.contents)}>
            <p className={css(styles.description)}>{item.description}</p>

            <div className={css(styles.keywords)}>
              {item.keywords.map(keyword => (
                <A target='_blank' href={`https://www.npmjs.com/search?q=${keyword}`} key={keyword} externalStyles={styles.keyword}>{keyword}</A>
              ))}
            </div>

            <div className={css(styles.actions)}>
              <A onClick={() => {
                robot.execute(`${this.isInstalled(item.name) ? 'uninstall' : 'install'} ${item.name}`)
              }} className={css(styles.action)}>{this.isInstalled(item.name) ? 'Uninstall' : 'Install'}</A>
              <A onClick={() => this.setState({active: item})} className={css(styles.action)}>Read Me</A>
            </div>
          </div>
        </div>
      )
    },
    render () {
      const {...other} = this.props
      let {query, result} = this.state
      const props = robot.deleteProps(other, [
        'q'
      ])

      result = this.applyFilters(result)

      return (
        <Blank
          title='Searching plugins'
          {...props}
        >
          <TextField
            id='query'
            name='query'
            type='text'
            floatingLabelText='Search Query'
            value={query}
            onChange={(event, newValue) => this.handleChange(newValue)}
            autoFocus
            fullWidth
          />

          <div className={css(styles.filters)}>
            <Checkbox
              checked={this.state.filters.installed}
              onCheck={(event, checked) => {
                this.setState({
                  filters: {
                    ...this.state.filters,
                    installed: checked
                  }
                })
              }}
              label='installed'
            />
            <Checkbox
              checked={this.state.filters.notInstalled}
              onCheck={(event, checked) => {
                this.setState({
                  filters: {
                    ...this.state.filters,
                    notInstalled: checked
                  }
                })
              }}
              label='not installed'
            />
          </div>

          <ul className={css(styles.wrapper)}>
            {result.map((item, i) => (
              <li key={i} className={css(styles.item)}>
                {this.renderItem(item, i)}
                <div
                  style={{display: 'none'}}
                  dangerouslySetInnerHTML={{__html: item.rendered}}
                />
                <div className={css(styles.clean)} />
              </li>
            ))}
          </ul>
          {this.state.active && (
            <Dialog
              open
              autoScrollBodyContent
              title={this.state.active.name}
              onRequestClose={() => this.setState({active: undefined})}
            >
              <div
                className={`max-100-percent ${css(styles.readme)}`}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  let found = false
                  let node = event.target
                  while (node !== event.currentTarget && !found) {
                    if (node.tagName === 'A') {
                      found = true
                      break
                    }
                    node = node.parentNode
                  }

                  if (found) {
                    shell.openExternal(node.href)
                  }
                }}
                dangerouslySetInnerHTML={{__html: this.state.active.rendered}}
              />
            </Dialog>
          )}
        </Blank>
      )
    }
  })

  robot.registerComponent(Search, SEARCH_COMPONENT)

  robot.listen(/^search ?(.*)?$/, {
    description: 'Search for available plugins',
    usage: 'search <query?>'
  }, (res) => {
    const {query = ''} = res.matches

    robot.addCard(SEARCH_COMPONENT, {q: query})
  })
}