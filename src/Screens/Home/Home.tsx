import { i18n, LocalizationKey } from "@/Localization";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Heading, HStack, VStack, Button, useToast } from "native-base";
import { User } from "@/Services";
import { ITransaction } from "@/types";
import { QuickAddTransaction } from "@/Screens/QuickAdd";
import { TransactionList } from "@/Components";

export interface IHomeProps {
  data: User | undefined;
  isLoading: boolean;
  transactions: ITransaction[];
  onAddTransaction?: (transaction: ITransaction) => void;
}

export const Home = (props: IHomeProps) => {
  const { data, isLoading, transactions, onAddTransaction } = props;
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const toast = useToast();

  const handleTransactionAdded = (transaction: ITransaction) => {
    toast.show({
      description: `Đã thêm giao dịch: ${transaction.amount.toLocaleString("vi-VN")}₫`,
      duration: 2000,
      placement: "top",
    });
    setShowQuickAdd(false);
    if (onAddTransaction) {
      onAddTransaction(transaction);
    }
  };

  const totalExpense = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      {showQuickAdd ? (
        <QuickAddTransaction
          onTransactionAdded={handleTransactionAdded}
          onCancel={() => setShowQuickAdd(false)}
          autoFocus={true}
        />
      ) : (
        <View style={styles.container}>
          {/* Header */}
          <VStack space={3} style={styles.header}>
            <HStack justifyContent="space-between" alignItems="center">
              <Heading color="primary.600" fontSize="xl">
                {i18n.t(LocalizationKey.HOME)}
              </Heading>
            </HStack>

            {/* Summary */}
            <View style={styles.summaryBox}>
              <Heading fontSize="sm" color="coolGray.600">
                Tổng chi phí hôm nay
              </Heading>
              <Heading fontSize="2xl" color="danger.600" bold>
                {totalExpense.toLocaleString("vi-VN")}₫
              </Heading>
            </View>

            {/* Add Button */}
            <Button
              onPress={() => setShowQuickAdd(true)}
              bg="primary.600"
              borderRadius={8}
              _text={{ bold: true }}
              size="lg"
            >
              + Thêm giao dịch nhanh
            </Button>
          </VStack>

          {/* Transaction List */}
          <ScrollView
            style={styles.listContainer}
            showsVerticalScrollIndicator={false}
          >
            <TransactionList
              transactions={transactions}
              onAddNewClick={() => setShowQuickAdd(true)}
              showActions={true}
            />
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryBox: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  listContainer: {
    flex: 1,
    paddingTop: 8,
  },
});
