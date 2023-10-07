import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, query) {
    let data = this.#database[table] ?? []

    if (Object.entries(query).length > 0) {
      data = data.filter(item => {
        return Object.entries(query).some(([key, value]) => {
          return String(item[key]).toLowerCase().includes(String(value).toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    this.#persist()
  }

  update(table, id, data) {
    const itemIndex = this.#database[table].findIndex(item => item.id === id)

    if (itemIndex > -1) {
      Object.entries(this.#database[table][itemIndex]).forEach((item) => {
        this.#database[table][itemIndex][item[0]] = data[item[0]] || this.#database[table][itemIndex][item[0]]
      })

      this.#persist()

      return 200
    }

    return 204
  }

  patch(table, id) {
    const itemIndex = this.#database[table].findIndex(item => item.id === id)

    if (itemIndex > -1) {
      const completed = this.#database[table][itemIndex].completed_at

      if (completed == null) {
        this.#database[table][itemIndex].completed_at = new Date()
      } else {
        this.#database[table][itemIndex].completed_at = null
      }

      this.#persist()

      return 200
    }

    return 204
  }

  delete(table, id) {
    const itemIndex = this.#database[table].findIndex(item => item.id === id)

    if (itemIndex > -1) {
      this.#database[table].splice(itemIndex, 1)
      this.#persist()
      return 200
    }

    return 204
  }

}