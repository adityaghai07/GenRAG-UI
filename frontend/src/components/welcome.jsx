import bot from "../assets/bot.png";

const Welcome = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 h-full">
      <div className="flex gap-2">
        <div className="text-white font-bold text-4xl font-sans">
          Chat with PDF files using PDF-ChatterBox!
        </div>
        <img src={bot} alt="" width={32} />
      </div>
      <div className="text-[#9da3af]">Welcome to the chat!</div>
      <div className="flex gap-2">
        <img src={bot} alt="" />
        <div className="text-[#9da3af]">
          Upload some pdfs and ask me a question
        </div>
      </div>
    </div>
  );
};

export default Welcome;
