const express = require('express')
const router = express.Router()
const db = require('../../data/dbConfig')
const { post } = require('../server')



const Accounts = {
    getAll() {
        return db('accounts')
    },
    getById(id) {
        return db('accounts').where('id', id).first()
    },
    create(account) {
        return db('accounts').insert(account)
            .then(([id]) => {
                return db('accounts').where('id', id)
            })
    },
    update(id, changes) {
        return db('accounts').where('id', id).update(changes)
    },
    delete(id) {
        return db('accounts').where('id', id).del()
    }
}



async function validateAccountId(req, res, next) {
    const { id } = req.params
    try {
        const account = await Accounts.getById(id)
        if (!account) {
            res.status(404).json({ message: 'account not found' })
        } else {
            req.account = account
            next()
        }
    }
    catch(err) {
        res.status(400).json({ message: "invalid account id" })
    }
}





router.get('/', async (req, res) => {
    try {
        const data = await Accounts.getAll()
        res.json(data)
    }
    catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', validateAccountId, async (req, res) => {
    try {
        const { id } = req.params
        const data = await Accounts.getById(id)
        res.json(data)
    }
    catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const account = req.body
        const data = await Accounts.create(account)
        res.json(data)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.put('/:id', validateAccountId, async (req, res) => {
    try {
        const { id } = req.params
        const changes = req.body
        await Accounts.update(id, changes)
        const updated = await Accounts.getById(id)
        res.json(updated)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:id', validateAccountId, async (req, res) => {
    try {
        const { id } = req.params
        await Accounts.delete(id)
        res.json({ message: `Post with ${id} was deleted` })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router