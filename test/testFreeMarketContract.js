const { ethers } = require("hardhat");
const chai = require("chai");
const expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('FreeMarket', function() {

    it('Should add, remove, and transact merchandise successfully', async () => {

        // Deploy FreeMarket contract
        const FreeMarket = await ethers.getContractFactory('FreeMarket');
        const freemarket = await FreeMarket.deploy();
        await freemarket.deployed();

        // First address deploys contract, rest are addresses of users
        const [_, storeA, customerA] = await ethers.getSigners();

        // StoreA adds merchandise to FreeMarket
        await freemarket.connect(storeA).addMerchandise( // id=1
            'https://fm.com/one',
            10, //supply
            ethers.utils.parseUnits('1', 'ether') // price
        );
        await freemarket.connect(storeA).addMerchandise( // id=2
            'https://fm.com/two',
            5, //supply
            ethers.utils.parseUnits('0.5', 'ether') // price
        );
        await freemarket.connect(storeA).addMerchandise( // id=3
            'https://fm.com/three',
            1, //supply
            ethers.utils.parseUnits('3', 'ether') // price
        );
        let merchandiseAll = await freemarket.fetchMerchandiseAll();
        expect(merchandiseAll.length).to.equal(3);

        // Customer buys merchandise from StoreA, merchandiseId=2 goes OOS
        await freemarket.connect(customerA).transactMerchandise(
            1, // merchandiseId
            8, // quantity
            {value: ethers.utils.parseUnits('8', 'ether')} // payment
        );
        await freemarket.connect(customerA).transactMerchandise(
            2, // merchandiseId
            5, // quantity
            {value: ethers.utils.parseUnits('2.5', 'ether')} // payment
        );
        let merchandiseFromStoreA = await freemarket.fetchMerchandiseFrom(storeA.address);
        expect(merchandiseFromStoreA.length).to.equal(3);
        merchandiseAll = await freemarket.fetchMerchandiseAll();
        expect(merchandiseAll.length).to.equal(3);

        // StoreA removes merchandise from FreeMarket
        await freemarket.connect(storeA).removeMerchandise(
            3 // merchandiseId
        );
        merchandiseFromStoreA = await freemarket.fetchMerchandiseFrom(storeA.address);
        expect(merchandiseFromStoreA.length).to.equal(2);
        merchandiseAll = await freemarket.fetchMerchandiseAll();
        expect(merchandiseAll.length).to.equal(2);

        // // Log all in-stock merchandise to console
        // merchandiseAll = await Promise.all(merchandiseAll.map(async i => {
        //     let merch = {
        //         seller: i.seller.toString(),
        //         supply: i.supply,
        //         price: i.price,
        //         merchandiseId: i.merchandiseId
        //     };
        //     return merch;
        // }));
        // console.log('merchandiseAll: ', merchandiseAll)

        // // Log all merchandise from StoreA to console
        // merchandiseFromStoreA = await Promise.all(merchandiseFromStoreA.map(async i => {
        //     let merch = {
        //         seller: i.seller.toString(),
        //         supply: i.supply,
        //         price: i.price,
        //         merchandiseId: i.merchandiseId
        //     };
        //     return merch;
        // }));
        // console.log('merchandiseFrom: ', merchandiseFromStoreA)
    });

    it('Should throw an error if a customer tries to buy out-of-stock merchandise', async () => {
        
        // Deploy FreeMarket contract
        const FreeMarket = await ethers.getContractFactory('FreeMarket');
        const freemarket = await FreeMarket.deploy();
        await freemarket.deployed();

        // First address deploys contract, rest are addresses of users
        const [_, storeA, customerA] = await ethers.getSigners();

        // StoreA adds merchandise to FreeMarket
        await freemarket.connect(storeA).addMerchandise(
            'https://fm.com/one',
            0, //supply
            ethers.utils.parseUnits('1', 'ether') // price
        );

        // Customer tries to buy out-of-stock merchandise 
        expect(
            freemarket.connect(customerA).transactMerchandise(
                1, // merchandiseId
                10, // quantity
                {value: ethers.utils.parseUnits('10', 'ether')} // payment
        ))
        .to.be.rejectedWith(Error, 'Insufficient supply');
    });

    it('Should throw an error if a user tries to remove merchandise they do not own', async () => {
        
        // Deploy FreeMarket contract
        const FreeMarket = await ethers.getContractFactory('FreeMarket');
        const freemarket = await FreeMarket.deploy();
        await freemarket.deployed();

        // First address deploys contract, rest are addresses of users
        const [_, storeA, customerA] = await ethers.getSigners();

        // StoreA adds merchandise to FreeMarket
        await freemarket.connect(storeA).addMerchandise(
            'https://fm.com/one',
            1, //supply
            ethers.utils.parseUnits('1', 'ether') // price
        );

        freemarket.connect(customerA).removeMerchandise(
            1, // merchandiseId
        )

        // Customer tries to remove merchandise from FreeMarket
        merchandiseFromStoreA = await freemarket.fetchMerchandiseFrom(storeA.address);
        expect(merchandiseFromStoreA.length).to.equal(1);

    });
});

// npx hardhat test