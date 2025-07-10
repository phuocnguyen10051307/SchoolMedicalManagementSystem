// src/hooks/useParentData.js
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getInforAccount } from "../service/service";

export const useParentData = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.account_id || user.role_id !== "PARENT") return;

    const fetchParentInfo = async () => {
      try {
        const res = await getInforAccount(user.account_id);
        setData(res);
      } catch (err) {
        setError(err.message || "Lỗi khi tải dữ liệu phụ huynh");
      } finally {
        setLoading(false);
      }
    };

    fetchParentInfo();
  }, [user]);

  return { data, loading, error };
};
