import { Home } from "./Home";
import React, { useState, useEffect } from "react";
import { useLazyGetUserQuery } from "@/Services";
import { useAppSelector } from "@/Hooks/redux";
import { selectTransactions } from "@/Store/reducers/transactions";

export const HomeContainer = () => {
  const [userId, setUserId] = useState("9");

  const [fetchOne, { data, isSuccess, isLoading, isFetching, error }] =
    useLazyGetUserQuery();

  const transactions = useAppSelector(selectTransactions);

  useEffect(() => {
    fetchOne(userId);
  }, [fetchOne, userId]);

  return (
    <Home
      data={data}
      isLoading={isLoading}
      transactions={transactions}
    />
  );
};
