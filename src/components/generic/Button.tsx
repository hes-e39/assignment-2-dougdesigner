interface ButtonProps {
    type: 'start' | 'pause' | 'resume' | 'reset' | 'fastforward';
    onClick?: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({type, onClick, disabled = false }) => {
    const buttonStyles = {
        start: 'bg-green-700 hover:bg-green-800 text-green-100 hover:text-green-200',
        pause: 'bg-yellow-500 hover:bg-yellow-600 text-yellow-50 hover:text-yellow-100',
        resume: 'bg-yellow-500 hover:bg-yellow-600 text-yellow-50 hover:text-yellow-100',
        // reset: 'bg-lime-700 hover:bg-lime-800 text-lime-100 hover:text-lime-200',
        reset: 'bg-blue-700 hover:bg-blue-800 text-blue-200 hover:text-blue-300',
        fastforward: 'bg-red-800 hover:bg-red-900 text-red-200 hover:text-red-300',
    };

    const disabledStyle = 'bg-gray-700 text-gray-400 cursor-not-allowed';

    const label = {
        start: 'Start ▶',
        pause: 'Pause ⏸',
        resume: 'Resume ▶',
        reset: 'Reset ↺',
        fastforward: 'Fast Forward ⏭',
    };

    return (
        <button
            onClick={onClick || (() => {})}
            disabled={disabled}
            className={`py-2 px-4 rounded-full w-full text-lg font-semibold transition-all duration-200 ${disabled ? disabledStyle : buttonStyles[type]}`}>
            {label[type]}
        </button>
    );
};

export default Button;
