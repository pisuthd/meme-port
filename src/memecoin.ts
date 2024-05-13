import {
    method,
    Mina,
    UInt64,
    AccountUpdate,
    AccountUpdateForest,
    TokenContract,
    Int64,
    PrivateKey,
} from "o1js"

export class MemeCoin extends TokenContract {
    // APPROVABLE API

    @method
    async approveBase(updates: AccountUpdateForest) {
        this.checkZeroBalanceChange(updates);
    }

    // constant supply
    SUPPLY = UInt64.from(10n ** 18n);

    @method
    async init() {
        super.init();

        // mint the entire supply to the token account with the same address as this contract
        this.internal.mint({ address: this.address, amount: this.SUPPLY });
    }
}