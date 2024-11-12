interface TabataInputProps {
    workMinutes: number;
    workSeconds: number;
    restMinutes: number;
    restSeconds: number;
    rounds: number;
    onWorkMinutesChange: (minutes: number) => void;
    onWorkSecondsChange: (seconds: number) => void;
    onRestMinutesChange: (minutes: number) => void;
    onRestSecondsChange: (seconds: number) => void;
    onRoundsChange: (rounds: number) => void;
    disabled?: boolean;
}

const TabataInput: React.FC<TabataInputProps> = ({
    workMinutes = 0,
    workSeconds = 0,
    restMinutes = 0,
    restSeconds = 0,
    rounds = 1,
    onWorkMinutesChange = () => {},
    onWorkSecondsChange = () => {},
    onRestMinutesChange = () => {},
    onRestSecondsChange = () => {},
    onRoundsChange = () => {},
    disabled = false,
}) => {
    const minuteOptions = Array.from({ length: 61 }, (_, i) => i);
    const secondOptions = Array.from({ length: 60 }, (_, i) => i);
    const roundOptions = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className="flex flex-col space-y-4 items-center mt-8">
            <div className="flex space-x-4">
                <h1 className="text-lg font-semibold text-white self-center">Work:</h1>
                <div className="flex flex-row-reverse items-center">
                    <label className="text-lg font-semibold text-white">Minutes</label>
                    <select
                        value={workMinutes}
                        onChange={(e) => onWorkMinutesChange(Number(e.target.value))}
                        disabled={disabled}
                        className={`mr-2 py-2 px-4 bg-gray-800 border-2 border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xl ${
                            disabled ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                    >
                        {minuteOptions.map((minute) => (
                            <option key={minute} value={minute}>{minute}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-row-reverse items-center">
                    <label className="text-lg font-semibold text-white">Seconds</label>
                    <select
                        value={workSeconds}
                        onChange={(e) => onWorkSecondsChange(Number(e.target.value))}
                        disabled={disabled}
                        className={`mr-2 py-2 px-4 bg-gray-800 border-2 border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xl ${
                            disabled ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                    >
                        {secondOptions.map((second) => (
                            <option key={second} value={second}>{second}</option>
                        ))}
                    </select>
                </div>
            </div>


            <div className="flex space-x-4">
                <h1 className="text-lg font-semibold text-white self-center">Rest:</h1>
                <div className="flex flex-row-reverse items-center">
                    <label className="text-lg font-semibold text-white">Minutes</label>
                    <select
                        value={restMinutes}
                        onChange={(e) => onRestMinutesChange(Number(e.target.value))}
                        disabled={disabled}
                        className={`mr-2 py-2 px-4 bg-gray-800 border-2 border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xl ${
                            disabled ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                    >
                        {minuteOptions.map((minute) => (
                            <option key={minute} value={minute}>{minute}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex flex-row-reverse items-center">
                    <label className="text-lg font-semibold text-white">Seconds</label>
                    <select
                        value={restSeconds}
                        onChange={(e) => onRestSecondsChange(Number(e.target.value))}
                        disabled={disabled}
                        className={`mr-2 py-2 px-4 bg-gray-800 border-2 border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xl ${
                            disabled ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                    >
                        {secondOptions.map((second) => (
                            <option key={second} value={second}>{second}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="flex flex-row-reverse items-center">
                    <label className="text-lg font-semibold text-white">Rounds</label>
                    <select
                        value={rounds}
                        onChange={(e) => onRoundsChange(Number(e.target.value))}
                        disabled={disabled}
                        className={`mr-2 py-2 px-4 bg-gray-800 border-2 border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xl ${
                            disabled ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                    >
                        {roundOptions.map((round) => (
                            <option key={round} value={round}>{round}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TabataInput;