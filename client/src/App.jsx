import { useEffect, useState } from "react";

// Khai báo URL Backend trên Render
const API_BASE_URL = "https://mern-backend-237337-api.onrender.com";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ID của sinh viên đang được sửa
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách sinh viên
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/students`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Nếu đang sửa
      if (editingId) {
        const response = await fetch(`${API_BASE_URL}/api/students/${editingId}`, {
          method: "PUT",
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
          alert(data.error || "Cập nhật sinh viên thất bại");
          return;
        }

        alert("Cập nhật sinh viên thành công!");

        setStudents(
          students.map((student) =>
            student._id === editingId ? data : student
          )
        );

        setEditingId(null);
      } else {
        // Nếu đang thêm sinh viên
        const response = await fetch(`${API_BASE_URL}/api/students`, {
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
      }

      // Xóa dữ liệu form
      setStudentId("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối Backend");
    }
  };

  // Bắt đầu sửa một sinh viên
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // Hủy sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Xóa sinh viên thất bại");
        return;
      }

      alert("Xóa sinh viên thành công!");

      // Cập nhật lại danh sách trên giao diện
      setStudents(
        students.filter((student) => student._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối Backend");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Quản lý sinh viên</h1>

      <h2>{editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}</h2>

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

        <button type="submit">
          {editingId ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{ marginLeft: "10px" }}
          >
            Hủy
          </button>
        )}
      </form>

      <hr />

      <h2>Quản lý Danh sách sinh viên</h2>

      <ul>
        {students.map((student) => (
          <li key={student._id}>
            <strong>{student.studentId}</strong> - {student.name} - {student.email}{" "}
            
            <button onClick={() => handleEdit(student)}>
              Sửa
            </button>

            <button
              onClick={() => handleDelete(student._id)}
              style={{ marginLeft: "10px" }}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;