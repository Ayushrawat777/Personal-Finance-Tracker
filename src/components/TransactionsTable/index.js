import {
  Table,
  Select,
  Radio,
  Input,
  Flex,
  Button,
  Modal,
  DatePicker,
} from "antd";
import { useState } from "react";
import * as React from "react";
import searchIcon from "../../assets/search.svg";
import { unparse, parse } from "papaparse";
import { toast } from "react-toastify";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Form } from "antd";
import moment from "moment";

const TransactionsTable = ({
  transactions,
  addTransaction,
  fetchTransactions,
  deleteTransaction,
  editTransaction
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState("");
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactionId, setEditTransactionId] = useState(null);
  const [transaction, setEditTransaction] = useState(null);
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  React.useEffect(() => {
    if (transaction) {
      form.setFieldsValue({
        name: transaction.name,
        id: transaction.id,
        amount: transaction.amount,
        date: transaction.date ? moment(transaction.date) : null, // Ensure date format
        tag: transaction.tag,
      });
    } 
  }, [transaction, form]);
  
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span
          style={{
            color: type === "income" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {type.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Button
          type="danger"
          danger={true}
          onClick={() => deleteTransaction(record.id)}
          icon={<DeleteOutlined />}
        />
      ),
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => editData(record)}
          icon={<EditOutlined />}
        />
      ),
    },
  ];


  //Edit data modal
  const editData = (data) => {
    showIncomeModal();
    const id=data.id
    setEditTransactionId(id);
    setEditTransaction(data);
  };

  // ✅ Fixed Filtering Logic
  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "all" || item.type === typeFilter)
  );

  // ✅ Fixed Sorting Logic
  let sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") return new Date(a.date) - new Date(b.date);
    if (sortKey === "amount") return (a.amount || 0) - (b.amount || 0);
    return 0;
  });

  // ✅ Export CSV Function
  function exportCSV() {
    const csv = unparse({
      data: transactions,
      fields: ["name", "type", "tag", "date", "amount"],
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ✅ Import CSV Function
  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  const onFinish = (values, type) => {
    if (!values.amount || isNaN(values.amount)) {
      toast.error("Invalid amount entered");
      return;
    }
    const formattedDate = moment(values.date.toDate()).format("YYYY-MM-DD");
    const newTransaction = {
      type,
      date: formattedDate,
      amount: parseFloat(values.amount) || 0,
      tag: values.tag || "Other",
      name: values.name || "Untitled",
    };
    editTransaction(transactionId, newTransaction); // Pass id separately
  };

  return (
    <div style={{ width: "100%", padding: "0rem 2rem" }}>
      <Modal
        style={{ fontWeight: 600 }}
        title="Add Expense"
        visible={isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            onFinish(values, "expense");
            form.resetFields();
          }}
        >
          <Form.Item
            style={{ fontWeight: 600 }}
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name of the transaction!",
              },
            ]}
          >
            <Input type="text" className="custom-input" />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: 600 }}
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input the expense amount!",
              },
            ]}
          >
            <Input type="number" className="custom-input" />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: 600 }}
            label="Date"
            name="date"
            rules={[
              {
                required: true,
                message: "Please select the expense Date!",
              },
            ]}
          >
            <DatePicker className="custom-input" />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: 600 }}
            label="Tag"
            name="tag"
            rules={[
              {
                required: true,
                message: "Please select a tag!",
              },
            ]}
          >
            <Select className="select-input-2">
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="education">Education</Select.Option>
              <Select.Option value="office">Salary</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button className="btn btn-blue" type="primary" htmlType="submit">
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchIcon} alt="Search" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="all">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          {" "}
          <h2>My Transactions</h2>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportCSV}>
              Export to CSV
            </button>
            <label for="file-csv" className="btn btn-blue">
              Import from CSV {<UploadOutlined />}
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              onChange={importFromCsv}
              required
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table dataSource={sortedTransactions} columns={columns} rowKey="id" />
      </div>
    </div>
  );
};

export default TransactionsTable;
