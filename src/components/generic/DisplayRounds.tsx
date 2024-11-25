interface DisplayRoundsProps {
    rounds: number;
    currentRound: number;
}

const DisplayRounds: React.FC<DisplayRoundsProps> = ({ rounds, currentRound }) => {
    return (
        <div className="flex items-baseline gap-x-2">
            <div className="text-lg font-semibold tracking-tight text-white">{currentRound}</div>
            <div className="text-sm text-gray-400">/ {rounds}</div>
        </div>
    );
};

export default DisplayRounds;
