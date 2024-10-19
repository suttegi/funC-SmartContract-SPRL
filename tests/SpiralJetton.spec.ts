import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { SpiralJetton } from '../wrappers/SpiralJetton';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SpiralJetton', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SpiralJetton');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let spiralJetton: SandboxContract<SpiralJetton>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        spiralJetton = blockchain.openContract(SpiralJetton.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await spiralJetton.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: spiralJetton.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and spiralJetton are ready to use
    });
});
