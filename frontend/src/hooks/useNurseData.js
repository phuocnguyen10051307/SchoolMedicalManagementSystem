
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { getNurseProfile } from "../service/service";

export const useNurseData = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosNurseInfo = useCallback(async () => {
    if (!user?.account_id || user.role_id !== "NURSE") return;
    setLoading(true);
    try {
      const res = await getNurseProfile(user.account_id);
      setData(res);
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu y tá");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    axiosNurseInfo();
  }, [axiosNurseInfo]);

  return { data, loading, error, refetch: axiosNurseInfo};
};
