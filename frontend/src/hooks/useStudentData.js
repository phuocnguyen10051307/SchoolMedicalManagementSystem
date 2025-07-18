import { useEffect, useState } from "react";
import axios from "../service/axiosInstance";

const useStudentData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Token không tồn tại");

        const response = await axios.get("/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
      } catch (err) {
        const message =
          err?.response?.data?.message || err.message || "Lỗi lấy dữ liệu học sinh";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  return { data, loading, error };
};

export default useStudentData;
