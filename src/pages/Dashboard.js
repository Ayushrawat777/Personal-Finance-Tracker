import { useEffect, useState } from "react";
import React from "react";
import Cards from "../components/Cards";
import AddIncomeModal from "../components/Modals/addIncome";
import AddExpenseModal from "../components/Modals/addExpense";
import {
  doc,
  getDocs,
  query,
  updateDoc,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import { toast } from "react-toastify";
import { db } from "../firebase";
import TransactionsTable from "../components/TransactionsTable";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    if (!values.amount || isNaN(values.amount)) {
      toast.error("Invalid amount entered");
      return;
    }
    const formattedDate = moment(values.date.toDate()).format("YYYY-MM-DD");
    const newTransaction = {
      type: type,
      date: formattedDate,
      amount: parseFloat(values.amount) || 0,
      tag: values.tag || "Other",
      name: values.name || "Untitled",
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );

      if (!many) {
        toast.success("Transaction Added!");
      }

      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);

      calculateBalance();
    } catch (e) {
      console.error("Error adding document:", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]); // ✅ Only runs when user is available

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push({ ...doc.data(), id: doc.id });
      });
      setTransactions(transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  // Function to edit a transaction
  async function editTransaction(id,updatedData) {
     if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const transactionRef = doc(db, `users/${user.uid}/transactions`, id);
      await updateDoc(transactionRef, updatedData); // ✅ Update the Firestore document
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === id
            ? { ...transaction, ...updatedData }
            : transaction
        )
      );
      toast.success("Transaction Updated!");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Couldn't update transaction");
    }  
  }

  // Function to delete a transaction
  async function deleteTransaction(id) {
    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    try {
      await deleteDoc(doc(db, `users/${user.uid}/transactions/`, id)); // ✅ Delete from Firestore
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
      toast.success("Transaction Deleted!");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Couldn't delete transaction");
    }
  }
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {" "}
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {transactions && transactions.length != 0 ? (
            <ChartComponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
            deleteTransaction={deleteTransaction}
            editTransaction={editTransaction}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
