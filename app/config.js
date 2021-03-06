const {resolve} = require('path')
const {writeFile, existsSync, readFileSync} = require('fs')
const {app, ipcMain} = require('electron')
const _ = require('lodash')
const mkdirp = require('mkdirp')

const CONFIG_PATH = resolve(app.getPath('userData'), 'user.config.json')
const PLUGINS_PATH = resolve(app.getPath('userData'), 'plugins')

mkdirp(PLUGINS_PATH)

const persist = () => {
  writeFile(CONFIG_PATH, JSON.stringify(config, null, '  '))
}

const defaultConfig = () => {
  return {
    plugins: {
      local: [],
      external: []
    },
    keyboardShortcuts: {
      toggleWindow: 'Alt+S'
    }
  }
}

const loadConfig = () => {
  if (existsSync(CONFIG_PATH)) {
    const config = readFileSync(CONFIG_PATH, 'utf8')
    try {
      return JSON.parse(config)
    } catch (e) {
      console.error(`ERROR\n  Could not load config file (${CONFIG_PATH})\n  Check the file, and see what's going on`)
      return defaultConfig()
    }
  }

  writeFile(CONFIG_PATH, JSON.stringify(defaultConfig(), null, '  '))
  return defaultConfig()
}

let config = loadConfig()

const get = (key, defaultValue) => {
  return _.get(config, key, defaultValue)
}

const set = (key, value) => {
  config = _.set(config, key, value)

  persist()
}

ipcMain.on('config:get', (event, key, defaultValue) => {
  event.returnValue = get(key, defaultValue)
})

ipcMain.on('config:set', (event, key, value) => {
  set(key, value)
  event.returnValue = true
})

ipcMain.on('config:getConfigPath', (event) => {
  event.returnValue = CONFIG_PATH
})

ipcMain.on('config:getPluginPath', (event) => {
  event.returnValue = PLUGINS_PATH
})

module.exports = {
  get,
  set
}
