import { useEffect, useState } from "react";
import "./App.css";

function getColor(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (days <= 7) return "red";
  if (days <= 14) return "orange";
  if (days <= 21) return "yellow";
  if (days <= 28) return "green";

  return "#666";
}

function App() {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAssignment = {
      title,
      courseCode,
      dueDate,
    };

    fetch("http://localhost:3000/api/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAssignment),
    })
      .then((res) => res.json())
      .then((data) => {
        setAssignments((prev) => [...prev, data]);

        setTitle("");
        setCourseCode("");
        setDueDate("");
      })
      .catch((err) => console.error(err));
  };

  const handleCompleteClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  const confirmComplete = () => {
    fetch(`http://localhost:3000/api/assignments/${selectedAssignment.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setAssignments((prev) =>
          prev.filter((a) => a.id !== selectedAssignment.id),
        );

        setShowModal(false);
        setSelectedAssignment(null);
      })
      .catch((err) => console.error(err));
  };

  const cancelComplete = () => {
    setShowModal(false);
    setSelectedAssignment(null);
  };

  return (
    <div className="container">
      <header>
        <h1>StudySpace</h1>
        <p>Track your assignments and deadlines</p>
      </header>

      <main>
        <section className="form-panel">
          <h2>Add Assignment</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Assignment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />

            <button type="submit">Add Assignment</button>
          </form>
        </section>

        <section className="timeline-panel">
          <h2>Upcoming Assignments</h2>

          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="assignment-card"
              style={{
                borderLeftColor: getColor(assignment.dueDate),
              }}
            >
              <h3>{assignment.title}</h3>

              <p className="course-code">{assignment.courseCode}</p>

              <p>
                {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <button
                className="complete-btn"
                onClick={() => handleCompleteClick(assignment)}
              >
                Complete Assignment
              </button>
            </div>
          ))}
        </section>
      </main>

      {showModal && selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Complete Assignment</h2>

            <p>
              <strong>{selectedAssignment.title}</strong>
            </p>

            <p>{selectedAssignment.courseCode}</p>

            <p>
              Are you sure you have completed all of the requirements for this
              assignment?
            </p>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelComplete}>
                Cancel
              </button>

              <button className="confirm-btn" onClick={confirmComplete}>
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
