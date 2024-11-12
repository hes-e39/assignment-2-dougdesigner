interface DisplayTimeProps {
    minutes?: number;
    seconds?: number;
    hundredths?: number;
}

const DisplayTime: React.FC<DisplayTimeProps> = ({ minutes = 0, seconds = 0, hundredths = 0 }) => {
    // Ensure two digits for minutes, seconds, annd miliseconds
    const formatTime = (value: number, digits = 2) => value.toString().padStart(digits, '0');

    return (
        <div className="text-white my-5 font-mono text-4xl p-4 bg-gray-900 rounded-lg">
            {formatTime(minutes)}:{formatTime(seconds)}.{formatTime(hundredths)}
        </div>
    );
};

export default DisplayTime;
