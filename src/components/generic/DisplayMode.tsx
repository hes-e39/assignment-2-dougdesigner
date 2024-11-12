interface DisplayModeProps {
    mode: 'work' | 'rest';
}

const DisplayRest: React.FC<DisplayModeProps> = ({ mode }) => {
    return <div className="mt-0 text-gray-400 my-5 font-mono text-xl p-4 text-center">{mode === 'work' ? 'Work :' : 'Rest :'}</div>;
};

export default DisplayRest;
