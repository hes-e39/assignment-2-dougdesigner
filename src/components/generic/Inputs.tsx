import Select from './Select';

interface InputsProps {
    minutes: number;
    seconds: number;
    rounds?: number;
    onMinutesChange?: (value: number) => void;
    onSecondsChange?: (value: number) => void;
    onRoundsChange?: (value: number) => void;
    disabled?: boolean;
}

const Inputs: React.FC<InputsProps> = ({ minutes = 0, seconds = 0, rounds = 0, onMinutesChange = () => {}, onSecondsChange = () => {}, onRoundsChange = () => {}, disabled = false }) => {
    const minuteOptions = Array.from({ length: 61 }, (_, i) => i);
    const secondOptions = Array.from({ length: 60 }, (_, i) => i);
    const roundOptions = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="flex space-x-4 mt-8">
            <Select
                id="minutes"
                label="Minutes"
                value={minutes}
                options={minuteOptions}
                onChange={onMinutesChange}
                disabled={disabled}
            />
            <Select
                id="seconds"
                label="Seconds"
                value={seconds}
                options={secondOptions}
                onChange={onSecondsChange}
                disabled={disabled}
            />

            {/* Rounds input */}
            {rounds > 0 && (
                <Select
                    id="rounds"
                    label="Rounds"
                    value={rounds}
                    options={roundOptions}
                    onChange={onRoundsChange}
                    disabled={disabled}
                />
            )}
        </div>
    );
};

export default Inputs;
