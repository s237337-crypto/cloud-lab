import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        name,
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Thêm sinh viên thất bại");
      return;
    }

    alert("Thêm sinh viên thành công!");

    setStudents([...students, data]);

    setStudentId("");
    setName("");
    setEmail("");
  } catch (error) {
    console.error(error);
    alert("Không thể kết nối Backend");
  }
};
  return (
    <div style={{ padding: "40px" }}>
      <h1>Quản lý sinh viên</h1>

      <h2>Thêm sinh viên</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập MSSV"
          />
        </div>

        <br />

        <div>
          <label>Họ tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
          />
        </div>

        <br />

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        <br />

        <button type="submit">Thêm sinh viên</button>
      </form>

      <hr />

      <h2>Danh sách sinh viên</h2>

      <ul>
        {students.map((student) => (
          <li key={student._id}>
            <strong>{student.studentId}</strong> - {student.name} -{" "}
            {student.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;