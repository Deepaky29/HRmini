import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [employeesLeaves, setEmployeesLeaves] = useState([]);
  const [employeesAttendance, setEmployeesAttendance] = useState([]);
  const [message, setMessage] = useState("");
  const [leaveSearch, setLeaveSearch] = useState("");
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [showLeaves, setShowLeaves] = useState(true);
  const [showAttendance, setShowAttendance] = useState(true);

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/api/leave/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("LEAVE API RESPONSE:", data);
      setEmployeesLeaves(data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const handleLeaveStatus = async (id, status) => {
    setMessage("");
    try {
      await API.patch(
        `/api/leave/admin/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Leave ${status}!`);
      fetchLeaves();
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data } = await API.get("/api/attendance/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeesAttendance(data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
    fetchLeaves();
    fetchAttendance();
  }, []);

  const filteredLeaves = employeesLeaves.filter((l) =>
  (l.userid?.name
 || "").toLowerCase().includes(leaveSearch.toLowerCase())
);

  const filteredAttendance = employeesAttendance.filter((a) =>
  (a.employeeName || "").toLowerCase().includes(attendanceSearch.toLowerCase())
);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}

      <div className="mb-4 flex justify-between items-center">
        <h2
          className="font-semibold text-lg cursor-pointer"
          onClick={() => setShowLeaves(!showLeaves)}
        >
          {showLeaves ? "▼" : "▶"} All Leave Requests
        </h2>
        <input
          type="text"
          placeholder="Search Employee"
          value={leaveSearch}
          onChange={(e) => setLeaveSearch(e.target.value)}
          className="border p-1 rounded"
        />
      </div>

      {showLeaves && (
        <div className="mb-6 bg-white p-4 rounded shadow overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Employee</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Start</th>
                <th className="border px-2 py-1">End</th>
                <th className="border px-2 py-1">Reason</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((l) => (
                <tr
                  key={l._id}
                  className={`text-center ${
                    l.status === "pending" ? "bg-yellow-50" : ""
                  }`}
                >
                  <td className="border px-2 py-1">{l.userid?.name}</td>
                  <td className="border px-2 py-1">{l.leavetype}</td>
                  <td className="border px-2 py-1">{l.startdate}</td>
                  <td className="border px-2 py-1">{l.enddate}</td>
                  <td className="border px-2 py-1">{l.reason}</td>
                  <td className="border px-2 py-1">{l.status}</td>
                  <td className="border px-2 py-1 space-x-1">
                    {l.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleLeaveStatus(l._id, "approved")}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleLeaveStatus(l._id, "rejected")}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <h2
          className="font-semibold text-lg cursor-pointer"
          onClick={() => setShowAttendance(!showAttendance)}
        >
          {showAttendance ? "▼" : "▶"} Attendance Overview
        </h2>
        <input
          type="text"
          placeholder="Search Employee"
          value={attendanceSearch}
          onChange={(e) => setAttendanceSearch(e.target.value)}
          className="border p-1 rounded"
        />
      </div>

      {showAttendance && (
        <div className="mb-6 bg-white p-4 rounded shadow overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Employee</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((a) => (
                <tr
                  key={a._id}
                  className={`text-center ${
                    a.status === "absent" ? "bg-red-50" : "bg-green-50"
                  }`}
                >
                  <td className="border px-2 py-1">{a.employeeName}</td>
                  <td className="border px-2 py-1">{a.date}</td>
                  <td className="border px-2 py-1">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
