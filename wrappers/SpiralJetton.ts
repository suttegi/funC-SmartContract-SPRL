import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SpiralJettonConfig = {};

export function spiralJettonConfigToCell(config: SpiralJettonConfig): Cell {
    return beginCell().endCell();
}

export class SpiralJetton implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SpiralJetton(address);
    }

    static createFromConfig(config: SpiralJettonConfig, code: Cell, workchain = 0) {
        const data = spiralJettonConfigToCell(config);
        const init = { code, data }; 
        return new SpiralJetton(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(), 
        });
    }

    async getJettonData(provider: ContractProvider): Promise<{ totalSupply: bigint, adminAddress: Address, content: Cell, walletCode: Cell }> {
        const result = await provider.get('get_jetton_data', []); 
        return {
            totalSupply: result.stack.readBigNumber(), 
            adminAddress: result.stack.readAddress(), 
            content: result.stack.readCell(), 
            walletCode: result.stack.readCell()
        };
    }

    async getWalletAddress(provider: ContractProvider, ownerAddress: Address): Promise<Address> {
        const result = await provider.get('get_wallet_address', 
            [{ 
                type: 'slice', 
                cell: beginCell().storeAddress(ownerAddress).endCell() }]);
        return result.stack.readAddress(); 
    }

    async mintTokens(provider: ContractProvider, via: Sender, toAddress: Address, amount: bigint, value: bigint) {
        const body = beginCell()
            .storeUint(0x18, 32)
            .storeAddress(toAddress) 
            .storeCoins(amount) 
            .endCell();

        await provider.internal(via, {
            value, 
            sendMode: SendMode.PAY_GAS_SEPARATELY, 
            body, 
        });
    }
}
