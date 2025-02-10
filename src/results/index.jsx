import { useEffect, useState } from "react";
import { Footer } from "@/layouts/footer";
const totalPerPages = 10;

const ResultAnswer = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('http://localhost:5000/getResults')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => prevPage + direction);
  };

  const paginatedData = data.slice((currentPage - 1) * totalPerPages, currentPage * totalPerPages);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Table Quiz</h1>
      <div className="flex justify-end">
      </div>
      <div className="card">
        <div className="card-body p-0">
          <div className="relative h-[700px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin] z-10">
            <table className="table mt-3">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">No</th>
                  <th className="table-head">Name</th>
                  <th className="table-head">Score</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {paginatedData.map((question, index) => (
                <tr key={question.id} className="table-row">
                <td className="table-cell">{(currentPage - 1) * totalPerPages + index + 1}</td>
                    <td className="table-cell">{question.name}</td>
                    <td className="table-cell">{question.score}</td>
                </tr>
                ))}
            </tbody>
        </table>
        </div>
            <hr />
        <div className='mt-5 flex justify-end mr-10 items-center gap-5 text-red-500'>
            <button
            className="bg-red-500 text-white p-2 rounded-lg"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(-1)}
            >
                Back
            </button>
            <span>Pages: {currentPage} of {Math.ceil(data.length / totalPerPages)}</span>
                <button
                onClick={() => handlePageChange(1)}
                className='bg-red-500 text-white p-2 rounded-lg'
                disabled={currentPage === Math.ceil(data.length / totalPerPages)}
                >
                Next
            </button>
            </div>
        </div>
    </div>
    <Footer />
    </div>
    );
};

export default ResultAnswer;
             