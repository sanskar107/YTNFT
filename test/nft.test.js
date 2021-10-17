const { assert } = require('chai')

const YT = artifacts.require('./yt.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('YT', (accounts) => {
    let contract

    before(async() => {
        contract = await YT.deployed()
    })

    describe('deployment', async() => {
        it('deploys successfully', async()=> {
            const address = contract.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        
        it('has a name', async()=> {
            const name = await contract.name()
            assert.equal(name, "YouTube")
        })

        it('has a symbol', async()=> {
            const sym = await contract.symbol()
            assert.equal(sym, "YT")
        })
    })

    describe('minting', async() => {
        it('creates a new token', async()=> {
            const result = await contract.mint('www.youtube.com/abc')
            const totalSupply = await contract.totalSupply()
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct')

            await contract.mint('www.youtube.com/abc').should.be.rejected

        })
    })
})
