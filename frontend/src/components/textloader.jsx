const TextLoader = () => {
  return (
    <div className="flex items-center">
      <div className="text-base text-[#444444] mt-2">Generating response</div>
      <div className="loading loading03 flex gap-2 text-[#444444] pl-4">
        <span>.</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  );
};

export default TextLoader;
