import { useEffect, useState } from "react";
import { Footer } from "@/layouts/footer";
import { PencilLine, Trash } from "lucide-react";

const totalPerPages = 10;

const Quiz = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: [{ id: 1, option: "" }, { id: 2, option: "" }, { id: 3, option: "" }, { id: 4, option: "" }],
    answer: "",
    image: null,
    video: null
  });
  const [oldImage, setOldImage] = useState(null);
  const [oldVideo, setOldVideo] = useState(null);
  const [notification, setNotification] = useState("");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetch('https://api-backend-beige.vercel.app/quiz')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
    setNewQuestion({
      question: "",
      options: [{ id: 1, option: "" }, { id: 2, option: "" }, { id: 3, option: "" }, { id: 4, option: "" }],
      answer: "",
      image: null,
      video: null
    });
    setOldImage(null);
    setOldVideo(null);
  };

  const handleClose = () => {
    setOpen(false);
    setNotification("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOptionChange = (id, value) => {
    setNewQuestion(prevState => ({
      ...prevState,
      options: prevState.options.map(opt => opt.id === id ? { ...opt, option: value } : opt)
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewQuestion(prevState => ({
      ...prevState,
      [name]: files[0]
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("question", newQuestion.question);
    formData.append("options", JSON.stringify(newQuestion.options));
    formData.append("answer", newQuestion.answer);
    if (newQuestion.image) {
      formData.append("image", newQuestion.image);
    } else if (oldImage) {
      formData.append("image", oldImage);
    }
    if (newQuestion.video) {
      formData.append("video", newQuestion.video);
    } else if (oldVideo) {
      formData.append("video", oldVideo);
    }

    const requestOptions = {
      method: isEdit ? 'PUT' : 'POST',
      body: formData
    };

    fetch(`https://api-backend-git-main-toriqs-projects-6abf52de.vercel.app/quiz${isEdit ? `/${editId}` : ''}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (!isEdit) {
          setData(prevData => [...prevData, data.newQuestion]);
        } else {
          setData(prevData => prevData.map(question => question.id === data.newQuestion.id ? data.newQuestion : question));
        }
        setNotification(data.message);
        handleClose();
        window.location.reload();
      });
  };

  const handleEdit = (question) => {
    setEditId(question.id);
    setIsEdit(true);
    setNewQuestion({
      question: question.question,
      options: JSON.parse(question.options),
      answer: question.answer,
      image: null,
      video: null
    });
    setOldImage(question.image); 
    setOldVideo(question.video);
    setOpen(true);
  };

  const handleDelete = (id) => {
    fetch(`https://api-backend-git-main-toriqs-projects-6abf52de.vercel.app/quiz/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
          setData(prevData => prevData.filter(question => question.id !== id));
          setNotification(data.message);
        setDeleteConfirmOpen(false);
      });
  };

  const handleDeleteConfirmOpen = (id) => {
    setDeleteConfirmOpen(true);
    setDeleteId(id);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };

  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => prevPage + direction);
  };

  const paginatedData = data.slice((currentPage - 1) * totalPerPages, currentPage * totalPerPages);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Table Quiz</h1>
      <div className="flex justify-end">
        <button
          className="rounded-md bg-slate-800 py-2 px-4 w-23 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button"
          onClick={handleOpen}
        >
          Add Quiz
        </button>
      </div>
      {open && (
        <div className="relative inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md mx-4 sm:mx-0">
            <h2 className="text-lg font-bold mb-4">{isEdit ? 'Edit Quiz' : 'Add Quiz'}</h2>
            <input
              type="text"
              name="question"
              value={newQuestion.question}
              onChange={handleInputChange}
              placeholder="Question"
              className="mb-4 p-2 border rounded w-full"
            />
            {newQuestion.options.map(opt => (
              <input
                key={opt.id}
                type="text"
                name={`option${opt.id}`}
                value={opt.option}
                onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                placeholder={`Option ${opt.id}`}
                className="mb-4 p-2 border rounded w-full"
              />
            ))}
            <input
              type="text"
              name="answer"
              value={newQuestion.answer}
              onChange={handleInputChange}
              placeholder="Answer"
              className="mb-4 p-2 border rounded w-full"
            />
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mb-4 p-2 border rounded w-full"
            />
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
              className="mb-4 p-2 border rounded w-full"
            />
            {notification && (
              <div className="mb-4 text-green-500">
                ({notification})
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                {isEdit ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-body p-0">
          <div className="relative h-[700px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin] z-10">
            <table className="table mt-3">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">No</th>
                  <th className="table-head">Question</th>
                  <th className="table-head">Options</th>
                  <th className="table-head">Answer</th>
                  <th className="table-head">Image</th>
                  <th className="table-head">Video</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {paginatedData.map((question, index) => (
                <tr key={question.id} className="table-row">
                <td className="table-cell">{(currentPage - 1) * totalPerPages + index + 1}</td>
                    <td className="table-cell">{question.question}</td>
                    <td className="table-cell">{JSON.stringify(question.options)}</td>
                    <td className="table-cell">{question.answer}</td>
                    <td className="table-cell">
                    <img src={question.image} alt="Question Image" className="h-16 w-16 object-cover"/>
                    </td>
                    <td className="table-cell">
                    <iframe 
                    width="200" 
                    height="150" 
                    src={question.video} 
                    frameBorder="0" 
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    ></iframe>
                </td>
                <td className="table-cell">
                <PencilLine onClick={() => handleEdit(question)} className="mr-2 cursor-pointer text-blue-500" />
                <Trash onClick={() => handleDeleteConfirmOpen(question.id)} className="cursor-pointer text-red-500" />
                </td>
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
            {deleteConfirmOpen && (
               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
               <div className="bg-white p-6 rounded-md mx-4 sm:mx-0">
               <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus Quiz</h2>
               <p>Apakah Anda yakin ingin menghapus quiz ini?</p>
                 {notification && (
                    <div className="mb-4 text-green-500">
                     ({notification})
                     </div>
                  )}
               <div className="flex justify-end gap-2 mt-4">
                <button
                onClick={handleDeleteConfirmClose}
                className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                Batal
                </button>
                <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-500 text-white py-2 px-4 rounded"
                >
                Hapus
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Quiz;
             
