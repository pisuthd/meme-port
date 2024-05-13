import { Field, Mina, PrivateKey, AccountUpdate, UInt64 } from 'o1js';
import { MemeCoin } from "./memecoin.js";


let Local = await Mina.LocalBlockchain({ proofsEnabled: false });
Mina.setActiveInstance(Local);

let [sender, user] = Local.testAccounts;

let { publicKey: tokenAddress, privateKey: tokenKey } =
    PrivateKey.randomKeypair();
let token = new MemeCoin(tokenAddress);
let tokenId = token.deriveTokenId();

// deploy Memecoin token contract
let deployTx = await Mina.transaction(sender, async () => {
    AccountUpdate.fundNewAccount(sender, 2);
    await token.deploy();
});
await deployTx.prove();
await deployTx.sign([tokenKey, sender.key]).send();

// transfer 1 MEME to the sender account
let transferTx = await Mina.transaction(sender, async () => {
    AccountUpdate.fundNewAccount(sender);
    await token.transfer(tokenAddress, user, UInt64.from(1n ** 18n));
});
await transferTx.prove();
await transferTx.sign([tokenKey, sender.key]).send();

console.log(`USER BALANCE : ${Mina.getBalance(user, tokenId)}`)


