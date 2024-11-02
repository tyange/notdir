type ResultStateProps = {
  message: string;
};

const ResultState = ({ message }: ResultStateProps) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="shadow-md rounded-xl w-1/3 h-1/6 border border-gray-100 flex justify-center items-center">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ResultState;
