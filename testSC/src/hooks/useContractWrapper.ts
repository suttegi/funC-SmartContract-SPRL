import {useEffect, useState} from 'react';
import { Address, OpenedContract, toNano} from 'ton-core';
import { useInit } from './useInit';
import { MainContract } from '../contracts/ContractWrapper';
import { useTonClient } from './useTonClient';
import { useConnection } from './useConnection';

export function useContractWrapper() {
	const client = useTonClient();
	const connection = useConnection();

	const sleep =(time: number) =>
		new Promise((resolve) => setTimeout(resolve, time));


	const [contractData, setContractData] = useState<null | {
		recent_sender: Address;
		number: number;
	}>();

	const mainContract = useInit( async () => {
		if (!client) return;
		const contract = new MainContract(
			Address.parse("kQACwi82x8jaITAtniyEzho5_H1gamQ1xQ20As_1fboIfJ4h")
		);
		return client.open(contract) as OpenedContract<MainContract>;
	},[client]);

	useEffect( () => {
		async function getValue() {
			if(!mainContract) return;
			setContractData(null);
			const instack = await mainContract.getData();
			setContractData({
				recent_sender: instack.recent_sender,
				number: instack.number,
			});
			await sleep(5000);
			getValue();
		}
		getValue();
	}, [mainContract]);

	return {
		contract_address: mainContract?.address.toString(),
		...contractData,
		sendInternalMessage: () => {
			return mainContract?.sendInternalMessage(connection.sender, toNano("0.05"));
		}
	};
}


// import { useEffect, useState } from 'react';
// import { Address, OpenedContract, toNano } from 'ton-core';
// import { useInit } from './useInit';
// import { MainContract } from '../contracts/ContractWrapper';
// import { useTonClient } from './useTonClient';
// import { useConnection } from './useConnection';

// export function useContractWrapper() {
//     const client = useTonClient();
//     const connection = useConnection();

//     const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

//     const [contractData, setContractData] = useState<null | {
//         recent_sender: Address;
//         number: number;
//     }>();

//     const mainContract = useInit(async () => {
//         if (!client) return;
//         const contract = new MainContract(
//             Address.parse("EQBACrRjwTi_oR5Zqo6ZPb0rEyAyQbr2aItjdN4Iy-UzLJwB")
//         );
//         return client.open(contract) as OpenedContract<MainContract>;
//     }, [client]);

//     useEffect(() => {
//         async function getValue() {
//             if (!mainContract) return;
//             setContractData(null);
//             const instack = await mainContract.getData();
//             setContractData({
//                 recent_sender: instack.recent_sender,
//                 number: instack.number,
//             });
//             await sleep(5000);
//             getValue();
//         }
//         getValue();
//     }, [mainContract]);

//     const sendFunds = async (userWallet: string) => {
//         if (!mainContract || !connection.sender) {
//             console.error('Contract or sender not available');
//             return;
//         }

//         try {
//             const recipientAddress = Address.parse(userWallet);

//             // Используем toNano для преобразования суммы
//             const amountInNanos = toNano("0.001"); // Преобразование строки в bigint

//             // Передаем только sender и сумму
//             await mainContract.sendInternalMessage(
//                 connection.sender,
//                 amountInNanos // Передаем только два аргумента: sender и сумму
//             );
//             console.log(`Funds sent to ${userWallet}`);
//         } catch (error) {
//             console.error('Failed to send funds:', error);
//         }
//     };

//     return {
//         contract_address: mainContract?.address.toString(),
//         ...contractData,
//         sendFunds,
//     };
// }
