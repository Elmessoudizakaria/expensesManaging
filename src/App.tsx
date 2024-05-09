import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  FaCopy,
  FaTrashAlt,
  FaAlignJustify,
  FaAngleRight,
  FaAngleLeft,
  FaHome,
  FaAppleAlt,
  FaTshirt,
  FaCar,
  FaUserMd,
  FaBus,
  FaWallet,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";

const EXPENSE_CATEGORIES = [
  "house",
  "food",
  "transport",
  "health",
  "clothes",
  "Car",
];
interface Expense {
  name: string;
  value: string;
  id: string;
}
const App = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [expenseName, setExpenseName] = useState("");
  const [expenseValue, setExpenseValue] = useState("");
  const [budget, setBudget] = useState(5000);
  const [selectedList, setSelectedList] = useState("");
  const [expenseCategories, setExpenseCategories] =
    useState(EXPENSE_CATEGORIES);

  useEffect(() => {
    // Load expenses from localStorage
    const storedExpenses = JSON.parse(
      localStorage.getItem(formattedDate()) || "[]",
    );
    setExpenses(storedExpenses);
  }, [selectedMonth]);

  const handleAddExpense = (event: any) => {
    event.preventDefault();
    if (!expenseName || !expenseValue) return;
    addExpense(expenseName, expenseValue);
    setExpenseName("");
    setExpenseValue("");
  };
  const saveExpenses = (expenses: Expense[]) => {
    localStorage.setItem(formattedDate(), JSON.stringify(expenses));
    setExpenses(expenses);
  };

  const addExpense = (name: string, value: string) => {
    const newExpenses: Expense[] = [
      ...expenses,
      { name, value, id: `${expenses.length}` },
    ];
    saveExpenses(newExpenses);
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter((item: Expense) => item.id !== id));
  };

  const duplicateExpense = (id: string) => {
    const expense = expenses.filter((item: Expense) => item.id === id)[0];
    const newExpenses = [...expenses, { ...expense, id: `${expenses.length}` }];
    saveExpenses(newExpenses);
  };

  const deleteGroupExpense = (name: string) => {
    saveExpenses(expenses.filter((item: Expense) => item.name !== name));
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedMonth(newDate);
  };

  const formattedDate = () => {
    const month = selectedMonth.getMonth() + 1;
    const year = selectedMonth.getFullYear();
    return `${month.toString().padStart(2, "0")}/${year}`;
  };

  const totalExpenses = (expensesValue: Expense[]) => {
    return expensesValue.reduce((accumulator: any, currentValue: any) => {
      return accumulator + currentValue.value;
    }, 0);
  };
  const categorieIcons = (name: string) => {
    switch (name) {
      case "house":
        return <FaHome className="expense-icon" />;
      case "food":
        return <FaAppleAlt className="expense-icon" />;
      case "clothes":
        return <FaTshirt className="expense-icon" />;
      case "Car":
        return <FaCar className="expense-icon" />;
      case "health":
        return <FaUserMd className="expense-icon" />;
      case "transport":
        return <FaBus className="expense-icon" />;
      default:
        return <FaAlignJustify className="expense-icon" />;
    }
  };
  const groupedList = expenses.reduce((acc: any, curr: Expense) => {
    const key = curr.name;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <div className="container">
      <div className="expense-manager">
        <div className="month-navigation">
          <button onClick={handlePreviousMonth}>
            <FaAngleLeft />
            Previous
          </button>
          <h3>Expenses for {formattedDate()}</h3>
          <button onClick={handleNextMonth}>
            Next <FaAngleRight />
          </button>
        </div>
        <form onSubmit={handleAddExpense}>
          <select
            onChange={(e) => setExpenseName(e.target.value)}
            value={expenseName}
            required
          >
            <option value="">select categorie</option>
            {expenseCategories.map((categorie) => (
              <option value={categorie}>{categorie}</option>
            ))}
          </select>
          <input
            type="number"
            value={expenseValue}
            onChange={(e) => setExpenseValue(e.target.value)}
            placeholder="Expense Value"
            required
          />
          <button type="submit">Add Expense</button>
        </form>
        <ul className="expense-list">
          {Object.keys(groupedList).map((key, index) => {
            return (
              <>
                <li key={key}>
                  <div className="element-label">
                    <span className="expense-name">
                      {categorieIcons(key)}
                      {key}{" "}
                      {groupedList[key].length > 1
                        ? groupedList[key].length
                        : ""}
                    </span>
                    <span className="expense-value">
                      {totalExpenses(groupedList[key])} dhs
                    </span>
                  </div>
                  <div className="element-buttons">
                    {groupedList[key].length > 1 ? (
                      <button>
                        {selectedList === key ? (
                          <FaAngleUp
                            className="duplicate"
                            onClick={() => setSelectedList("")}
                          />
                        ) : (
                          <FaAngleDown
                            className="duplicate"
                            onClick={() => setSelectedList(key)}
                          />
                        )}
                      </button>
                    ) : null}
                    <button onClick={() => deleteGroupExpense(key)}>
                      <FaTrashAlt className="remove" />
                    </button>
                  </div>
                </li>
                {selectedList === key && groupedList[key].length > 1 ? (
                  <>
                    {groupedList[key].map((item: any) => (
                      <li>
                        <div className="element-label">
                          <span className="expense-name">{item.name}</span>
                          <span className="expense-value">{item.value}</span>
                        </div>
                        <div className="element-buttons">
                          <button onClick={() => duplicateExpense(item.id)}>
                            <FaCopy className="duplicate" />
                          </button>
                          <button onClick={() => deleteExpense(item.id)}>
                            <FaTrashAlt className="remove" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </>
                ) : null}
              </>
            );
          })}
        </ul>
        <ul className="expense-list-total">
          <li>
            <span className="expense-name">Expenses </span>
            <span className="expense-name">
              {totalExpenses(expenses)}
              {" DHS "}
            </span>
          </li>
          <li>
            <span className="expense-name">
              <FaWallet className="duplicate" />{" "}
            </span>
            <span className="expense-name">
              {budget - totalExpenses(expenses)}
              {" DHS "}
            </span>
          </li>
        </ul>
      </div>
      <div>
        <button>budget</button>
        <button>categories</button>
      </div>
    </div>
  );
};

export default App;
