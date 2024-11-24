interface DisplayModeProps {
    mode: 'work' | 'rest';
}

const DisplayRest: React.FC<DisplayModeProps> = ({ mode }) => {
    return <div className="text-4xl font-semibold tracking-tight text-white">{mode === 'work' ? 'Work' : 'Rest'}</div>;
};

export default DisplayRest;
