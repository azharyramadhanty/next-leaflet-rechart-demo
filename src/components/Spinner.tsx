type Props = {
    type: 'regular' | 'macos';
}

const Spinner: React.FC<Props> = ({ type = 'regular' }) => {
    return type === 'regular' ?
        (
            <div className="flex justify-center items-center">
                <div className="w-3 h-3 border-4 border-[#E21328] border-t-transparent rounded-full animate-spin"></div>
            </div>
        ) : (
            <div className="relative w-1 h-1 flex justify-center items-center">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3 bg-gray-900 rounded-full"
                        style={{
                            transform: `rotate(${i * 45}deg) translate(20px)`,
                            animation: `fade 1.2s linear infinite`,
                            animationDelay: `${i * 0.15}s`,
                        }}
                    ></div>
                ))}

                {/* Custom Keyframes for Fade Effect */}
                <style>
                    {`
                  @keyframes fade {
                    0% { opacity: 1; }
                    100% { opacity: 0.2; }
                  }
                `}
                </style>
            </div>
        )
};

export default Spinner;