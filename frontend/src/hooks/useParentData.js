import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getInforAccount } from "../service/service";

export const useParentData = (fetchFn, role) => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.account_id || user.role_id !== role) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetchFn(user.account_id);
        setData(res);
      } catch (err) {
        const message =
          err?.response?.data?.message || err.message || "Lỗi khi tải dữ liệu";

        if (
          err?.response?.status === 401 ||
          err?.response?.status === 403 ||
          message === "Bạn chưa đăng nhập (không có token)"
        ) {
          localStorage.clear();
          window.location.href = "/";
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading, error };
};

