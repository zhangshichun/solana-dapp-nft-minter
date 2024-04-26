const URLInput = ({ value, onChange }) => {
  return (
    <div>
      <input
        className="input input-bordered w-full"
        type="text"
        placeholder="Enter your URL here"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
export default URLInput;
