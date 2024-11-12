interface DisplayRoundsProps {
    rounds: number;
    currentRound: number;
}

const DisplayRounds: React.FC<DisplayRoundsProps> = ({ rounds, currentRound }) => {
    return (
        <div className="text-gray-400 mb-5 font-mono text-2xl p-4 text-center">
            Round {currentRound}/{rounds}
        </div>
    );
}

export default DisplayRounds;
