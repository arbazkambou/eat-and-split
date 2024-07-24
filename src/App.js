import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleFriendSelection(friend) {
    //setSelectedFriend(friend);
    setSelectedFriend((selectedFriend) =>
      selectedFriend?.id === friend.id ? null : friend
    );
    setShowAddFriendForm(false);
  }
  function handleAddFriendFormClick() {
    setShowAddFriendForm(!showAddFriendForm);
  }

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    handleAddFriendFormClick();
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleFriendSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriendForm ? (
          <FormAddFriend
            onClick={handleAddFriendFormClick}
            handleAddFriend={handleAddFriend}
          />
        ) : null}

        <Button onClick={handleAddFriendFormClick}>
          {showAddFriendForm ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={() => onClick()}>
      {children}
    </button>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  return (
    <li className={friend.id === selectedFriend?.id ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          Your owe {friend.name} {Math.abs(friend.balance)}{" "}
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}
        </p>
      ) : (
        <p> You and {friend.name} are even </p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {friend.id === selectedFriend?.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  function handleSubmit(e) {
    e.preventDefault();
    if (name === "" || image === "") return;
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      id,
      balance: 0,
    };
    handleAddFriend(newFriend);
    console.log(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="">🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button className="button">Add</button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoPaid, setWhoPaid] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";
  function handleSplitBill(e) {
    e.preventDefault();
    if (bill === "" || paidByUser === "") return;
    onSplitBill(whoPaid === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={(e) => handleSplitBill(e)}>
      <h2>Split a bill with {selectedFriend?.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label htmlFor="">🧍‍♂️Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => setPaidByUser(Number(e.target.value))}
      />
      <label htmlFor="">🧑‍🤝‍🧑 {selectedFriend?.name} expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label htmlFor="">🤑 Who is paying the bill</label>
      <select
        name=""
        id=""
        value={whoPaid}
        onChange={(e) => setWhoPaid(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <button className="button">Split bill</button>
    </form>
  );
}
