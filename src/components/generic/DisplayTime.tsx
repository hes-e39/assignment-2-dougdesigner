interface DisplayTimeProps {
    minutes?: number;
    seconds?: number;
    hundredths?: number;
}

// Ensure two digits for minutes, seconds, annd miliseconds
const formatTime = (value: number, digits = 2) => value.toString().padStart(digits, '0');

const DisplayTime: React.FC<DisplayTimeProps> = ({ minutes = 0, seconds = 0, hundredths = 0 }) => {
    return (
        <div className="mt-2 flex items-baseline gap-x-2">
            <div className="text-4xl font-semibold tracking-tight text-white">
                {formatTime(minutes)}:{formatTime(seconds)}.{formatTime(hundredths)}
            </div>
        </div>
    );
};

export default DisplayTime;
