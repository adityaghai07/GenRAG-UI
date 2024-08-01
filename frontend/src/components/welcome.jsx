import bot from "../assets/bot.png";
import robot from "../assets/robot.gif";

const Welcome = () => {
  return (
    <div className="flex flex-col justify-center items gap-4 h-full">
      <div className="flex gap-2 items-center">
        <div className="text-white font-bold text-4xl font-sans">
          Chat with PDF using Local RAG Chatbot!
        </div>
        <img src={robot} alt="" width={128} />
      </div>
      <div className="text-[#9da3af]">Welcome to the chat!</div>
      <div className="flex items-center gap-2">
        <div className="text-[#9da3af]">
          Upload some pdfs and ask me a question
        </div>
        <img src={bot} alt="" />
      </div>
    </div>
  );
};

export default Welcome;
