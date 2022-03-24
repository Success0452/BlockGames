import Web3 from 'web3'
import FamousToken from '../build/contracts/FamousToken.json';
import FamousTokenSale from '../build/contracts/FTokenSale.json';
const contract = require('@truffle/contract');

export const load = async() => {
    await loadWeb3();
    const account = await loadAccount();
    const { contractFT, contractFTS } = await loadContracts();
    const { ethFunds, transactionCount, tokensSold, ethPriceN, transactions ,stakingBalance,hasStaked,timeOfStakingFor,numberOfStakers} = await loadVariables(contractFTS);
    const bal = await contractFT.balanceOf(account);
    let stakeBal = 0;
    let hasStake = false;
    let timeOfStaking = 0;

    stakeBal = stakingBalance[account];
    hasStake = hasStaked[account];
    timeOfStaking = timeOfStakingFor[account];

    console.log('stakeBal ' +stakingBalance[account] );
    console.log('account '+account);
    console.log(timeOfStakingFor[account]);

    const myYT = bal / 10**18;
    return { account, contractFTS, contractFT, ethFunds, transactionCount, tokensSold, ethPriceN, transactions, myFT,stakeBal,hasStake,timeOfStaking,numberOfStakers,stakingBalance };
};


const loadVariables = async (contractYTS) => {
    const admin = "0x161eeAc6848595480D369aD876748d7d6bbD74a0";
    const ethFunds = await window.web3.eth.getBalance(admin);

    const tCount = await contractYTS.transactionCount();
    const transactionCount = tCount.toNumber();

    const tSold = await contractYTS.tokensSold();
    const tokensSold = window.web3.utils.fromWei(tSold, 'ether');

    const ethPrice = await contractYTS.getETHPrice();
    const ethPriceN = ethPrice.toNumber();
    /*
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => uint256) public timeOfStakingFor;
    address[] public stakers;
    */
    const stakingBalance = await contractYTS.stakingBalance;
    const hasStaked = await contractYTS.hasStaked;
    const timeOfStakingFor = await contractYTS.timeOfStakingFor;
    const numberOfStakers = await contractYTS.stakers.length;

    console.log(timeOfStakingFor.length);
    console.log(numberOfStakers);


    // Make this strange for loop to get the last 10 transactions.
    const transactions = [];
    var j = 0;
    for (var i = transactionCount - 1; i >= 0 && j < 10; i--) {
        const t = await contractYTS.transaction(i);
        j++;
        transactions.push(t);
    }

    return { ethFunds, transactionCount, tokensSold, ethPriceN, transactions,stakingBalance,hasStaked,timeOfStakingFor,numberOfStakers};
};

const loadContracts = async () => {
    const FTContract = contract(FamousToken);
    YTContract.setProvider(window.web3.currentProvider);
    const FTSContract = contract(FamousTokenSale);
    FTSContract.setProvider(window.web3.currentProvider);

    const contractFT = await FTContract.deployed();
    const contractFTS = await FTSContract.deployed();

    return { contractFT, contractFTS };
};

const loadAccount = async () => {
    const account = window.web3.eth.getCoinbase();
    return account;
};

const loadWeb3 = async() => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
};