import Dexie from '../third_party/dexie.es.js'
import { $, initSate, stateChange } from './state.js'
import { actions } from './actions/actions.js'

export const db = new Dexie('steps')
db.version(6).stores({
  events: 'id, text',
  statements: 'id, type, text, premises, modifiers',
  params: 'id',
})

export const loadDb = async () => {
  initSate()
  await db.statements.each((statement) => {
      $.statements[statement.id] = statement
    })
  await db.events.each((event) => {
    $.events[event.id] = event
  })
  //TODO: shorten loading of params from DB
  const lastId = await db.params.get('lastId')
  if (lastId === undefined) {
    db.params.add({id: 'lastId', ...$.lastId})
  } else {
    const {event, statement} = lastId
    $.lastId = {event, statement}
  }
  const users = await db.params.get('users')
  if (users === undefined) {
    db.params.add({id: 'users', names: $.users})
  } else {
    $.users = users.names
  }
  const unexported = await db.params.get('unexported')
  if (unexported === undefined) {
    db.params.add({id: 'unexported', count: $.unexported})
  } else {
    $.unexported = unexported.count
  }
  const project = await db.params.get('project')
  if (project === undefined) {
    db.params.add({id: 'project', name: $.projectName })
  } else {
    $.projectName = project.name
  }
  const mainStatement = await db.params.get('mainStatement')
  if (mainStatement === undefined) {
    db.params.add({id: 'mainStatement', sid: $.mainStatement })
  } else {
    $.mainStatement = mainStatement.sid
  }
}

let enableHooks = true
const mainTables = ['statements', 'events']
const editEvents = ['creating', 'updating', 'deleting']
for (const table of mainTables) {
  for (const event of editEvents) {
    db[table].hook(event, () => {
      if (enableHooks) {
        setTimeout(() => {
          $.unexported++
          db.params.update('unexported', { count: $.unexported })
        })
      }
    })
  }
}

export const exportDb = async () => {
  $.unexported = 0
  await db.params.update('unexported', { count: 0 })

  const tables = {}
  for (const table of db.tables) {
    tables[table.name] = await table.toArray()
  }
  const blob = new Blob(
    [JSON.stringify(tables, null, 2)],
    {type: "application/json"}
  )
  const now = new Date()
  const dateStr = (now.getMonth() + 1) + '-' + now.getDate()
  const filename = $.projectName + '_' + dateStr + '.json'
  saveAs(blob, filename);
  stateChange()
}

export const importDb = (e) => {
  const reader = new FileReader()
  reader.onload = async (e) => {
    const tables = JSON.parse(e.target.result)
    stringifyIds(tables) //TODO: remove this after 2020-03-01
    enableHooks = false
    await db.transaction('rw', Object.keys(tables), async () => {
      for (const name in tables) {
        const table = db.table(name)
        await table.clear()
        await table.bulkAdd(tables[name])
      }
    })
    enableHooks = true
    await loadDb()
    if ($.mainStatement === null) {
      stateChange()
    } else {
      actions.set.curId($.mainStatement)
    }
  }
  reader.readAsText(e.target.files[0])
}

export const deleteDb = async () => {
    enableHooks = false
    await db.tables.forEach(async (table) => {
      await table.clear()
    })
    enableHooks = true
    await loadDb()
    actions.set.screen('settings')
}

const stringifyIds = (tables) => {
  for (const event of tables.events) {
    event.id = event.id.toString()
  }
  for (const statement of tables.statements) {
    const { id, type, premises, causation } = statement
    statement.id = id.toString()
    if (premises.type === 'statements') {
      premises.ids = premises.ids.map(id => id.toString())
    } else if (premises.type === 'causalNet') {
      if (premises.event !== null) {
        premises.event = premises.event.toString()
      }
    }
    if (type === 'causation') {
      if (causation.effect !== null) {
        causation.effect = causation.effect.toString()
      }
    }
  }
  const msObj = tables.params.find(({id}) => id === 'mainStatement')
  if (msObj.sid) {
    msObj.sid = msObj.sid.toString()
  }
}
