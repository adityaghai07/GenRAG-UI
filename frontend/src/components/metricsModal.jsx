import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import PropTypes from "prop-types";
import bot from "../assets/bot.png";

export function MetricsModal({ data, type }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        className="bg-[#222222] p-1 ring-1 ring-[#333333] focus:ring-0 hover:ring-1 hover:ring-cyan-900"
      >
        {type === "results" ? "Top results" : "Metrics"}
      </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="bg-[#101017] ">
          <p className="text-white">Chunks & Score</p>
        </Modal.Header>
        <Modal.Body className="bg-[#101017]">
          <div className="space-y-6">
            {data.length === 0 ? (
              <div className="text-white flex gap-2 justify-center items-center">
                <img src={bot} alt="" />
                <p>
                  Upload PDF & ask a question to see its top relevant chunks and
                  scores.
                </p>
              </div>
            ) : type === "results" ? (
              data.map((item, index) => (
                <div key={index} className="text-white">
                  <h3>Score: {item.score.toFixed(2)}</h3>
                  <p>Relevant Chunk: {item.chunk}</p>
                </div>
              ))
            ) : (
              <>
                <div className="text-white">
                  Following are the metrics of the latest query asked by the
                  user:
                </div>
                {Object.keys(data)
                  .slice(0, 8)
                  .map((key, index) => (
                    <div key={index} className="text-white">
                      <p>
                        {key}: {data[key]}
                      </p>
                    </div>
                  ))}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

MetricsModal.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        score: PropTypes.number.isRequired,
        chunk: PropTypes.string.isRequired,
      })
    ),
    PropTypes.objectOf(PropTypes.number),
  ]).isRequired,
  type: PropTypes.string.isRequired,
};
