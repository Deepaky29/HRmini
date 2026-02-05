import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({});
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveForm, setLeaveForm] = useState({
    leavetype: "",
    startdate: "",
    enddate: "",
    reason: "",
  });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("leave"); 

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const fetchLeaves = async () => {
    try {
      const { data } = await API.get("/api/leave/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data } = await API.get("/api/attendance/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
    fetchProfile();
    fetchLeaves();
    fetchAttendance();
  }, []);

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post("/api/leave/apply", leaveForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Leave applied successfully!");
      setLeaveForm({ leavetype: "", startdate: "", enddate: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleMarkAttendance = async () => {
    setMessage("");
    try {
      await API.post("/api/attendance/mark", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Attendance marked!");
      fetchAttendance();
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleCancelLeave = async (id) => {
    setMessage("");
    try {
      await API.delete(`/api/leave/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Leave canceled!");
      fetchLeaves();
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  const getStatusColor = (status) => {
    if (status === "approved") return "bg-green-200 text-green-800";
    if (status === "rejected") return "bg-red-200 text-red-800";
    return "bg-yellow-200 text-yellow-800"; // pending
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 font-semibold rounded shadow">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-lg mb-2">Profile</h2>
          <p><span className="font-semibold">Name:</span> {profile.name}</p>
          <p><span className="font-semibold">Email:</span> {profile.email}</p>
          <p><span className="font-semibold">Role:</span> {profile.role}</p>
          <p><span className="font-semibold">Joined:</span> {profile.dateOfJoining}</p>
          <p><span className="font-semibold">Leave Balance:</span> {profile.leaveBalance}</p>
        </div>

        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h2 className="font-semibold text-lg mb-2">Apply Leave</h2>
          <form className="space-y-2" onSubmit={handleLeaveSubmit}>
            <input
              type="text"
              name="leavetype"
              placeholder="Leave Type"
              value={leaveForm.leavetype}
              onChange={(e) => setLeaveForm({ ...leaveForm, leavetype: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="date"
              name="startdate"
              value={leaveForm.startdate}
              onChange={(e) => setLeaveForm({ ...leaveForm, startdate: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="date"
              name="enddate"
              value={leaveForm.enddate}
              onChange={(e) => setLeaveForm({ ...leaveForm, enddate: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              name="reason"
              placeholder="Reason"
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
            >
              Apply
            </button>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col justify-between">
          <h2 className="font-semibold text-lg mb-2">Attendance</h2>
          <p className="mb-2">Mark your attendance for today:</p>
          <button
            onClick={handleMarkAttendance}
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition mb-4"
          >
            Mark Today
          </button>
          <p>Total Records: <span className="font-semibold">{attendance.length}</span></p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("leave")}
            className={`px-4 py-2 -mb-px font-semibold border-b-2 ${activeTab === "leave" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"}`}
          >
            Leave History
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 -mb-px font-semibold border-b-2 ${activeTab === "attendance" ? "border-green-500 text-green-500" : "border-transparent text-gray-500"}`}
          >
            Attendance
          </button>
        </div>

        {activeTab === "leave" && (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Start</th>
                <th className="border px-2 py-1">End</th>
                <th className="border px-2 py-1">Reason</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l._id} className="text-center hover:bg-gray-50 transition">
                  <td className="border px-2 py-1">{l.leavetype}</td>
                  <td className="border px-2 py-1">{l.startdate}</td>
                  <td className="border px-2 py-1">{l.enddate}</td>
                  <td className="border px-2 py-1">{l.reason}</td>
                  <td className={`border px-2 py-1 rounded ${getStatusColor(l.status)}`}>{l.status}</td>
                  <td className="border px-2 py-1">
                    {l.status === "pending" && (
                      <button
                        onClick={() => handleCancelLeave(l._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "attendance" && (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a._id} className="text-center hover:bg-gray-50 transition">
                  <td className="border px-2 py-1">{a.date}</td>
                  <td className="border px-2 py-1">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
