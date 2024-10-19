import { toNano } from '@ton/core';
import { SpiralJetton } from '../wrappers/SpiralJetton';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const spiralJetton = provider.open(SpiralJetton.createFromConfig({}, await compile('SpiralJetton')));

    await spiralJetton.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(spiralJetton.address);

    // run methods on `spiralJetton`
}
